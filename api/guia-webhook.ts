import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion,
});

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

function getSubscriptionId(invoice: Stripe.Invoice): string | null {
  const sub = invoice.parent?.subscription_details?.subscription ?? null;
  if (!sub) return null;
  return typeof sub === 'string' ? sub : sub.id;
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    // Handle v2 events (pings, etc.) — just acknowledge them
    if (body.includes('"v2.core.event"')) {
      return new Response('OK', { status: 200 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response('Webhook error', { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, product: metadataProduct, b2bType } = session.metadata as { userId: string; product: string; b2bType: string };

      // line_items is not expanded in webhook events — retrieve with expand
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });
      const priceId = fullSession.line_items?.data[0]?.price?.id;

      let productId = metadataProduct;
      let plan = 'lifetime';

      if (metadataProduct === 'guia_junior_b2b') {
        productId = 'guia_junior_b2b';
        if (b2bType === 'annual') {
          plan = 'b2b_annual';
        } else {
          plan = 'b2b_lifetime';
        }
      } else {
        if (priceId === process.env.STRIPE_PRICE_GUIA_MONTHLY) plan = 'monthly';
        else if (priceId === process.env.STRIPE_PRICE_GUIA_ANNUAL) plan = 'annual';
        else if (priceId === process.env.STRIPE_PRICE_GUIA_LIFETIME) plan = 'lifetime';
        else if (priceId === process.env.STRIPE_PRICE_GUIA_LIFETIME_NORMAL) plan = 'lifetime_normal';
      }

      let expiresAt: string | null = null;
      if (plan === 'monthly') {
        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      } else if (plan === 'annual' || plan === 'b2b_annual') {
        expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      }

      const { error } = await supabaseAdmin.from('user_access').insert({
        user_id: userId,
        product_id: productId,
        plan,
        status: 'active',
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string | null,
        expires_at: expiresAt,
      });

      if (error) {
        console.error('Error inserting user_access:', error);
        return new Response(JSON.stringify({ error: error.message, code: error.code, details: error.details }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else if (event.type === 'invoice.payment_failed') {
      // Handle subscription payment failures
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = getSubscriptionId(invoice);
      if (subscriptionId) {
        await supabaseAdmin.from('user_access')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', subscriptionId);
      }
    } else if (event.type === 'customer.subscription.deleted') {
      // Handle subscription cancellations
      const subscription = event.data.object as Stripe.Subscription;
      await supabaseAdmin.from('user_access')
        .update({ status: 'cancelled', expires_at: new Date().toISOString() })
        .eq('stripe_subscription_id', subscription.id);
    } else if (event.type === 'invoice.payment_succeeded') {
      // Handle subscription renewals — extend expires_at
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = getSubscriptionId(invoice);
      if (subscriptionId && invoice.billing_reason === 'subscription_cycle') {
        const nextBilling = new Date(invoice.lines.data[0]?.period.end * 1000);
        await supabaseAdmin.from('user_access')
          .update({ expires_at: nextBilling.toISOString(), status: 'active' })
          .eq('stripe_subscription_id', subscriptionId);
      }
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

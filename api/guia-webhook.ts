import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const PAYMENTS_ENABLED = process.env.PAYMENTS_ENABLED === 'true';

function getSubscriptionId(invoice: Stripe.Invoice): string | null {
  const sub = invoice.parent?.subscription_details?.subscription ?? null;
  if (!sub) return null;
  return typeof sub === 'string' ? sub : sub.id;
}

export async function POST(req: Request) {
  if (!PAYMENTS_ENABLED) {
    return new Response('Payments disabled', { status: 200 });
  }
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion,
    });
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    // Handle v2 events (pings, etc.) — parse and acknowledge without signature verification
    let parsedBody: Record<string, unknown> | null = null;
    try {
      parsedBody = JSON.parse(body) as Record<string, unknown>;
    } catch {
      // Not valid JSON — will fail signature verification below
    }
    if (parsedBody && parsedBody.type === 'v2.core.event') {
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
      const { userId: rawUserId, product: metadataProduct, b2bType } = session.metadata as { userId: string; product: string; b2bType: string };

      // Resolve userId — for guest checkouts it may be empty
      let userId = rawUserId;
      if (!userId) {
        const customerEmail = session.customer_details?.email;
        if (customerEmail) {
          // Try to find existing user, otherwise invite (creates account + sends email)
          const { data: inviteData } = await supabaseAdmin.auth.admin.inviteUserByEmail(customerEmail);
          if (inviteData?.user) {
            userId = inviteData.user.id;
          } else {
            // User may already exist — search robustly without relying on error text
            let page = 1;
            let found = false;
            while (!found && page <= 5) {
              const { data: listData } = await supabaseAdmin.auth.admin.listUsers({
                perPage: 1000,
                page,
              });
              if (!listData?.users.length) break;
              const existing = listData.users.find((u) => u.email === customerEmail);
              if (existing) {
                userId = existing.id;
                found = true;
              } else {
                page++;
              }
            }
            if (userId) {
              // Send magic link so they get notified of their new purchase
              await supabaseAdmin.auth.admin.generateLink({ type: 'magiclink', email: customerEmail });
            }
          }
        }
        if (!userId) {
          console.error('Could not resolve userId for guest checkout session:', session.id);
          return new Response('Could not resolve user', { status: 500 });
        }
      }

      // line_items is not expanded in webhook events — retrieve with expand
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });
      const priceId = fullSession.line_items?.data[0]?.price?.id;

      let productId = metadataProduct;
      let plan = 'lifetime';

      if (metadataProduct === 'boilerplate') {
        if (priceId === process.env.STRIPE_PRICE_BOILERPLATE_PRO) {
          plan = 'pro';
        } else {
          plan = 'starter';
        }
      } else if (metadataProduct === 'guia_junior_b2b') {
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
      if (plan === 'monthly' || plan === 'annual' || plan === 'b2b_annual') {
        const subscriptionId = session.subscription as string | null;
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          expiresAt = new Date((subscription as any).current_period_end * 1000).toISOString();
        }
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
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
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

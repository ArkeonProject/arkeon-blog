import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const PAYMENTS_ENABLED = process.env.PAYMENTS_ENABLED === 'true';

function getBearerToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization') ?? '';
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
}

function resolveGuiaPriceMetadata(priceId: string): { product: 'guia_junior' | 'guia_junior_b2b'; b2bType: string } | null {
  const b2bAnnual = process.env.STRIPE_PRICE_GUIA_B2B_ANNUAL;
  const b2bLifetime = process.env.STRIPE_PRICE_GUIA_B2B_LIFETIME;
  const allowed = new Set(
    [
      process.env.STRIPE_PRICE_GUIA_MONTHLY,
      process.env.STRIPE_PRICE_GUIA_ANNUAL,
      process.env.STRIPE_PRICE_GUIA_LIFETIME,
      process.env.STRIPE_PRICE_GUIA_LIFETIME_NORMAL,
      b2bAnnual,
      b2bLifetime,
    ].filter((value): value is string => Boolean(value))
  );

  if (!allowed.has(priceId)) {
    return null;
  }

  if (priceId === b2bAnnual) {
    return { product: 'guia_junior_b2b', b2bType: 'annual' };
  }
  if (priceId === b2bLifetime) {
    return { product: 'guia_junior_b2b', b2bType: 'lifetime' };
  }

  return { product: 'guia_junior', b2bType: '' };
}

export async function POST(req: Request) {
  if (!PAYMENTS_ENABLED) {
    return new Response(JSON.stringify({ error: 'Payments are temporarily disabled' }), { status: 410 });
  }
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion,
    });

    const payload = (await req.json()) as { priceId?: string; email?: string };
    const { priceId, email } = payload;

    if (!priceId || typeof priceId !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const priceMetadata = resolveGuiaPriceMetadata(priceId);
    if (!priceMetadata) {
      return new Response(JSON.stringify({ error: 'Invalid price for product' }), { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const token = getBearerToken(req);
    let authenticatedUserId = '';
    let authenticatedUserEmail: string | undefined;

    if (token) {
      const {
        data: { user },
        error: authError,
      } = await supabaseAdmin.auth.getUser(token);

      if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }

      authenticatedUserId = user.id;
      authenticatedUserEmail = user.email ?? undefined;
    }

    // Determine mode from the price object itself to avoid env var mismatch
    const price = await stripe.prices.retrieve(priceId);
    const mode = price.type === 'recurring' ? 'subscription' : 'payment';

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.BASE_URL || 'http://localhost:5173'}/guia-junior/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL || 'http://localhost:5173'}/guia-junior`,
      ...(authenticatedUserEmail || email ? { customer_email: authenticatedUserEmail ?? email } : {}),
      customer_creation: mode === 'payment' ? 'always' : undefined,
      allow_promotion_codes: true,
      metadata: {
        userId: authenticatedUserId,
        product: priceMetadata.product,
        b2bType: priceMetadata.b2bType,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

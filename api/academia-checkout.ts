import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const PAYMENTS_ENABLED = process.env.PAYMENTS_ENABLED === 'true';

function getBearerToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization') ?? '';
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
}

function getAllowedAcademiaPrices(): Set<string> {
  return new Set(
    [
      process.env.STRIPE_PRICE_ACADEMIA,
      process.env.STRIPE_PRICE_ACADEMIA_MONTHLY,
      process.env.STRIPE_PRICE_ACADEMIA_ANNUAL,
      process.env.STRIPE_PRICE_ACADEMIA_LIFETIME,
      ...(process.env.STRIPE_PRICE_ACADEMIA_ALLOWED_IDS ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
    ].filter((value): value is string => Boolean(value))
  );
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

    const token = getBearerToken(req);
    if (!token) {
      return new Response(JSON.stringify({ error: 'Missing auth token' }), { status: 401 });
    }

    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const payload = (await req.json()) as { priceId?: string; email?: string };
    const { priceId, email } = payload;

    if (!priceId || typeof priceId !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const allowedPrices = getAllowedAcademiaPrices();
    if (!allowedPrices.has(priceId)) {
      return new Response(JSON.stringify({ error: 'Invalid price for product' }), { status: 400 });
    }

    const price = await stripe.prices.retrieve(priceId);
    const mode = price.type === 'recurring' ? 'subscription' : 'payment';

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.BASE_URL || 'http://localhost:5173'}/academia/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL || 'http://localhost:5173'}/academia`,
      ...(user.email || email ? { customer_email: user.email ?? email } : {}),
      customer_creation: mode === 'payment' ? 'always' : undefined,
      allow_promotion_codes: true,
      metadata: {
        userId: user.id,
        product: 'academia',
      },
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    console.error('Academia checkout error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

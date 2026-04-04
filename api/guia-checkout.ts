import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion,
});

export async function POST(req: Request) {
  try {
    const { priceId, userId, email, isB2B, b2bType } = await req.json();

    if (!priceId || !userId || !email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Determine mode based on price type
    const isB2BAnnual = isB2B && b2bType === 'annual';
    const mode = isB2BAnnual ? 'subscription' : 'payment';

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.BASE_URL || 'http://localhost:5173'}/guia-junior/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL || 'http://localhost:5173'}/guia-junior`,
      customer_email: email,
      metadata: { 
        userId, 
        product: isB2B ? 'guia_junior_b2b' : 'guia_junior',
        b2bType: isB2B ? b2bType : '',
      },
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

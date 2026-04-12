import type { ActionFunctionArgs } from "react-router";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as Stripe.LatestApiVersion,
});

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  try {
    const { priceId, userId, email } = await request.json();

    if (!priceId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const price = await stripe.prices.retrieve(priceId);
    const mode = price.type === "recurring" ? "subscription" : "payment";

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.BASE_URL || "http://localhost:5173"}/academia/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL || "http://localhost:5173"}/academia`,
      ...(email ? { customer_email: email } : {}),
      customer_creation: mode === "payment" ? "always" : undefined,
      allow_promotion_codes: true,
      metadata: {
        userId: userId ?? "",
        product: "academia",
      },
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Academia checkout error:", message);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

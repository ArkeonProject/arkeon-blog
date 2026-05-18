import type { ActionFunctionArgs } from "react-router";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
const PAYMENTS_ENABLED = process.env.PAYMENTS_ENABLED === "true";

function getBearerToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization") ?? "";
  return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
}

function getAllowedBoilerplatePrices(): Set<string> {
  return new Set(
    [process.env.STRIPE_PRICE_BOILERPLATE_STARTER, process.env.STRIPE_PRICE_BOILERPLATE_PRO].filter(
      (value): value is string => Boolean(value)
    )
  );
}

export async function action({ request }: ActionFunctionArgs) {
  if (!PAYMENTS_ENABLED) {
    return new Response(JSON.stringify({ error: "Payments are temporarily disabled" }), { status: 410 });
  }
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  try {
    const token = getBearerToken(request);
    if (!token) {
      return new Response(JSON.stringify({ error: "Missing auth token" }), { status: 401 });
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
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const payload = (await request.json()) as { priceId?: string; email?: string };
    const { priceId, email } = payload;

    if (!priceId || typeof priceId !== "string") {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const allowedPrices = getAllowedBoilerplatePrices();
    if (!allowedPrices.has(priceId)) {
      return new Response(JSON.stringify({ error: "Invalid price for product" }), { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-01-27.acacia" as Stripe.LatestApiVersion,
    });
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.BASE_URL || "http://localhost:5173"}/arkeonix/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL || "http://localhost:5173"}/arkeonix`,
      ...(user.email || email ? { customer_email: user.email ?? email } : {}),
      allow_promotion_codes: true,
      metadata: {
        userId: user.id,
        product: "boilerplate",
      },
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    console.error("Boilerplate checkout error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

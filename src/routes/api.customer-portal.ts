import type { ActionFunctionArgs } from "react-router";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { getBaseUrl } from "./utils/base-url";
import { logRouteError } from "./utils/log-route-error";

function arePaymentsEnabled(): boolean {
  return process.env.PAYMENTS_ENABLED === "true";
}

export async function action({ request }: ActionFunctionArgs) {
  if (!arePaymentsEnabled()) {
    return new Response(JSON.stringify({ error: "Customer portal is temporarily disabled" }), { status: 410 });
  }
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-01-27.acacia" as Stripe.LatestApiVersion,
    });
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const authHeader = request.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return new Response(JSON.stringify({ error: "Missing auth token" }), { status: 401 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("user_access")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .not("stripe_customer_id", "is", null)
      .limit(1)
      .single();

    if (error || !data?.stripe_customer_id) {
      return new Response(JSON.stringify({ error: "No Stripe customer found" }), { status: 404 });
    }

    const baseUrl = getBaseUrl();

    const session = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: `${baseUrl}/recursos/guia-junior/dashboard`,
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    logRouteError("Customer portal error", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

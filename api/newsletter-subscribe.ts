import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { render } from "@react-email/render";
import WelcomeNewsletter from "@/src/emails/WelcomeNewsletter.js";

// Serverless (sin Edge) — @react-email usa tailwindcss, no soportado en Edge runtime

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(request: Request): Promise<Response> {
  // Only accept POST
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // CORS preflight
  const origin = request.headers.get("origin") ?? "";
  const corsHeaders = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  let email: string;
  try {
    const body = await request.json() as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  if (!EMAIL_REGEX.test(email)) {
    return new Response(JSON.stringify({ error: "invalid_email" }), {
      status: 422,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // Save to Supabase
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error: dbError } = await supabase
    .from("newsletter_subscribers")
    .insert({ email });

  if (dbError) {
    // 23505 = unique_violation (duplicate email)
    if (dbError.code === "23505") {
      return new Response(JSON.stringify({ error: "duplicate_email" }), {
        status: 409,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    console.error("Supabase insert error:", dbError);
    return new Response(JSON.stringify({ error: "db_error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // Send welcome email via Resend
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const html = await render(WelcomeNewsletter({ email }));
      await resend.emails.send({
        from: "Arkeonix Labs <newsletter@arkeonixlabs.com>",
        to: email,
        subject: "Welcome to Arkeonix Labs 🔬",
        html,
      });
    } catch (emailError) {
      // Don't fail the request if email sending fails — subscriber is already saved
      console.error("Resend email error:", emailError);
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

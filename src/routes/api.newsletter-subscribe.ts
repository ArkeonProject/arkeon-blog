import type { ActionFunctionArgs } from "react-router";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { renderWelcomeEmail } from "@/emails/welcome-email-html";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let email: string;
  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!EMAIL_REGEX.test(email)) {
    return new Response(JSON.stringify({ error: "invalid_email" }), {
      status: 422,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error: dbError } = await supabase.from("newsletter_subscribers").insert({ email });

  if (dbError) {
    if (dbError.code === "23505") {
      return new Response(JSON.stringify({ error: "duplicate_email" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.error("Supabase insert error:", dbError);
    return new Response(JSON.stringify({ error: "db_error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const html = renderWelcomeEmail(email);
      await resend.emails.send({
        from: "Arkeonix Labs <newsletter@arkeonixlabs.com>",
        to: email,
        subject: "Welcome to Arkeonix Labs 🔬",
        html,
      });
    } catch (emailError) {
      console.error("Resend email error:", emailError);
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

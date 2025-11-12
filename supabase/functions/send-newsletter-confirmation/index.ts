import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// --- Variables de entorno ---
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FRONTEND_BASE_URL = Deno.env.get("FRONTEND_BASE_URL");
const SUPABASE_URL = Deno.env.get("PROJECT_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY");

if (!RESEND_API_KEY || !FRONTEND_BASE_URL || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required environment variables for send-newsletter-confirmation function.");
}

// --- Cliente Supabase ---
const supabase = createClient(SUPABASE_URL ?? "", SUPABASE_SERVICE_ROLE_KEY ?? "", {
  auth: { persistSession: false },
});

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// --- Servidor principal ---
serve(async (req: Request): Promise<Response> => {
  try {
    const payload = await req.json();
    const email = payload?.record?.email || payload?.email;

    if (!email) {
      console.warn("No subscriber email supplied in trigger payload.");
      return jsonResponse({ error: "Missing email" }, 400);
    }

    // Generamos token UUID
    const token = crypto.randomUUID();

    // Guardamos el token en la tabla
    const { error: tokenError } = await supabase
      .from("newsletter_tokens")
      .insert({ email, token });

    if (tokenError) {
      console.error("Failed to store newsletter token", tokenError);
      return jsonResponse({ error: "Failed to store token" }, 500);
    }

    // Construimos la URL de confirmación
    const confirmationUrl = `${FRONTEND_BASE_URL.replace(/\/$/, "")}/newsletter/confirm?token=${token}`;

    // Enviamos correo con Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Arkeon Blog <no-reply@arkeontech.es>",
        to: email,
        subject: "Confirma tu suscripción a Arkeon Blog",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0b1226;">
            <h1 style="color:#007EAD;">¡Gracias por unirte a Arkeon Blog!</h1>
            <p>Solo falta un paso para activar tu suscripción. Haz clic en el botón para confirmar tu correo.</p>
            <p style="text-align:center; margin: 32px 0;">
              <a href="${confirmationUrl}" style="background:#007EAD;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Confirmar suscripción</a>
            </p>
            <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
            <p><a href="${confirmationUrl}">${confirmationUrl}</a></p>
            <p style="margin-top:32px;">Saludos,<br/>El equipo de Arkeon Blog</p>
          </div>
        `,
      }),
    });

    const resendBody = await emailResponse.text();
    console.log("Resend response", emailResponse.status, resendBody);

    if (!emailResponse.ok) {
      return jsonResponse({ error: "Failed to send email" }, 500);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Unexpected error in send-newsletter-confirmation", error);
    return jsonResponse({ error: "Internal Server Error" }, 500);
  }
});
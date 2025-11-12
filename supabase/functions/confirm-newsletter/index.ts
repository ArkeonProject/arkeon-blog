import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("PROJECT_URL");
const SUPABASE_KEY = Deno.env.get("SERVICE_ROLE_KEY");

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing PROJECT_URL or SERVICE_ROLE_KEY for confirm-newsletter");
}

const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!, {
  auth: { persistSession: false },
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });

serve(async (req: Request) => {
  // ✅ Responder al preflight CORS
  if (req.method === "OPTIONS") {
    console.log("⚙️ CORS preflight received, sending OK...");
    return new Response("ok", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    let token: string | null = null;

    // 1️⃣ Leer token del body si viene por POST
    if (req.method === "POST") {
      try {
        const bodyText = await req.text();
        console.log("🧾 Raw body:", bodyText);
        if (bodyText) {
          const parsed = JSON.parse(bodyText);
          token = parsed.token;
        }
      } catch (err) {
        console.warn("⚠️ Error parsing POST body:", err);
      }
    }

    // 2️⃣ O desde la URL (?token=)
    if (!token) {
      const url = new URL(req.url);
      token = url.searchParams.get("token");
    }

    console.log("🔍 Incoming method:", req.method);
    console.log("🔍 Full URL:", req.url);
    console.log("🔍 Extracted token:", token);

    if (!token || typeof token !== "string") {
      console.warn("⚠️ Missing or invalid token in request");
      return json({ error: "Missing token" }, 400);
    }

    // 3️⃣ Buscar token en la tabla
    const { data: row, error: selErr } = await supabase
      .from("newsletter_tokens")
      .select("email, used")
      .eq("token", token)
      .single();

    if (selErr || !row || row.used === true) {
      if (selErr) console.error("❌ Token lookup error:", selErr);
      return json({ error: "Invalid or used token" }, 400);
    }

    // 4️⃣ Actualizar suscriptor
    const { error: updErr } = await supabase
      .from("newsletter_subscribers")
      .update({ confirmed: true })
      .eq("email", row.email);

    if (updErr) {
      console.error("❌ Subscriber update error:", updErr);
      return json({ error: "Database update failed" }, 500);
    }

    // 5️⃣ Marcar token como usado
    await supabase.from("newsletter_tokens").update({ used: true }).eq("token", token);

    console.log(`✅ Confirmed subscription for ${row.email}`);
    return json({ success: true });
  } catch (e) {
    console.error("💥 Unexpected error in confirm-newsletter:", e);
    return json({ error: "Internal Server Error" }, 500);
  }
});
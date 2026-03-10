import { createClient } from "@supabase/supabase-js";

export const config = { runtime: "edge" };

const ALLOWED_TABLES = ["posts", "lab_posts"] as const;
type AllowedTable = (typeof ALLOWED_TABLES)[number];

function isAllowedTable(t: unknown): t is AllowedTable {
  return typeof t === "string" && (ALLOWED_TABLES as readonly string[]).includes(t);
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

export default async function handler(request: Request): Promise<Response> {
  // CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Auth check
  const adminToken = process.env.ADMIN_TOKEN;
  const authHeader = request.headers.get("Authorization");
  if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
    return json({ error: "unauthorized" }, 401);
  }

  const url = new URL(request.url);
  const table = url.searchParams.get("table");
  const id = url.searchParams.get("id");

  if (!isAllowedTable(table)) {
    return json({ error: "invalid_table" }, 400);
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  switch (request.method) {
    case "GET": {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("published_at", { ascending: false });
      if (error) return json({ error: error.message }, 500);
      return json({ data }, 200);
    }

    case "POST": {
      const body = await request.json() as Record<string, unknown>;
      const { data, error } = await supabase
        .from(table)
        .insert([body])
        .select()
        .single();
      if (error) return json({ error: error.message }, 500);
      return json({ data }, 201);
    }

    case "PATCH": {
      if (!id) return json({ error: "id required" }, 400);
      const body = await request.json() as Record<string, unknown>;
      const { data, error } = await supabase
        .from(table)
        .update(body)
        .eq("id", id)
        .select()
        .single();
      if (error) return json({ error: error.message }, 500);
      return json({ data }, 200);
    }

    case "DELETE": {
      if (!id) return json({ error: "id required" }, 400);
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true }, 200);
    }

    default:
      return json({ error: "method not allowed" }, 405);
  }
}

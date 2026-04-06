import type { Config } from "@react-router/dev/config";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { vercelPreset } from "@vercel/react-router/vite";

// Load environment variables for prerender
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
    const envFile = readFileSync(envPath, "utf-8");
    for (const line of envFile.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
            const [key, ...valueParts] = trimmed.split("=");
            if (key && valueParts.length > 0) {
                process.env[key.trim()] = valueParts.join("=").trim();
            }
        }
    }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default {
  // Use src as the app directory to integrate easily with Vite SPA existing folders
  appDirectory: "src",
  presets: [vercelPreset()],
  
  // Prerender function natively supports async data fetching
  async prerender() {
    const staticRoutes = [
      "/",
      "/blog",
      "/recursos",
      "/lab",
      "/about",
      "/contact",
      "/privacy",
      "/terms",
      "/cookies",
      "/arkeonix"
    ];

    let dynamicRoutes: string[] = [];

    if (supabase) {
      const { data: posts } = await supabase.from("posts").select("slug").eq("status", "published");
      const { data: labs } = await supabase.from("lab_posts").select("slug").eq("status", "published");
      
      const postRoutes = (posts || []).map((p: { slug: string }) => `/post/${p.slug}`);
      const labRoutes = (labs || []).map((l: { slug: string }) => `/lab/${l.slug}`);
      
      dynamicRoutes = [...postRoutes, ...labRoutes];
    }

    return [...staticRoutes, ...dynamicRoutes];
  }
} satisfies Config;

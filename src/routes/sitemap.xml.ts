import type { LoaderFunctionArgs } from "react-router";
import { createClient } from "@supabase/supabase-js";
import { buildSitemapXml, type SitemapPost } from "@/utils/sitemap";

type SupabaseEnv = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
};

function getSupabaseEnv(): SupabaseEnv {
  return {
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
  };
}

async function fetchPublishedPosts(table: "posts" | "lab_posts", env: SupabaseEnv): Promise<SitemapPost[]> {
  if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
    return [];
  }

  const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from(table)
    .select("slug, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error(`Error loading ${table} for sitemap:`, error.message);
    return [];
  }

  return (data ?? []) as SitemapPost[];
}

// eslint-disable-next-line react-refresh/only-export-components
export async function loader(_args: LoaderFunctionArgs) {
  const env = getSupabaseEnv();
  const [posts, labPosts] = await Promise.all([
    fetchPublishedPosts("posts", env),
    fetchPublishedPosts("lab_posts", env),
  ]);

  return new Response(buildSitemapXml({ posts, labPosts }), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

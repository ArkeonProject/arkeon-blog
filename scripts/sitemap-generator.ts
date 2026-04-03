import { createClient } from "@supabase/supabase-js";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env.local
const envPath = resolve(__dirname, "../.env.local");
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

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client only if credentials are available
const supabase =
    supabaseUrl && supabaseAnonKey
        ? createClient(supabaseUrl, supabaseAnonKey)
        : null;

if (!supabase) {
    console.warn(
        "⚠️  Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY - generating static-only sitemap"
    );
}

const SITE_URL = "https://www.arkeonixlabs.com";

interface Post {
    slug: string;
    published_at: string;
}

async function generateSitemap(): Promise<void> {
    console.log("🗺️  Generating sitemap.xml...");

    // Static pages with their priorities and change frequencies
    const staticPages = [
        { url: "/blog", priority: "1.0", changefreq: "daily" },
        { url: "/news", priority: "0.9", changefreq: "daily" },
        { url: "/products", priority: "0.9", changefreq: "weekly" },
        { url: "/lab", priority: "0.8", changefreq: "weekly" },
        { url: "/guia-junior", priority: "0.8", changefreq: "weekly" },
        { url: "/guia-junior/capitulo/antes-de-empezar", priority: "0.7", changefreq: "monthly" },
        { url: "/arkeonix", priority: "0.8", changefreq: "monthly" },
        { url: "/about", priority: "0.7", changefreq: "monthly" },
        { url: "/contact", priority: "0.6", changefreq: "monthly" },
        { url: "/privacy", priority: "0.3", changefreq: "yearly" },
        { url: "/terms", priority: "0.3", changefreq: "yearly" },
        { url: "/cookies", priority: "0.3", changefreq: "yearly" },
    ];

    // Fetch all published posts from Supabase (if credentials available)
    const posts: Post[] = [];
    const labPosts: Post[] = [];
    if (supabase) {
        const { data: postsData, error: postsError } = await supabase
            .from("posts")
            .select("slug, published_at")
            .eq("status", "published")
            .order("published_at", { ascending: false });

        if (postsError) {
            console.error("❌ Error fetching posts:", postsError.message);
            process.exit(1);
        }

        // Deduplicate by slug
        const seen = new Set<string>();
        for (const post of (postsData as Post[]) || []) {
            if (!seen.has(post.slug)) {
                seen.add(post.slug);
                posts.push(post);
            }
        }

        const { data: labData, error: labError } = await supabase
            .from("lab_posts")
            .select("slug, published_at")
            .eq("status", "published")
            .order("published_at", { ascending: false });

        if (labError) {
            console.warn("⚠️  Could not fetch lab_posts:", labError.message);
        } else {
            const seenLab = new Set<string>();
            for (const post of (labData as Post[]) || []) {
                if (!seenLab.has(post.slug)) {
                    seenLab.add(post.slug);
                    labPosts.push(post);
                }
            }
        }
    }

    const today = new Date().toISOString().split("T")[0];

    // Build XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static pages
    for (const page of staticPages) {
        xml += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Add dynamic post pages
    for (const post of posts) {
        const lastmod = post.published_at
            ? new Date(post.published_at).toISOString().split("T")[0]
            : today;
        xml += `  <url>
    <loc>${SITE_URL}/post/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }

    // Add lab post pages
    for (const post of labPosts) {
        const lastmod = post.published_at
            ? new Date(post.published_at).toISOString().split("T")[0]
            : today;
        xml += `  <url>
    <loc>${SITE_URL}/lab/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }

    xml += `</urlset>
`;

    // Write sitemap to public folder
    const publicPath = resolve(__dirname, "../public/sitemap.xml");
    writeFileSync(publicPath, xml, "utf-8");

    // Also write to dist if it exists
    const distPath = resolve(__dirname, "../dist/sitemap.xml");
    if (existsSync(dirname(distPath))) {
        writeFileSync(distPath, xml, "utf-8");
    }

    console.log(`✅ Sitemap generated with ${staticPages.length + posts.length + labPosts.length} URLs`);
    console.log(`   → ${publicPath}`);
}

generateSitemap().catch((err) => {
    console.error("❌ Sitemap generation failed:", err);
    process.exit(1);
});

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

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SITE_URL = "https://www.arkeontech.es";

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
        { url: "/about", priority: "0.7", changefreq: "monthly" },
        { url: "/contact", priority: "0.6", changefreq: "monthly" },
        { url: "/privacy", priority: "0.3", changefreq: "yearly" },
        { url: "/terms", priority: "0.3", changefreq: "yearly" },
        { url: "/cookies", priority: "0.3", changefreq: "yearly" },
    ];

    // Fetch all published posts from Supabase
    const { data: posts, error } = await supabase
        .from("posts")
        .select("slug, published_at")
        .order("published_at", { ascending: false });

    if (error) {
        console.error("❌ Error fetching posts:", error.message);
        process.exit(1);
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
    if (posts && posts.length > 0) {
        for (const post of posts as Post[]) {
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
    }

    xml += `</urlset>
`;

    // Write sitemap to dist folder
    const outputPath = resolve(__dirname, "../dist/sitemap.xml");
    writeFileSync(outputPath, xml, "utf-8");

    console.log(`✅ Sitemap generated with ${staticPages.length + (posts?.length || 0)} URLs`);
    console.log(`   → ${outputPath}`);
}

generateSitemap().catch((err) => {
    console.error("❌ Sitemap generation failed:", err);
    process.exit(1);
});

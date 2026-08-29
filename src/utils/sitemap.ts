export const SITE_URL = "https://arkeonixlabs.com";

export type SitemapEntry = {
  url: string;
  lastmod?: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: string;
};

export type SitemapPost = {
  slug: string;
  published_at: string | null;
};

export const STATIC_SITEMAP_ENTRIES: SitemapEntry[] = [
  { url: "/", priority: "1.0", changefreq: "daily" },
  { url: "/blog", priority: "1.0", changefreq: "daily" },
  { url: "/lab", priority: "0.8", changefreq: "weekly" },
  { url: "/recursos", priority: "0.9", changefreq: "weekly" },
  { url: "/recursos/guia-junior", priority: "0.8", changefreq: "weekly" },
  { url: "/recursos/guia-junior/capitulo/antes-de-empezar", priority: "0.7", changefreq: "monthly" },
  { url: "/recursos/saas-boilerplate", priority: "0.8", changefreq: "monthly" },
  { url: "/herramientas", priority: "0.9", changefreq: "weekly" },
  { url: "/herramientas/calculadora-salario", priority: "0.8", changefreq: "monthly" },
  { url: "/herramientas/test-rol-tech", priority: "0.8", changefreq: "monthly" },
  { url: "/herramientas/checklist-portfolio-junior", priority: "0.8", changefreq: "monthly" },
  { url: "/rutas", priority: "0.9", changefreq: "weekly" },
  { url: "/rutas/primer-empleo-tech", priority: "0.8", changefreq: "monthly" },
  { url: "/rutas/qa-automation", priority: "0.8", changefreq: "monthly" },
  { url: "/rutas/java-selenium", priority: "0.8", changefreq: "monthly" },
  { url: "/rutas/portfolio-junior", priority: "0.8", changefreq: "monthly" },
  { url: "/rutas/ci-cd-basico", priority: "0.8", changefreq: "monthly" },
  { url: "/rutas/crear-saas", priority: "0.8", changefreq: "monthly" },
  { url: "/academia", priority: "0.8", changefreq: "weekly" },
  { url: "/about", priority: "0.7", changefreq: "monthly" },
  { url: "/contact", priority: "0.6", changefreq: "monthly" },
  { url: "/affiliate-disclosure", priority: "0.3", changefreq: "yearly" },
  { url: "/privacy", priority: "0.3", changefreq: "yearly" },
  { url: "/terms", priority: "0.3", changefreq: "yearly" },
  { url: "/cookies", priority: "0.3", changefreq: "yearly" },
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toDateOnly(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return date.toISOString().split("T")[0];
}

function appendUniquePosts(
  entries: SitemapEntry[],
  posts: SitemapPost[],
  prefix: "/post" | "/lab",
  fallbackLastmod: string,
) {
  const seen = new Set<string>();

  for (const post of posts) {
    if (!post.slug || seen.has(post.slug)) continue;
    seen.add(post.slug);

    entries.push({
      url: `${prefix}/${post.slug}`,
      lastmod: toDateOnly(post.published_at, fallbackLastmod),
      changefreq: "monthly",
      priority: "0.8",
    });
  }
}

export function buildSitemapXml({
  posts = [],
  labPosts = [],
  now = new Date(),
}: {
  posts?: SitemapPost[];
  labPosts?: SitemapPost[];
  now?: Date;
}): string {
  const today = now.toISOString().split("T")[0];
  const entries = STATIC_SITEMAP_ENTRIES.map((entry) => ({
    ...entry,
    lastmod: entry.lastmod ?? today,
  }));

  appendUniquePosts(entries, posts, "/post", today);
  appendUniquePosts(entries, labPosts, "/lab", today);

  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(`${SITE_URL}${entry.url}`)}</loc>
    <lastmod>${escapeXml(entry.lastmod ?? today)}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

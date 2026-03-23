import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
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

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
);

// AI cadence patterns from documented errors
const AI_PATTERNS = [
    "seamless",
    "exceptional value",
    "great choice",
    "compelling blend",
    "Furthermore",
    "Additionally",
    "Moreover",
    "Overall",
    "making it an excellent",
    "making it a great",
    "ideal for",
    "less suitable for",
    "may not be ideal",
    "outstanding",
    "effortless",
];

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function countWords(text: string): number {
    return text.split(/\s+/).filter(Boolean).length;
}

function detectAiPatterns(text: string): string[] {
    return AI_PATTERNS.filter((p) =>
        text.toLowerCase().includes(p.toLowerCase())
    );
}

function detectLanguage(text: string, declared: string): string | null {
    const spanishWords = ["el ", "la ", "los ", "las ", "de ", "que ", "en ", "con ", "para ", "por "];
    const englishWords = ["the ", "and ", "for ", "with ", "this ", "that ", "from ", "your ", "which "];
    const spanishCount = spanishWords.filter((w) => text.toLowerCase().includes(w)).length;
    const englishCount = englishWords.filter((w) => text.toLowerCase().includes(w)).length;

    const detected = spanishCount > englishCount ? "es" : "en";
    if (declared && detected !== declared) return detected;
    return null;
}

interface Post {
    id: number;
    slug: string;
    title: string;
    content: string;
    excerpt: string;
    cover_image: string | null;
    language: string;
    category: string;
    published_at: string;
}

interface PostPair {
    slug: string;
    category: string;
    es: Post | null;
    en: Post | null;
    issues: string[];
    severity: "ok" | "warn" | "critical";
}

function auditVersion(post: Post, lang: string): string[] {
    const issues: string[] = [];
    const plainText = stripHtml(post.content || "");
    const wordCount = countWords(plainText);

    if (wordCount < 150) issues.push(`⛔ [${lang}] Thin content: ${wordCount} words`);
    else if (wordCount < 300) issues.push(`⚠️  [${lang}] Short: ${wordCount} words`);

    if (!post.excerpt) issues.push(`⚠️  [${lang}] No excerpt`);
    if (!post.cover_image || post.cover_image === "None" || post.cover_image === "null")
        issues.push(`⛔ [${lang}] Missing cover image`);

    const aiFound = detectAiPatterns(plainText);
    if (aiFound.length >= 3) issues.push(`⚠️  [${lang}] AI cadence: "${aiFound.slice(0, 3).join('", "')}"`);

    // Check if declared language matches content language
    const declaredLower = lang.toLowerCase();
    const detected = detectLanguage(plainText, declaredLower);
    if (detected) issues.push(`⛔ [${lang}] Content is "${detected}" but declared "${lang}" — SLUG/CONTENT MISMATCH`);

    return issues;
}

async function auditPosts() {
    console.log("🔍 Fetching all posts (both languages)...\n");

    const { data, error } = await supabase
        .from("posts")
        .select("id, slug, title, content, excerpt, cover_image, language, category, published_at")
        .order("published_at", { ascending: false });

    if (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }

    const posts = (data as Post[]) || [];

    // Group by slug — each slug should have ES and EN version
    const bySlug = new Map<string, { es: Post | null; en: Post | null; category: string }>();
    for (const post of posts) {
        const lang = post.language?.toUpperCase();
        if (!bySlug.has(post.slug)) {
            bySlug.set(post.slug, { es: null, en: null, category: post.category });
        }
        const entry = bySlug.get(post.slug)!;
        if (lang === "ES") entry.es = post;
        else if (lang === "EN") entry.en = post;
    }

    console.log(`📊 Total rows: ${posts.length} | Unique slugs: ${bySlug.size}\n`);

    const pairs: PostPair[] = [];

    for (const [slug, { es, en, category }] of bySlug) {
        const issues: string[] = [];

        if (!es) issues.push("⛔ Missing ES version entirely");
        if (!en) issues.push("⛔ Missing EN version entirely");

        if (es) issues.push(...auditVersion(es, "ES"));
        if (en) issues.push(...auditVersion(en, "EN"));

        // Title coherence between languages (both should be about same topic)
        if (es && en) {
            const esWords = es.title.toLowerCase().split(/\s+/);
            const enWords = en.title.toLowerCase().split(/\s+/);
            const sharedWords = esWords.filter(w => w.length > 4 && enWords.some(ew => ew.includes(w) || w.includes(ew)));
            if (sharedWords.length === 0) {
                issues.push(`⛔ ES/EN titles seem unrelated — possible content mismatch`);
            }
        }

        const severity: PostPair["severity"] =
            issues.some((i) => i.startsWith("⛔")) ? "critical" :
            issues.some((i) => i.startsWith("⚠️")) ? "warn" : "ok";

        pairs.push({ slug, category, es, en, issues, severity });
    }

    const critical = pairs.filter((r) => r.severity === "critical");
    const warn = pairs.filter((r) => r.severity === "warn");
    const ok = pairs.filter((r) => r.severity === "ok");

    console.log("═══════════════════════════════════════════════════");
    console.log(`  AUDIT SUMMARY — ${bySlug.size} posts`);
    console.log("═══════════════════════════════════════════════════");
    console.log(`  ⛔ Critical : ${critical.length} posts`);
    console.log(`  ⚠️  Warnings : ${warn.length} posts`);
    console.log(`  ✅ Clean    : ${ok.length} posts`);
    console.log("═══════════════════════════════════════════════════\n");

    if (critical.length > 0) {
        console.log("⛔ CRITICAL — Fix or delete before submitting sitemap:\n");
        for (const r of critical) {
            console.log(`  [${ r.category.toUpperCase()}] ${r.slug}`);
            console.log(`  ES: ${r.es?.title ?? "MISSING"}`);
            console.log(`  EN: ${r.en?.title ?? "MISSING"}`);
            for (const issue of r.issues) console.log(`    ${issue}`);
            console.log();
        }
    }

    if (warn.length > 0) {
        console.log("⚠️  WARNINGS — Review recommended:\n");
        for (const r of warn) {
            const esWords = r.es ? countWords(stripHtml(r.es.content)) : 0;
            const enWords = r.en ? countWords(stripHtml(r.en.content)) : 0;
            console.log(`  [${r.category.toUpperCase()}] ${r.slug}`);
            console.log(`  ES (${esWords}w): ${r.es?.title ?? "MISSING"}`);
            console.log(`  EN (${enWords}w): ${r.en?.title ?? "MISSING"}`);
            for (const issue of r.issues) console.log(`    ${issue}`);
            console.log();
        }
    }

    if (ok.length > 0) {
        console.log("✅ CLEAN — Ready for sitemap:\n");
        for (const r of ok) {
            const esWords = r.es ? countWords(stripHtml(r.es.content)) : 0;
            const enWords = r.en ? countWords(stripHtml(r.en.content)) : 0;
            console.log(`  [${r.category.toUpperCase()}] ${r.slug} — ES:${esWords}w / EN:${enWords}w`);
        }
    }

    // Category breakdown
    const cats: Record<string, { total: number; critical: number; ok: number }> = {};
    for (const r of pairs) {
        const c = r.category || "unknown";
        if (!cats[c]) cats[c] = { total: 0, critical: 0, ok: 0 };
        cats[c].total++;
        if (r.severity === "critical") cats[c].critical++;
        if (r.severity === "ok") cats[c].ok++;
    }
    console.log("\n📂 BY CATEGORY:");
    for (const [cat, s] of Object.entries(cats)) {
        console.log(`  ${cat}: ${s.total} posts — ⛔ ${s.critical} critical / ✅ ${s.ok} ok`);
    }

    // Google strategy note
    console.log("\n🌐 GOOGLE STRATEGY:");
    console.log("  Default locale = 'es' → Googlebot indexes SPANISH content");
    console.log("  Fix all ⛔ issues before submitting sitemap");
    console.log("  Sitemap should include 1 URL per slug (ES is what Google crawls)");
}

auditPosts().catch((err) => {
    console.error("❌ Audit failed:", err);
    process.exit(1);
});

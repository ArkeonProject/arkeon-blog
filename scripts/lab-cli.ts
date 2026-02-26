import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync, renameSync, mkdirSync } from "fs";
import { resolve, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Load .env.local ────────────────────────────────────────────────
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

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Frontmatter parser ─────────────────────────────────────────────
interface Frontmatter {
    title: string;
    slug: string;
    excerpt: string;
    tags: string[];
    difficulty?: string;
    language: string;
    cover_image?: string;
    author?: string;
    published_at?: string;
}

function parseFrontmatter(raw: string): { meta: Frontmatter; content: string } {
    const fmRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = raw.match(fmRegex);
    if (!match) {
        console.error("❌ No valid frontmatter found. File must start with --- block.");
        process.exit(1);
    }

    const [, yamlBlock, content] = match;
    const meta: Record<string, unknown> = {};

    for (const line of yamlBlock.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;

        const colonIndex = trimmed.indexOf(":");
        if (colonIndex === -1) continue;

        const key = trimmed.slice(0, colonIndex).trim();
        let value: string | string[] = trimmed.slice(colonIndex + 1).trim();

        // Handle quoted strings
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        // Handle arrays: [tag1, tag2, tag3]
        if (typeof value === "string" && value.startsWith("[") && value.endsWith("]")) {
            value = value
                .slice(1, -1)
                .split(",")
                .map((v) => v.trim().replace(/^["']|["']$/g, ""));
        }

        meta[key] = value;
    }

    // Validate required fields
    const required = ["title", "slug", "excerpt", "language"];
    for (const field of required) {
        if (!meta[field]) {
            console.error(`❌ Missing required field: ${field}`);
            process.exit(1);
        }
    }

    // Ensure tags is an array
    if (!meta.tags) meta.tags = [];
    if (typeof meta.tags === "string") meta.tags = [meta.tags];

    return { meta: meta as unknown as Frontmatter, content: content.trim() };
}

// ─── Commands ───────────────────────────────────────────────────────

async function publish(filePath: string, isDryRun: boolean) {
    const absPath = resolve(filePath);
    if (!existsSync(absPath)) {
        console.error(`❌ File not found: ${absPath}`);
        process.exit(1);
    }

    const raw = readFileSync(absPath, "utf-8");
    const { meta, content } = parseFrontmatter(raw);

    console.log("\n📝 Article details:");
    console.log(`   Title:      ${meta.title}`);
    console.log(`   Slug:       ${meta.slug}`);
    console.log(`   Language:   ${meta.language}`);
    console.log(`   Tags:       ${Array.isArray(meta.tags) ? meta.tags.join(", ") : meta.tags}`);
    console.log(`   Difficulty: ${meta.difficulty ?? "not set"}`);
    console.log(`   Excerpt:    ${meta.excerpt.slice(0, 80)}...`);
    console.log(`   Content:    ${content.length} characters\n`);

    if (isDryRun) {
        console.log("🔍 Dry run — no changes made.\n");
        return;
    }

    const row = {
        title: meta.title,
        slug: meta.slug,
        excerpt: meta.excerpt,
        content,
        tags: Array.isArray(meta.tags) ? meta.tags : [meta.tags],
        difficulty: meta.difficulty ?? null,
        language: meta.language.toUpperCase(),
        cover_image: meta.cover_image ?? null,
        author: meta.author ?? "David López",
        published_at: meta.published_at ?? new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from("lab_posts")
        .insert(row)
        .select("id, slug")
        .single();

    if (error) {
        if (error.code === "23505") {
            console.error(`❌ A post with slug "${meta.slug}" already exists. Use 'lab:update' instead.`);
        } else {
            console.error("❌ Supabase error:", error.message);
        }
        process.exit(1);
    }

    console.log(`✅ Published! ID: ${data.id}, slug: ${data.slug}`);
    console.log(`   🔗 https://www.arkeontech.es/lab/${data.slug}\n`);

    // Move file to published/
    const publishedDir = resolve(dirname(absPath), "../published");
    if (!existsSync(publishedDir)) mkdirSync(publishedDir, { recursive: true });
    const destPath = resolve(publishedDir, basename(absPath));
    renameSync(absPath, destPath);
    console.log(`   📁 Moved to: ${destPath}`);
}

async function update(filePath: string) {
    const absPath = resolve(filePath);
    if (!existsSync(absPath)) {
        console.error(`❌ File not found: ${absPath}`);
        process.exit(1);
    }

    const raw = readFileSync(absPath, "utf-8");
    const { meta, content } = parseFrontmatter(raw);

    console.log(`\n🔄 Updating post: ${meta.slug}...`);

    const row = {
        title: meta.title,
        excerpt: meta.excerpt,
        content,
        tags: Array.isArray(meta.tags) ? meta.tags : [meta.tags],
        difficulty: meta.difficulty ?? null,
        language: meta.language.toUpperCase(),
        cover_image: meta.cover_image ?? null,
        author: meta.author ?? "David López",
    };

    const { error } = await supabase
        .from("lab_posts")
        .update(row)
        .eq("slug", meta.slug)
        .eq("language", meta.language.toUpperCase());

    if (error) {
        console.error("❌ Supabase error:", error.message);
        process.exit(1);
    }

    console.log(`✅ Updated: ${meta.slug}\n`);
}

async function list() {
    const { data, error } = await supabase
        .from("lab_posts")
        .select("id, title, slug, language, tags, difficulty, published_at")
        .order("published_at", { ascending: false });

    if (error) {
        console.error("❌ Supabase error:", error.message);
        process.exit(1);
    }

    if (!data || data.length === 0) {
        console.log("\n📭 No lab posts found.\n");
        return;
    }

    console.log(`\n📋 Lab posts (${data.length}):\n`);
    console.log("  ID  │ Lang │ Difficulty   │ Tags                    │ Title");
    console.log("──────┼──────┼──────────────┼─────────────────────────┼────────────────────────");

    for (const post of data) {
        const id = String(post.id).padStart(4);
        const lang = (post.language ?? "??").padEnd(2);
        const diff = (post.difficulty ?? "—").padEnd(12);
        const tags = (post.tags?.join(", ") ?? "").slice(0, 23).padEnd(23);
        const title = post.title.slice(0, 40);
        console.log(`  ${id} │  ${lang}  │ ${diff} │ ${tags} │ ${title}`);
    }
    console.log("");
}

async function remove(slug: string, language: string) {
    console.log(`\n🗑️  Deleting post: ${slug} (${language})...`);

    const { error, count } = await supabase
        .from("lab_posts")
        .delete({ count: "exact" })
        .eq("slug", slug)
        .eq("language", language.toUpperCase());

    if (error) {
        console.error("❌ Supabase error:", error.message);
        process.exit(1);
    }

    if (count === 0) {
        console.error(`❌ No post found with slug "${slug}" and language "${language}"`);
        process.exit(1);
    }

    console.log(`✅ Deleted: ${slug}\n`);
}

// ─── CLI Entry Point ────────────────────────────────────────────────
const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
    console.log(`
🧪 Arkeon Lab CLI — Publish technical articles

Usage:
  pnpm lab:publish <file.md>           Publish a new article from markdown
  pnpm lab:publish <file.md> --dry-run Preview without publishing
  pnpm lab:update <file.md>            Update an existing article by slug
  pnpm lab:list                        List all published articles
  pnpm lab:delete <slug> [language]    Delete a post by slug (default: ES)
  pnpm lab:help                        Show this help

Markdown format:
  ---
  title: "Your Title Here"
  slug: your-title-here
  excerpt: "Short description of the article"
  tags: [docker, testing, ci-cd]
  difficulty: beginner | intermediate | advanced
  language: ES | EN
  cover_image: https://...  (optional)
  author: David López       (optional, defaults to David López)
  published_at: 2026-02-25  (optional, defaults to now)
  ---

  Your article content in **Markdown** here...

Directories:
  lab/drafts/       Write your articles here
  lab/published/    Articles are moved here after publishing
  lab/templates/    Example templates
`);
}

switch (command) {
    case "publish": {
        const file = args[1];
        if (!file) { console.error("❌ Provide a markdown file path."); process.exit(1); }
        const isDryRun = args.includes("--dry-run");
        await publish(file, isDryRun);
        break;
    }
    case "update": {
        const file = args[1];
        if (!file) { console.error("❌ Provide a markdown file path."); process.exit(1); }
        await update(file);
        break;
    }
    case "list":
        await list();
        break;
    case "delete": {
        const slug = args[1];
        const lang = args[2] ?? "ES";
        if (!slug) { console.error("❌ Provide a slug to delete."); process.exit(1); }
        await remove(slug, lang);
        break;
    }
    case "help":
    case undefined:
        printHelp();
        break;
    default:
        console.error(`❌ Unknown command: ${command}`);
        printHelp();
        process.exit(1);
}

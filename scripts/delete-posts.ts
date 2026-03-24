import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import * as readline from "readline";

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

// Slugs to delete (both ES and EN rows for each)
const SLUGS_TO_DELETE = [
    "unlocking-the-potential-of-the-xyz-gaming-monitor",
    "innovation-in-batteries-sustainability-revolution",
    "dangers-of-ai-in-cybersecurity",
    "new-hybridizations-technology-and-design-in-smartphones",
    "javascript-updates-what-we-need-to-know",
    "new-features-in-javascript-5",
    "new-javascript-5-features-improve-development-efficiency",
    "new-era-of-ai-revelations",
];

function ask(question: string): Promise<string> {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim().toLowerCase());
        });
    });
}

async function deletePosts() {
    console.log("🔍 Checking posts to delete...\n");

    // Fetch all rows that match the slugs
    const { data, error } = await supabase
        .from("posts")
        .select("id, slug, title, language, category")
        .in("slug", SLUGS_TO_DELETE);

    if (error) {
        console.error("❌ Error fetching posts:", error.message);
        process.exit(1);
    }

    const rows = data ?? [];

    if (rows.length === 0) {
        console.log("✅ No rows found for those slugs. Nothing to delete.");
        process.exit(0);
    }

    // Group by slug for display
    const bySlug = new Map<string, typeof rows>();
    for (const row of rows) {
        if (!bySlug.has(row.slug)) bySlug.set(row.slug, []);
        bySlug.get(row.slug)!.push(row);
    }

    console.log("═══════════════════════════════════════════════════");
    console.log(`  Posts to DELETE — ${bySlug.size} slugs / ${rows.length} rows total`);
    console.log("═══════════════════════════════════════════════════\n");

    for (const [slug, versions] of bySlug) {
        console.log(`  slug: ${slug}`);
        for (const v of versions) {
            console.log(`    [${v.language}] ${v.title}`);
        }
        console.log();
    }

    // Missing slugs (not found in DB)
    const foundSlugs = new Set(rows.map((r) => r.slug));
    const notFound = SLUGS_TO_DELETE.filter((s) => !foundSlugs.has(s));
    if (notFound.length > 0) {
        console.log("ℹ️  Already deleted or not found:");
        for (const s of notFound) console.log(`   - ${s}`);
        console.log();
    }

    const answer = await ask("⚠️  Confirm permanent deletion? Type 'yes' to proceed: ");

    if (answer !== "yes") {
        console.log("\n❌ Cancelled. Nothing was deleted.");
        process.exit(0);
    }

    console.log("\n🗑️  Deleting...\n");

    let deleted = 0;
    let failed = 0;

    for (const slug of SLUGS_TO_DELETE) {
        const { error: delError, count } = await supabase
            .from("posts")
            .delete({ count: "exact" })
            .eq("slug", slug);

        if (delError) {
            console.error(`  ❌ Failed: ${slug} — ${delError.message}`);
            failed++;
        } else {
            console.log(`  ✅ Deleted ${count ?? "?"} rows for: ${slug}`);
            deleted += count ?? 0;
        }
    }

    console.log("\n═══════════════════════════════════════════════════");
    console.log(`  Done — ${deleted} rows deleted / ${failed} failed`);
    console.log("═══════════════════════════════════════════════════");
    console.log("\nNext: run 'pnpm build' to regenerate the sitemap without these posts.");
}

deletePosts().catch((err) => {
    console.error("❌ Script failed:", err);
    process.exit(1);
});

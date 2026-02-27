import { useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { FiTerminal, FiCode, FiShoppingCart } from "react-icons/fi";
import { supabase } from "../lib/supabase";
import { useLocale } from "../hooks/useLocale";
import { useSupabaseQuery } from "../hooks/useSupabaseQuery";
import ReadingProgressBar from "../components/ui/ReadingProgressBar";
import ShareButtons from "../components/ui/ShareButtons";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import type { LabPostDetail } from "../types/lab";

marked.setOptions({ async: false });

const DIFFICULTY_STYLES: Record<string, string> = {
    beginner: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    advanced: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

export default function LabPostPage() {
    const { slug } = useParams();
    const { locale, t } = useLocale();
    const languageFilter = locale.toUpperCase();

    const queryPost = useCallback(async () => {
        if (!slug) return { data: null, error: null };

        const { data, error } = await supabase
            .from("lab_posts")
            .select("*")
            .eq("slug", slug)
            .eq("language", languageFilter)
            .maybeSingle();

        if (error) console.error(error);
        return { data: (data as LabPostDetail | null) ?? null, error };
    }, [languageFilter, slug]);

    const {
        data: post,
        loading,
        error,
    } = useSupabaseQuery<LabPostDetail | null>(queryPost);
    const errorMsg = error ? t("lab_post_error") : null;

    // Extract affiliate URL (AliExpress or Amazon)
    const affiliateUrl = useMemo(() => {
        if (!post?.content) return null;
        const match = post.content.match(
            /https:\/\/s\.click\.aliexpress\.com\/[^\s*)"]+|https:\/\/www\.amazon\.\w+\/[^\s*)"]+/
        );
        return match ? match[0] : null;
    }, [post?.content]);

    // Parse markdown → HTML, removing raw affiliate URLs
    const rawHtml = useMemo(() => {
        if (!post?.content) return "";
        return marked.parse(post.content) as string;
    }, [post?.content]);

    const cleanedHtml = useMemo(() => {
        if (!rawHtml) return "";
        // Remove AliExpress and Amazon raw URLs from rendered HTML (they might be inside <strong> or <p>)
        let cleaned = rawHtml;
        cleaned = cleaned.replace(
            /https:\/\/s\.click\.aliexpress\.com\/[^\s<>"]+/g,
            ""
        );
        cleaned = cleaned.replace(
            /https:\/\/www\.amazon\.\w+\/[^\s<>"]+/g,
            ""
        );
        return cleaned;
    }, [rawHtml]);

    const safeHtml = useMemo(
        () => DOMPurify.sanitize(cleanedHtml),
        [cleanedHtml]
    );

    // Split HTML around the purchase link heading (same pattern as PostPage)
    const { beforeBuy, afterBuy } = useMemo(() => {
        const headerRegex =
            /<h3[^>]*>[^<]*(Enlace de compra|Purchase link)[^<]*<\/h3>/i;
        const match = safeHtml.match(headerRegex);

        if (!match) {
            return { beforeBuy: safeHtml, afterBuy: "" };
        }

        const headerIndex = safeHtml.indexOf(match[0]);
        const headerEnd = headerIndex + match[0].length;

        return {
            beforeBuy: safeHtml.slice(0, headerEnd),
            afterBuy: safeHtml.slice(headerEnd),
        };
    }, [safeHtml]);

    if (!slug)
        return (
            <p className="text-center mt-10 text-gray-600 dark:text-white/70">
                {t("post_not_found")}
            </p>
        );
    if (loading)
        return (
            <p className="text-center mt-10 text-gray-600 dark:text-white/70">
                {t("post_loading")}
            </p>
        );
    if (errorMsg)
        return (
            <p className="text-center mt-10 text-red-500 dark:text-red-400">
                {errorMsg}
            </p>
        );
    if (!post)
        return (
            <p className="text-center mt-10 text-gray-600 dark:text-white/70">
                {t("post_not_found")}
            </p>
        );

    const description =
        post.content.length > 160
            ? post.content.slice(0, 157) + "…"
            : post.content;

    const difficultyKey = post.difficulty
        ? `lab_difficulty_${post.difficulty}`
        : null;

    return (
        <>
            <ReadingProgressBar />
            <div className="max-w-4xl mx-auto p-8 md:p-12 bg-gradient-to-br from-white to-gray-50 dark:from-[#0b1226] dark:via-[#071622] dark:to-[#0a172b] rounded-3xl shadow-lg dark:shadow-[#007EAD]/20 transition-colors duration-300">
                <Breadcrumbs />

                <Helmet>
                    <title>{post.title} | Arkeonix Labs</title>
                    <meta name="description" content={description} />
                    <link rel="canonical" href={`https://www.arkeonixlabs.com/lab/${slug}`} />
                    <meta
                        property="og:title"
                        content={`${post.title} | Arkeonix Labs`}
                    />
                    <meta property="og:description" content={description} />
                    {post.cover_image && (
                        <meta property="og:image" content={post.cover_image} />
                    )}
                </Helmet>

                <Link
                    to="/lab"
                    className="text-[#00aaff] hover:text-[#00bbee] transition-colors duration-300 inline-flex items-center gap-2 mb-6"
                >
                    <span>←</span> {t("lab_back_to_lab")}
                </Link>

                {post.cover_image && (
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        className="rounded-xl my-6 w-full object-cover aspect-auto border border-gray-300 dark:border-[#007EAD]/20 shadow-lg dark:shadow-[#007EAD]/10"
                        loading="lazy"
                    />
                )}

                {/* Title with terminal icon */}
                <div className="flex items-start gap-3 mb-4">
                    <FiTerminal className="w-8 h-8 text-emerald-400 mt-1 shrink-0" />
                    <h1 className="text-4xl font-bold text-[#007EAD] dark:text-[#00aaff]">
                        {post.title}
                    </h1>
                </div>

                {/* Meta: date, author, difficulty, tags */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <p className="text-sm text-gray-600 dark:text-white/60">
                        {new Date(post.published_at).toLocaleDateString(
                            locale === "es" ? "es-ES" : "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                        )}{" "}
                        — <span className="text-[#00aaff]">{post.author}</span>
                    </p>

                    {post.difficulty && difficultyKey && (
                        <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${DIFFICULTY_STYLES[post.difficulty] ?? "bg-gray-500/15 text-gray-400 border-gray-500/30"}`}
                        >
                            {t(difficultyKey)}
                        </span>
                    )}
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium bg-[#007EAD]/10 text-[#00aaff] border border-[#007EAD]/20"
                            >
                                <FiCode className="w-3.5 h-3.5" />
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="border-t border-gray-300 dark:border-[#007EAD]/20 mt-4 mb-8" />

                <div className="mb-8">
                    <ShareButtons url={window.location.href} title={post.title} />
                </div>

                <div className="border-t border-gray-300 dark:border-[#007EAD]/20 mb-8" />

                <article
                    className="
            prose prose-lg max-w-none
            dark:prose-invert
            prose-headings:text-[#007EAD] dark:prose-headings:text-[#00aaff]
            prose-p:text-gray-700 dark:prose-p:text-white/80
            prose-a:text-[#007EAD] dark:prose-a:text-[#00aaff] hover:prose-a:text-[#00bbee]
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-code:text-[#007EAD]
            prose-pre:bg-gray-100 dark:prose-pre:bg-[#0f1f38]/50 prose-pre:border prose-pre:border-gray-300 dark:prose-pre:border-[#007EAD]/20 prose-pre:rounded-xl prose-pre:overflow-x-auto
            prose-img:rounded-xl prose-img:border prose-img:border-gray-300 dark:prose-img:border-[#007EAD]/20 prose-img:shadow-lg prose-img:my-6
            leading-relaxed
          "
                >
                    <div dangerouslySetInnerHTML={{ __html: beforeBuy }} />

                    {affiliateUrl && (
                        <div className="not-prose my-8 flex justify-center">
                            <a
                                href={affiliateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 no-underline text-white bg-gradient-to-r from-[#007EAD] to-[#00aaff] hover:from-[#00aaff] hover:to-[#007EAD] font-semibold px-8 py-4 rounded-xl shadow-lg shadow-[#007EAD]/30 text-lg transition-all duration-300 hover:scale-105"
                            >
                                <FiShoppingCart className="w-5 h-5" />
                                {locale === "es" ? "Ver producto" : "View product"}
                            </a>
                        </div>
                    )}

                    <div dangerouslySetInnerHTML={{ __html: afterBuy }} />
                </article>
            </div>
        </>
    );
}

import { useEffect, useState, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { FiTerminal } from "react-icons/fi";
import LabPostCard from "../components/posts/LabPostCard";
import Pagination from "../components/ui/Pagination";
import { supabase } from "../lib/supabase";
import { useLocale } from "../hooks/useLocale";
import type { LabPostListItem } from "../types/lab";

const PAGE_SIZE = 6;

export default function LabPage() {
    const { locale, t } = useLocale();
    const [posts, setPosts] = useState<LabPostListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const languageFilter = locale.toUpperCase();
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const fetchPosts = useCallback(
        async (page: number, tag: string | null) => {
            setLoading(true);
            setErrorMsg(null);

            const from = (page - 1) * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            // Count query
            let countQuery = supabase
                .from("lab_posts")
                .select("id", { count: "exact", head: true })
                .eq("language", languageFilter);
            if (tag) countQuery = countQuery.contains("tags", [tag]);
            const { count } = await countQuery;
            setTotalCount(count ?? 0);

            // Data query
            let query = supabase
                .from("lab_posts")
                .select("id, title, slug, excerpt, cover_image, published_at, language, tags, difficulty")
                .eq("language", languageFilter)
                .order("published_at", { ascending: false })
                .range(from, to);

            if (tag) query = query.contains("tags", [tag]);

            const { data, error } = await query;

            if (error) {
                console.error(error);
                setErrorMsg(t("lab_post_error"));
                setPosts([]);
            } else {
                setPosts((data ?? []) as LabPostListItem[]);
            }
            setLoading(false);
        },
        [languageFilter, t]
    );

    useEffect(() => {
        setCurrentPage(1);
        void fetchPosts(1, activeTag);
    }, [locale, fetchPosts, activeTag]);

    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        posts.forEach((p) => p.tags.forEach((tag) => tagSet.add(tag)));
        return Array.from(tagSet).sort();
    }, [posts]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        void fetchPosts(page, activeTag);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleTagClick = (tag: string | null) => {
        setActiveTag(tag);
        setCurrentPage(1);
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
            <Helmet>
                <title>{t("lab_title")} | Arkeon</title>
                <meta name="description" content={t("lab_description")} />
                <meta property="og:title" content={`${t("lab_title")} | Arkeon`} />
                <meta property="og:description" content={t("lab_description")} />
            </Helmet>

            {/* Header */}
            <header className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                    <FiTerminal className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-sm font-semibold tracking-wide uppercase">
                        Lab
                    </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4">
                    {t("lab_title")}
                </h1>
                <p className="text-gray-600 dark:text-white/70 text-lg md:text-xl max-w-3xl mx-auto">
                    {t("lab_description")}
                </p>
            </header>

            {/* Tag filters */}
            {allTags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    <button
                        onClick={() => handleTagClick(null)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeTag === null
                                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                                : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 hover:bg-emerald-500/10 hover:text-emerald-500"
                            }`}
                    >
                        {locale === "es" ? "Todos" : "All"}
                    </button>
                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeTag === tag
                                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                                    : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 hover:bg-emerald-500/10 hover:text-emerald-500"
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            {/* Posts grid */}
            {loading ? (
                <div className="grid md:grid-cols-2 gap-8">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="h-80 rounded-2xl bg-gray-200 dark:bg-white/5 animate-pulse"
                        />
                    ))}
                </div>
            ) : errorMsg ? (
                <p className="text-center text-red-500 font-semibold text-lg">
                    {errorMsg}
                </p>
            ) : posts.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-white/50 text-lg py-20">
                    {locale === "es"
                        ? "No hay artículos disponibles"
                        : "No articles available"}
                </p>
            ) : (
                <div className="grid md:grid-cols-2 gap-8">
                    {posts.map((post) => (
                        <LabPostCard key={post.id} post={post} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="mt-12"
                />
            )}
        </div>
    );
}

import { useEffect, useState, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FiTerminal } from "react-icons/fi";
import { supabase } from "../lib/supabase";
import { useLocale } from "../hooks/useLocale";
import LabPostCard from "../components/posts/LabPostCard";
import PostCardSkeleton from "../components/posts/PostCardSkeleton";
import Button from "../components/ui/Button";
import type { LabPostListItem } from "../types/lab";

const PAGE_SIZE = 6;

export default function LabPage() {
    const { locale, t } = useLocale();
    const [posts, setPosts] = useState<LabPostListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const languageFilter = locale.toUpperCase();

    const loadPage = useCallback(
        async (pageIndex: number, tag: string | null) => {
            const from = pageIndex * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            let query = supabase
                .from("lab_posts")
                .select(
                    "id, title, slug, excerpt, cover_image, published_at, language, tags, difficulty"
                )
                .eq("language", languageFilter)
                .order("published_at", { ascending: false })
                .range(from, to);

            if (tag) {
                query = query.contains("tags", [tag]);
            }

            const { data, error } = await query;

            if (error) {
                console.error(error);
                setErrorMsg(t("lab_error"));
                return [] as LabPostListItem[];
            }
            return (data ?? []) as LabPostListItem[];
        },
        [languageFilter, t]
    );

    useEffect(() => {
        setLoading(true);
        setPage(0);
        setHasMore(true);
        (async () => {
            const first = await loadPage(0, activeTag);
            setPosts(first);
            setHasMore(first.length === PAGE_SIZE);
            setLoading(false);
        })();
    }, [locale, activeTag, loadPage]);

    const loadMore = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        const nextPage = page + 1;
        const next = await loadPage(nextPage, activeTag);
        setPosts((prev) => [...prev, ...next]);
        setPage(nextPage);
        setHasMore(next.length === PAGE_SIZE);
        setLoadingMore(false);
    };

    // Extract unique tags from loaded posts for filter buttons
    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        posts.forEach((p) => p.tags.forEach((tag) => tagSet.add(tag)));
        return Array.from(tagSet).sort();
    }, [posts]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 dark:bg-gradient-to-br dark:from-[#0b1226] dark:via-[#071622] dark:to-[#0a172b] dark:text-white font-sans antialiased rounded-3xl shadow-lg shadow-[#007EAD]/20 transition-colors duration-300">
                <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
                    <header className="text-center mb-20 max-w-3xl mx-auto">
                        <div className="h-16 bg-gray-300 dark:bg-gray-700/50 rounded w-3/4 mx-auto mb-6 animate-pulse" />
                        <div className="h-10 bg-gray-300 dark:bg-gray-700/50 rounded w-1/2 mx-auto mb-8 animate-pulse" />
                        <div className="h-6 bg-gray-300 dark:bg-gray-700/50 rounded w-2/3 mx-auto animate-pulse" />
                    </header>
                    <div className="grid md:grid-cols-2 gap-10">
                        <PostCardSkeleton />
                        <PostCardSkeleton />
                        <PostCardSkeleton />
                        <PostCardSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    if (errorMsg)
        return (
            <p className="text-center mt-20 text-red-500 tracking-wide font-semibold text-lg">
                {errorMsg}
            </p>
        );

    return (
        <div className="min-h-screen bg-white text-gray-900 dark:bg-gradient-to-br dark:from-[#0b1226] dark:via-[#071622] dark:to-[#0a172b] dark:text-white font-sans antialiased rounded-3xl shadow-lg shadow-[#007EAD]/20 transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
                <Helmet>
                    <title>{t("lab_title")} | Arkeon</title>
                    <meta name="description" content={t("lab_meta_description")} />
                    <meta
                        property="og:title"
                        content={`${t("lab_title")} | Arkeon`}
                    />
                    <meta
                        property="og:description"
                        content={t("lab_meta_description")}
                    />
                </Helmet>

                {/* Header */}
                <header className="relative -mt-16 pt-24 pb-16 mb-12 overflow-hidden rounded-t-3xl">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-emerald-500/15 dark:bg-emerald-500/8 rounded-full blur-3xl animate-pulse" />
                        <div
                            className="absolute top-12 right-1/3 w-72 h-72 bg-[#00aaff]/15 dark:bg-[#00aaff]/8 rounded-full blur-3xl animate-pulse"
                            style={{ animationDelay: "1s" }}
                        />
                    </div>

                    <div className="relative max-w-4xl mx-auto text-center px-6">
                        <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mb-8 rounded-full animate-pulse" />

                        <div className="flex items-center justify-center gap-3 mb-6">
                            <FiTerminal className="w-10 h-10 md:w-12 md:h-12 text-emerald-400 animate-pulse" />
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-emerald-400 via-[#00aaff] to-emerald-400 bg-clip-text text-transparent tracking-tight leading-tight bg-[length:200%_auto] animate-gradient">
                                {t("lab_title")}
                            </h1>
                        </div>

                        <p className="text-base md:text-lg text-gray-700 dark:text-white/75 max-w-2xl mx-auto leading-relaxed">
                            {t("lab_description")}
                        </p>

                        <div className="flex items-center justify-center gap-2 mt-10">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                            <div
                                className="w-2 h-2 rounded-full bg-[#00aaff] animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                            />
                            <div
                                className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                                style={{ animationDelay: "0.4s" }}
                            />
                        </div>
                    </div>
                </header>

                {/* Tag filters */}
                {allTags.length > 0 && (
                    <section className="mb-12">
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <button
                                onClick={() => setActiveTag(null)}
                                className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-300 ${activeTag === null
                                        ? "bg-[#007EAD] border-[#00aaff] text-white shadow-lg shadow-[#007EAD]/40"
                                        : "border-gray-300 dark:border-white/10 text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white hover:border-[#00aaff]/60 hover:shadow-lg hover:shadow-[#007EAD]/20 bg-transparent"
                                    }`}
                            >
                                {t("lab_filter_all")}
                            </button>
                            {allTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                                    className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-300 ${activeTag === tag
                                            ? "bg-[#007EAD] border-[#00aaff] text-white shadow-lg shadow-[#007EAD]/40"
                                            : "border-gray-300 dark:border-white/10 text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white hover:border-[#00aaff]/60 hover:shadow-lg hover:shadow-[#007EAD]/20 bg-transparent"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* Post grid */}
                <div className="space-y-20">
                    {posts.length > 0 ? (
                        <section>
                            <div className="grid md:grid-cols-2 gap-10">
                                {posts.map((post) => (
                                    <Link
                                        key={post.id}
                                        to={`/lab/${post.slug}`}
                                        className="block rounded-2xl shadow-md shadow-[#007EAD]/20 hover:shadow-[#00aaff]/50 transition-shadow duration-300 h-full"
                                        aria-label={post.title}
                                    >
                                        <LabPostCard post={post} />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ) : (
                        <p className="text-center text-gray-600 dark:text-white/70 text-lg">
                            {t("lab_empty")}
                        </p>
                    )}

                    {hasMore && posts.length > 0 && (
                        <div className="flex justify-center">
                            <Button
                                onClick={loadMore}
                                loading={loadingMore}
                                loadingText={t("blog_loading_more")}
                                disabled={!hasMore}
                            >
                                {t("blog_load_more")}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

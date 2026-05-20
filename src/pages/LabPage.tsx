import { useEffect, useState, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";

// eslint-disable-next-line react-refresh/only-export-components
export const meta: MetaFunction = () => [
  { title: "Laboratorio Técnico | Arkeonix Labs" },
  { name: "description", content: "Guías avanzadas de equipos, servidores y despliegue técnico por Arkeonix Labs." },
  { tagName: "link", rel: "canonical", href: "https://arkeonixlabs.com/lab" },
  { property: "og:title", content: "Laboratorio Técnico | Arkeonix Labs" },
  { property: "og:description", content: "Guías avanzadas de equipos, servidores y despliegue técnico por Arkeonix Labs." },
  { property: "og:image", content: "https://arkeonixlabs.com/arkeonix-logo.png" },
  { property: "og:url", content: "https://arkeonixlabs.com/lab" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Laboratorio Técnico | Arkeonix Labs" },
  { name: "twitter:description", content: "Guías avanzadas de equipos, servidores y despliegue técnico por Arkeonix Labs." },
  { name: "twitter:image", content: "https://arkeonixlabs.com/arkeonix-logo.png" },
  { property: "og:site_name", content: "Arkeonix Labs" },
  { property: "og:type", content: "website" },
];
import { FiTerminal } from "react-icons/fi";
import LabPostCard from "@/components/posts/LabPostCard";
import PageHero from "@/components/ui/PageHero";
import Pagination from "@/components/ui/Pagination";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/hooks/useLocale";
import { LAB_LIST_SELECT, loadLabListData, type SupabaseListClient } from "@/utils/seoLoaders";
import type { LabPostListItem } from "@/types/lab";

const PAGE_SIZE = 6;

type LabLoaderData = {
    posts: LabPostListItem[];
    totalCount: number;
    language: "ES" | "EN";
};

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ request }: LoaderFunctionArgs): Promise<LabLoaderData> {
    return loadLabListData(
        request,
        supabase ? (supabase as unknown as SupabaseListClient<LabPostListItem>) : null,
        PAGE_SIZE,
    );
}

export default function LabPage() {
    const { locale, t } = useLocale();
    const initialData = useLoaderData<typeof loader>();
    const [posts, setPosts] = useState<LabPostListItem[]>(initialData.posts);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(initialData.totalCount);
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const languageFilter = locale.toUpperCase();
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const fetchPosts = useCallback(
        async (page: number, tag: string | null) => {
            setLoading(true);
            setErrorMsg(null);

            try {
                if (!supabase) {
                    throw new Error("Supabase client is not configured");
                }

                const from = (page - 1) * PAGE_SIZE;
                const to = from + PAGE_SIZE - 1;

                let query = supabase
                    .from("lab_posts")
                    .select(LAB_LIST_SELECT, { count: "exact" })
                    .eq("language", languageFilter)
                    .eq("status", "published")
                    .order("published_at", { ascending: false })
                    .range(from, to);

                if (tag) query = query.contains("tags", [tag]);

                const { data, error, count } = await query;

                if (error) throw error;

                setTotalCount(count ?? 0);
                setPosts((data ?? []) as LabPostListItem[]);
            } catch (error) {
                console.error(error);
                setErrorMsg(t("lab_post_error"));
                setPosts([]);
            } finally {
                setLoading(false);
            }
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
                <title>{t("lab_title")} | Arkeonix Labs</title>
                <meta name="description" content={t("lab_meta_description")} />
            </Helmet>

            <noscript>
                <div className="max-w-5xl mx-auto px-6 py-12 text-center">
                    <p className="text-muted-foreground">
                        {locale === "es"
                            ? "Este sitio utiliza JavaScript para cargar los artículos del lab. Explora todo el contenido en nuestro "
                            : "This site uses JavaScript to load lab articles. Explore all content in our "}
                        <a href="/sitemap.xml" className="text-primary underline">sitemap</a>.
                    </p>
                </div>
            </noscript>

            {/* Header */}
            <ScrollReveal variant="blur" duration={800}>
                <PageHero
                    badge={t("lab_badge")}
                    title={t("lab_title_part1")}
                    titleHighlight={t("lab_title_part2")}
                    description={t("lab_description")}
                    badgeColor="emerald"
                    badgeIcon={<FiTerminal className="w-4 h-4" />}
                />
            </ScrollReveal>

            {/* Tag filters */}
            {allTags.length > 0 && (
                <ScrollReveal variant="fade-up" delay={100}>
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
                </ScrollReveal>
            )}

            {/* Posts grid */}
            {loading && posts.length === 0 ? (
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
                    {posts.map((post, idx) => {
                        const variants = ["fade-left", "fade-right"] as const;
                        return (
                            <ScrollReveal key={post.id} variant={variants[idx % 2]} delay={(idx % 2) * 120} duration={800}>
                                <LabPostCard post={post} />
                            </ScrollReveal>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <ScrollReveal variant="scale" duration={600}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        className="mt-12"
                    />
                </ScrollReveal>
            )}
        </div>
    );
}

import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { FiRadio } from "react-icons/fi";
import PostList from "../components/posts/PostList";
import Pagination from "../components/ui/Pagination";
import { supabase } from "../lib/supabase";
import { useLocale } from "../hooks/useLocale";
import type { PostListItem } from "../types/post";

const NEWS_CATEGORY_VALUES = ["news", "News", "noticias", "Noticias", "NOTICIAS", "NEWS"];
const PAGE_SIZE = 6;

export default function NewsPage() {
  const { locale, t } = useLocale();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const languageFilter = locale.toUpperCase();
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const fetchPosts = useCallback(
    async (page: number) => {
      setLoading(true);
      setErrorMsg(null);

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { count } = await supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("language", languageFilter)
        .in("category", NEWS_CATEGORY_VALUES);

      setTotalCount(count ?? 0);

      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, excerpt, cover_image, published_at, language, category")
        .eq("language", languageFilter)
        .in("category", NEWS_CATEGORY_VALUES)
        .order("published_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error(error);
        setErrorMsg(t("news_error"));
        setPosts([]);
      } else {
        setPosts((data ?? []) as PostListItem[]);
      }
      setLoading(false);
    },
    [languageFilter, t]
  );

  useEffect(() => {
    setCurrentPage(1);
    void fetchPosts(1);
  }, [locale, fetchPosts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    void fetchPosts(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative pt-16 pb-24 overflow-hidden">
      <Helmet>
        <title>{t("news_title")} — Arkeon</title>
        <meta name="description" content={t("news_meta_description")} />
        <meta property="og:title" content={`${t("news_title")} — Arkeon`} />
        <meta property="og:description" content={t("news_meta_description")} />
      </Helmet>

      {/* Background decoration */}
      <div className="grain-overlay" />
      <div className="dot-grid" />
      <div className="glow-spot top-[-5%] right-[-5%] scale-125 opacity-10" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pt-24 md:pt-32 pb-16 text-center space-y-6 animate-reveal">
          <div
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface border border-border/50 text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <FiRadio className="text-primary animate-pulse" />
            {t("category_news")}
          </div>

          <h1 className="text-6xl md:text-8xl font-bold font-display uppercase leading-[0.85] tracking-tighter text-glow">
            {t("news_title")}
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-muted-foreground font-body leading-relaxed">
            {t("news_description")}
          </p>
        </header>

        {/* Content */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-72 rounded-2xl bg-surface border border-border/30 animate-pulse"
              />
            ))}
          </div>
        ) : errorMsg ? (
          <div className="tech-card card-accent-border p-10 text-center rounded-2xl max-w-md mx-auto animate-reveal">
            <div className="text-3xl mb-4">⚠️</div>
            <p className="text-muted-foreground text-sm">{errorMsg}</p>
          </div>
        ) : posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <div className="py-20 text-center animate-reveal">
            <h2 className="text-2xl font-bold font-display text-muted-foreground/30">
              {t("news_empty")}
            </h2>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-16 animate-reveal">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

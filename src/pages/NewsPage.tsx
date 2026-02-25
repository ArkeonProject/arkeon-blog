import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
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
    <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
      <Helmet>
        <title>{t("news_title")} | Arkeon</title>
        <meta name="description" content={t("news_meta_description")} />
        <meta property="og:title" content={`${t("news_title")} | Arkeon`} />
        <meta property="og:description" content={t("news_meta_description")} />
      </Helmet>

      <header className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4">
          {t("news_title")}
        </h1>
        <p className="text-gray-600 dark:text-white/70 text-lg md:text-xl max-w-3xl mx-auto">
          {t("news_description")}
        </p>
      </header>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-2xl bg-gray-200 dark:bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : errorMsg ? (
        <p className="text-center text-red-500 font-semibold text-lg">{errorMsg}</p>
      ) : posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <p className="text-center text-gray-500 dark:text-white/50 text-lg py-20">
          {t("news_empty")}
        </p>
      )}

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

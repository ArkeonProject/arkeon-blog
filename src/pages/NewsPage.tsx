import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import PostList from "../components/posts/PostList";
import { supabase } from "../lib/supabase";
import { useLocale } from "../hooks/useLocale";
import type { PostListItem } from "../types/post";

const NEWS_CATEGORY_VALUES = ["news", "News", "noticias", "Noticias", "NOTICIAS", "NEWS"];

export default function NewsPage() {
  const { locale, t } = useLocale();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const languageFilter = locale.toUpperCase();

  const fetchNewsPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_image, published_at, language, category")
      .eq("language", languageFilter)
      .in("category", NEWS_CATEGORY_VALUES)
      .order("published_at", { ascending: false });

    if (error) {
      console.error(error);
      setErrorMsg(t("news_error"));
      setPosts([]);
    } else {
      setErrorMsg(null);
      setPosts((data ?? []) as PostListItem[]);
    }

    setLoading(false);
  }, [languageFilter, t]);

  useEffect(() => {
    void fetchNewsPosts();
  }, [fetchNewsPosts]);

  if (loading) {
    return <p className="text-center mt-20 text-white/70 tracking-wide font-semibold text-lg">{t("category_loading")}</p>;
  }

  if (errorMsg) {
    return <p className="text-center mt-20 text-red-500 tracking-wide font-semibold text-lg">{errorMsg}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
      <Helmet>
        <title>{t("news_title")} | Arkeon</title>
        <meta name="description" content={t("news_meta_description")} />
        <meta property="og:title" content={`${t("news_title")} | Arkeon`} />
        <meta property="og:description" content={t("news_meta_description")} />
      </Helmet>

      <section className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">{t("news_title")}</h1>
        <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto">{t("news_description")}</p>
      </section>

      {posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <p className="text-center text-white/70 text-lg">{t("news_empty")}</p>
      )}
    </div>
  );
}

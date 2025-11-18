import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import InfiniteCarousel from "../components/layout/InfiniteCarousel";
import NewsletterForm from "../components/forms/NewsletterForm";
import FeaturedPostCard from "../components/posts/FeaturedPostCard";
import PostList from "../components/posts/PostList";
import Button from "../components/ui/Button";
import { supabase } from "../lib/supabase";
import { trackEvent } from "../lib/analytics";
import { useLocale } from "../hooks/useLocale";
import type { PostListItem } from "../types/post";

const PAGE_SIZE = 6;
const FIRST_PAGE_SIZE = PAGE_SIZE + 1;

export default function BlogPage() {
  const { locale, t } = useLocale();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [featuredPost, setFeaturedPost] = useState<PostListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const languageFilter = locale.toUpperCase();

  const loadPage = useCallback(async (pageIndex: number) => {
    const isFirstPage = pageIndex === 0;
    const pageSize = isFirstPage ? FIRST_PAGE_SIZE : PAGE_SIZE;
    const from = isFirstPage ? 0 : FIRST_PAGE_SIZE + (pageIndex - 1) * PAGE_SIZE;
    const to = from + pageSize - 1;
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_image, published_at, language")
      .eq("language", languageFilter)
      .order("published_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error(error);
      setErrorMsg(t("blog_error"));
      return [] as PostListItem[];
    }
    return (data ?? []) as PostListItem[];
  }, [languageFilter, t]);

  useEffect(() => {
    setLoading(true);
    setPage(0);
    setHasMore(true);
    (async () => {
      const first = await loadPage(0);
      if (first.length > 0) {
        setFeaturedPost(first[0]);
        setPosts(first.slice(1));
        setHasMore(first.length === FIRST_PAGE_SIZE);
      } else {
        setFeaturedPost(null);
        setPosts([]);
        setHasMore(false);
      }
      setLoading(false);
    })();
  }, [locale, loadPage]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const next = await loadPage(nextPage);
    setPosts((prev) => [...prev, ...next]);
    setPage(nextPage);
    setHasMore(next.length === PAGE_SIZE);
    setLoadingMore(false);
    trackEvent("blog_load_more", {
      page: nextPage,
      fetched: next.length,
      locale,
    });
  };
  if (loading) return <p className="text-center mt-20 text-white/70 tracking-wide font-semibold text-lg">{t("blog_loading")}</p>;
  if (errorMsg) return <p className="text-center mt-20 text-red-500 tracking-wide font-semibold text-lg">{errorMsg}</p>;

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0b1226] via-[#071622] to-[#0a172b] text-white font-sans antialiased rounded-3xl shadow-lg shadow-[#007EAD]/20">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <Helmet>
          <title>{t("blog_title")} | Arkeon</title>
          <meta name="description" content={t("blog_meta_description")} />
          <meta property="og:title" content={`${t("blog_title")} | Arkeon`} />
          <meta property="og:description" content={t("blog_meta_description")} />
        </Helmet>

        <header className="text-center mb-20 max-w-3xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-linear-to-r from-white via-[#00aaff]/70 to-white bg-clip-text text-transparent drop-shadow-lg animate-fade-in tracking-tight leading-tight">
            {t("blog_intro_title")}
          </h1>
          <p className="text-3xl md:text-4xl font-semibold text-[#00aaff] mb-8 drop-shadow-md animate-fade-in-delay-1 tracking-wide">
            {t("blog_intro_subtitle")}
          </p>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed tracking-wide animate-fade-in-delay-2">
            {t("blog_intro_description")}
          </p>
        </header>

        <div className="space-y-20">
          {featuredPost && (
            <section className="shadow-lg shadow-[#007EAD]/30 rounded-3xl overflow-hidden transition-transform transform hover:scale-[1.02] duration-500">
              <FeaturedPostCard post={featuredPost} />
            </section>
          )}

          <section>
            <InfiniteCarousel />
          </section>

          {posts.length > 0 && (
            <section>
              <PostList posts={posts} />
            </section>
          )}

          {hasMore && (
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

          <section>
            <NewsletterForm />
          </section>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import InfiniteCarousel from "../components/layout/InfiniteCarousel";
import NewsletterForm from "../components/forms/NewsletterForm";
import FeaturedPostCard from "../components/posts/FeaturedPostCard";
import FeaturedPostSkeleton from "../components/posts/FeaturedPostSkeleton";
import PostList from "../components/posts/PostList";
import PostCardSkeleton from "../components/posts/PostCardSkeleton";
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
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 dark:bg-gradient-to-br dark:from-[#0b1226] dark:via-[#071622] dark:to-[#0a172b] dark:text-white font-sans antialiased rounded-3xl shadow-lg shadow-[#007EAD]/20 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <header className="text-center mb-20 max-w-3xl mx-auto">
            <div className="h-16 bg-gray-300 dark:bg-gray-700/50 rounded w-3/4 mx-auto mb-6 animate-pulse"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-700/50 rounded w-1/2 mx-auto mb-8 animate-pulse"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700/50 rounded w-2/3 mx-auto animate-pulse"></div>
          </header>

          <div className="space-y-20">
            <FeaturedPostSkeleton />
            <div className="grid md:grid-cols-2 gap-10">
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (errorMsg) return <p className="text-center mt-20 text-red-500 tracking-wide font-semibold text-lg">{errorMsg}</p>;

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gradient-to-br dark:from-[#0b1226] dark:via-[#071622] dark:to-[#0a172b] dark:text-white font-sans antialiased rounded-3xl shadow-lg shadow-[#007EAD]/20 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <Helmet>
          <title>{t("blog_title")} | Arkeon</title>
          <meta name="description" content={t("blog_meta_description")} />
          <meta property="og:title" content={`${t("blog_title")} | Arkeon`} />
          <meta property="og:description" content={t("blog_meta_description")} />
        </Helmet>

        <header className="relative -mt-16 pt-24 pb-16 mb-12 overflow-hidden rounded-t-3xl">
          {/* Animated decorative elements only */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#007EAD]/20 dark:bg-[#007EAD]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-12 right-1/3 w-72 h-72 bg-[#00aaff]/15 dark:bg-[#00aaff]/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative max-w-4xl mx-auto text-center px-6">
            {/* Animated accent line */}
            <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-[#007EAD] to-transparent mx-auto mb-8 rounded-full animate-pulse"></div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-[#007EAD] via-[#00aaff] to-[#007EAD] bg-clip-text text-transparent animate-fade-in tracking-tight leading-tight bg-[length:200%_auto] animate-gradient">
              {t("blog_intro_title")}
            </h1>

            <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white/95 mb-6 animate-fade-in-delay-1 drop-shadow-sm">
              {t("blog_intro_subtitle")}
            </p>

            <p className="text-base md:text-lg text-gray-700 dark:text-white/75 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay-2">
              {t("blog_intro_description")}
            </p>

            {/* Bottom decorative element */}
            <div className="flex items-center justify-center gap-2 mt-10">
              <div className="w-2 h-2 rounded-full bg-[#007EAD] animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-[#00aaff] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-[#007EAD] animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
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

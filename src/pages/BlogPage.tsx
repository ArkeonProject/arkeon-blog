import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PostCard from "../components/PostCard.tsx";
import FeaturedPostCard from "../components/FeaturedPostCard.tsx";
import InfiniteCarousel from "../components/InfiniteCarousel.tsx";
import NewsletterForm from "../components/NewsletterForm.tsx";
import { useLocale } from "../context/LocaleContext";
import type { PostListItem } from "../types/post";

const PAGE_SIZE = 6;

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
    const from = pageIndex * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
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
      setHasMore(first.length === PAGE_SIZE);
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

        {featuredPost && (
          <section className="mb-20 shadow-lg shadow-[#007EAD]/30 rounded-3xl overflow-hidden transition-transform transform hover:scale-[1.02] duration-500">
            <FeaturedPostCard post={featuredPost} />
          </section>
        )}
      </div>

      <section className="mb-20">
        <InfiniteCarousel />
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-24">
        {posts.length > 0 && (
          <section className="grid md:grid-cols-2 gap-10">
            {posts.map((post) => (
              <Link 
                key={post.id} 
                to={`/post/${post.slug}`} 
                className="block rounded-2xl shadow-md shadow-[#007EAD]/20 hover:shadow-[#00aaff]/50 transition-shadow duration-400"
                aria-label={post.title}
              >
                <PostCard post={post} />
              </Link>
            ))}
          </section>
        )}

        {hasMore && (
          <div className="flex justify-center mt-14">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-8 py-4 rounded-xl bg-linear-to-r from-[#007EAD] to-[#00aaff] text-white font-semibold tracking-wide shadow-lg shadow-[#007EAD]/50 hover:from-[#00aaff] hover:to-[#007EAD] hover:shadow-[#00aaff]/70 focus:outline-none focus:ring-4 focus:ring-[#00aaff]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loadingMore ? t("blog_loading_more") : t("blog_load_more")}
            </button>
          </div>
        )}

        <div className="mt-28">
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
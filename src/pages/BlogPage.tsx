import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FiTerminal } from "react-icons/fi";
import InfiniteCarousel from "../components/layout/InfiniteCarousel";
import NewsletterForm from "../components/forms/NewsletterForm";
import FeaturedPostCard from "../components/posts/FeaturedPostCard";
import FeaturedPostSkeleton from "../components/posts/FeaturedPostSkeleton";
import PostList from "../components/posts/PostList";
import PostCardSkeleton from "../components/posts/PostCardSkeleton";
import LabPostCard from "../components/posts/LabPostCard";
import Pagination from "../components/ui/Pagination";
import { supabase } from "../lib/supabase";
import { useLocale } from "../hooks/useLocale";
import type { PostListItem } from "../types/post";
import type { LabPostListItem } from "../types/lab";

const PAGE_SIZE = 6;

export default function BlogPage() {
  const { locale, t } = useLocale();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [featuredPost, setFeaturedPost] = useState<PostListItem | null>(null);
  const [labPosts, setLabPosts] = useState<LabPostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const languageFilter = locale.toUpperCase();
  const totalPages = Math.ceil(Math.max(totalCount - 1, 0) / PAGE_SIZE); // -1 for featured

  // Fetch blog posts with pagination
  const fetchPosts = useCallback(async (page: number) => {
    setLoading(true);
    setErrorMsg(null);

    // Get total count
    const { count } = await supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("language", languageFilter);

    setTotalCount(count ?? 0);

    if (page === 1) {
      // First page: featured + grid
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, excerpt, cover_image, published_at, language")
        .eq("language", languageFilter)
        .order("published_at", { ascending: false })
        .range(0, PAGE_SIZE);

      if (error) {
        console.error(error);
        setErrorMsg(t("blog_error"));
      } else {
        const items = (data ?? []) as PostListItem[];
        setFeaturedPost(items[0] ?? null);
        setPosts(items.slice(1));
      }
    } else {
      // Subsequent pages: offset by 1 (featured) + PAGE_SIZE * (page - 2) for page 2, etc.
      const from = 1 + (page - 1) * PAGE_SIZE;
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
      } else {
        setFeaturedPost(null);
        setPosts((data ?? []) as PostListItem[]);
      }
    }
    setLoading(false);
  }, [languageFilter, t]);

  // Fetch latest lab posts
  const fetchLabPosts = useCallback(async () => {
    const { data } = await supabase
      .from("lab_posts")
      .select("id, title, slug, excerpt, cover_image, published_at, language, tags, difficulty")
      .eq("language", languageFilter)
      .order("published_at", { ascending: false })
      .limit(2);

    setLabPosts((data ?? []) as LabPostListItem[]);
  }, [languageFilter]);

  useEffect(() => {
    setCurrentPage(1);
    void fetchPosts(1);
    void fetchLabPosts();
  }, [locale, fetchPosts, fetchLabPosts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    void fetchPosts(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && currentPage === 1 && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 dark:bg-gradient-to-br dark:from-[#0b1226] dark:via-[#071622] dark:to-[#0a172b] dark:text-white font-sans antialiased rounded-3xl shadow-lg shadow-[#007EAD]/20 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <header className="text-center mb-20 max-w-3xl mx-auto">
            <div className="h-16 bg-gray-300 dark:bg-gray-700/50 rounded w-3/4 mx-auto mb-6 animate-pulse" />
            <div className="h-10 bg-gray-300 dark:bg-gray-700/50 rounded w-1/2 mx-auto mb-8 animate-pulse" />
            <div className="h-6 bg-gray-300 dark:bg-gray-700/50 rounded w-2/3 mx-auto animate-pulse" />
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
          <title>{t("blog_title")} | Arkeon</title>
          <meta name="description" content={t("blog_meta_description")} />
          <meta property="og:title" content={`${t("blog_title")} | Arkeon`} />
          <meta property="og:description" content={t("blog_meta_description")} />
        </Helmet>

        <header className="relative -mt-16 pt-24 pb-16 mb-12 overflow-hidden rounded-t-3xl">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#007EAD]/20 dark:bg-[#007EAD]/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-12 right-1/3 w-72 h-72 bg-[#00aaff]/15 dark:bg-[#00aaff]/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="relative max-w-4xl mx-auto text-center px-6">
            <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-[#007EAD] to-transparent mx-auto mb-8 rounded-full animate-pulse" />

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-[#007EAD] via-[#00aaff] to-[#007EAD] bg-clip-text text-transparent tracking-tight leading-tight bg-[length:200%_auto]">
              {t("blog_intro_title")}
            </h1>

            <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white/95 mb-6 drop-shadow-sm">
              {t("blog_intro_subtitle")}
            </p>

            <p className="text-base md:text-lg text-gray-700 dark:text-white/75 max-w-2xl mx-auto leading-relaxed">
              {t("blog_intro_description")}
            </p>

            <div className="flex items-center justify-center gap-2 mt-10">
              <div className="w-2 h-2 rounded-full bg-[#007EAD] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#00aaff] animate-bounce" style={{ animationDelay: "0.2s" }} />
              <div className="w-2 h-2 rounded-full bg-[#007EAD] animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        </header>

        <div className="space-y-16">
          {/* Featured post (only on page 1) */}
          {featuredPost && (
            <section className="shadow-lg shadow-[#007EAD]/30 rounded-3xl overflow-hidden transition-transform transform hover:scale-[1.01] duration-500">
              <FeaturedPostCard post={featuredPost} />
            </section>
          )}

          <section>
            <InfiniteCarousel />
          </section>

          {/* Lab section (only on page 1) */}
          {currentPage === 1 && labPosts.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FiTerminal className="w-6 h-6 text-emerald-400" />
                    {locale === "es" ? "Últimos del Lab" : "Latest from Lab"}
                  </h2>
                </div>
                <Link
                  to="/lab"
                  className="text-emerald-500 hover:text-emerald-400 font-semibold text-sm transition-colors duration-200"
                >
                  {locale === "es" ? "Ver todo →" : "View all →"}
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {labPosts.map((post) => (
                  <LabPostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Post grid */}
          {posts.length > 0 && (
            <section>
              <PostList posts={posts} />
            </section>
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

          <section>
            <NewsletterForm />
          </section>
        </div>
      </div>
    </div>
  );
}

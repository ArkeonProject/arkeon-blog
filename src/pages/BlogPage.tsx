import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FiTerminal, FiSearch, FiCode, FiFileText } from "react-icons/fi";
import NewsletterForm from "../components/forms/NewsletterForm";
import InfiniteCarousel from "../components/layout/InfiniteCarousel";
import FeaturedPostCard from "../components/posts/FeaturedPostCard";
import PostCard from "../components/posts/PostCard";
import LabPostCard from "../components/posts/LabPostCard";
import Pagination from "../components/ui/Pagination";
import { supabase } from "../lib/supabase";
import { useLocale } from "../hooks/useLocale";
import type { PostListItem } from "../types/post";
import type { LabPostListItem } from "../types/lab";

const PAGE_SIZE = 7;

export default function BlogPage() {
  const { locale, t } = useLocale();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [labPosts, setLabPosts] = useState<LabPostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const languageFilter = locale.toUpperCase();
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      let query = supabase
        .from("posts")
        .select("*", { count: "exact" })
        .eq("language", languageFilter)
        .order("published_at", { ascending: false });

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      setPosts(data || []);
      setTotalCount(count || 0);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Error fetching posts:", err);
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  }, [languageFilter, currentPage, searchQuery]);

  // Fetch latest 3 lab posts
  useEffect(() => {
    const fetchLabPosts = async () => {
      try {
        const { data } = await supabase
          .from("lab_posts")
          .select("*")
          .eq("language", languageFilter)
          .order("published_at", { ascending: false })
          .limit(3);
        setLabPosts(data || []);
      } catch (err) {
        console.error("Error fetching lab posts:", err);
      }
    };
    fetchLabPosts();
  }, [languageFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  if (loading && currentPage === 1 && posts.length === 0) {
    return (
      <div className="min-h-screen pt-32 px-4 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto" />
      </div>
    );
  }

  if (errorMsg) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="tech-card card-accent-border p-10 text-center rounded-2xl max-w-md">
        <div className="text-3xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-3 font-display">{locale === "es" ? "Error de conexión" : "Connection Error"}</h2>
        <p className="text-muted-foreground text-sm mb-6">{errorMsg}</p>
        <button onClick={() => fetchPosts()} className="h-10 px-6 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all">
          {locale === "es" ? "Reintentar" : "Retry"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative pt-16 pb-24 overflow-hidden">
      <Helmet>
        <title>{t("blog_title")} — Precisión Técnica</title>
        <meta name="description" content={t("blog_meta_description")} />
        <link rel="canonical" href="https://www.arkeonixlabs.com/blog" />
      </Helmet>

      {/* Atmospheric Background */}
      <div className="grain-overlay" />
      <div className="dot-grid" />
      <div className="glow-spot top-[-10%] left-[-10%] scale-150 opacity-15" />
      <div className="glow-spot bottom-[-20%] right-[-10%] opacity-10 scale-125" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* HERO SECTION */}
        {currentPage === 1 && (
          <header className="pt-28 md:pt-40 pb-12 text-center space-y-8 animate-reveal relative">
            <div
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface border border-border/50 text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground animate-float"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <FiTerminal className="text-primary animate-pulse" />
              {t("intelligence_in_motion")}
            </div>

            <div className="space-y-3">
              <h1 className="text-7xl md:text-[9rem] font-bold font-display uppercase leading-[0.85] tracking-tighter text-glow">
                Arkeonix <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-muted-foreground/40 to-muted-foreground/5 dark:from-muted-foreground/25 dark:to-transparent">
                  {t("journal")}
                </span>
              </h1>
            </div>

            <p className="max-w-2xl mx-auto text-base md:text-lg text-muted-foreground font-body leading-relaxed">
              {t("blog_intro_description")}
            </p>

            <div className="flex justify-center pt-4">
              <div className="relative group w-full max-w-xl">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: "0 0 40px color-mix(in oklch, var(--color-primary) 15%, transparent)",
                  }}
                />
                <div className="relative flex items-center p-1.5 bg-surface border border-border/60 rounded-2xl focus-within:border-primary/40 transition-all duration-300"
                  style={{
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03), 0 0 0 1px color-mix(in oklch, var(--color-border) 40%, transparent)",
                  }}
                >
                  <FiSearch className="ml-4 text-muted-foreground group-focus-within:text-primary transition-colors text-lg" />
                  <input
                    type="text"
                    placeholder={t("search_placeholder")}
                    className="flex-1 px-3 py-3 bg-transparent border-none focus:outline-none focus:ring-0 font-body text-base placeholder:text-muted-foreground/40"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-[11px]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {t("explore")}
                  </button>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* FEATURED & GRID */}
        {posts.length > 0 ? (
          <section className="space-y-20">

            {/* SaaS Banner — destacado antes del featured post */}
            {currentPage === 1 && (
              <div className="animate-reveal [animation-delay:150ms]">
                <Link
                  to="/arkeonix"
                  className="group relative flex flex-col md:flex-row items-center gap-8 md:gap-12 tech-card card-accent-border rounded-3xl px-8 md:px-12 py-10 overflow-hidden hover:border-primary/50 transition-all duration-300"
                  style={{ boxShadow: "0 0 60px -15px color-mix(in oklch, var(--color-primary) 15%, transparent)" }}
                >
                  <div className="dot-grid opacity-30" />
                  <div className="glow-spot top-0 right-0 scale-75 opacity-20" />
                  <div className="relative flex-1 space-y-3 text-center md:text-left">
                    <span
                      className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-primary"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      {t("saas_banner_badge")}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight leading-tight">
                      {t("saas_banner_title")}
                    </h2>
                    <p className="text-muted-foreground text-base max-w-lg">
                      {t("saas_banner_description")}
                    </p>
                  </div>
                  <span
                    className="relative flex-shrink-0 inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest group-hover:opacity-90 group-hover:scale-[1.02] transition-all shadow-lg shadow-primary/25"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {t("saas_banner_cta")}
                  </span>
                </Link>
              </div>
            )}

            {currentPage === 1 && featuredPost && (() => {
              const cat = (featuredPost.category ?? "").toLowerCase();
              const isNews = ["news", "noticias"].some(v => cat.includes(v));
              const isProduct = ["product", "producto"].some(v => cat.includes(v));
              const viewLink = isNews ? "/news" : isProduct ? "/products" : "/blog";
              const viewKey = isNews ? "blog_view_news" : isProduct ? "blog_view_products" : "blog_view_blog";
              return (
                <div className="animate-reveal [animation-delay:200ms] space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
                        <FiFileText className="w-4 h-4 text-primary" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight">
                        {t("blog_latest")}
                      </h2>
                    </div>
                    <Link
                      to={viewLink}
                      className="inline-flex items-center text-xs font-bold text-primary uppercase tracking-[0.15em] hover:opacity-70 transition-colors group"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {t(viewKey)}
                    </Link>
                  </div>
                  <FeaturedPostCard post={featuredPost} />
                </div>
              );
            })()}

            {/* LAB SECTION */}
            {currentPage === 1 && labPosts.length > 0 && (
              <div className="animate-reveal space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <FiCode className="w-4 h-4 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight">
                      {t("lab_latest")}
                    </h2>
                  </div>
                  <Link
                    to="/lab"
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-[0.15em] hover:text-emerald-400 transition-colors group"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {t("lab_view_all")}
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {labPosts.map((post, idx) => (
                    <div
                      key={post.id}
                      className="animate-reveal"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <LabPostCard post={post} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ticker — below lab section */}
            {currentPage === 1 && (
              <div className="animate-reveal [animation-delay:300ms] -mx-4 sm:-mx-6 lg:-mx-8">
                <InfiniteCarousel />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.map((post, idx) => (
                <div
                  key={post.id}
                  className="animate-reveal"
                  style={{ animationDelay: `${(idx + 1) * 80}ms` }}
                >
                  <Link to={`/post/${post.slug}`} className="block h-full">
                    <PostCard post={post} />
                  </Link>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            {currentPage === 1 && (
              <div className="tech-card card-accent-border p-10 md:p-16 rounded-2xl text-center space-y-8 animate-reveal">
                <div className="dot-grid" />
                <div className="relative max-w-2xl mx-auto space-y-5">
                  <h2 className="text-3xl md:text-5xl font-bold font-display leading-[0.95] tracking-tight">
                    {t("ready_next_era").split(" ").slice(0, -2).join(" ")}{" "}
                    <span className="text-primary">{t("ready_next_era").split(" ").slice(-2).join(" ")}</span>
                  </h2>
                  <p className="text-muted-foreground text-base md:text-lg font-body">
                    {t("newsletter_description")}
                  </p>
                </div>
                <div className="relative max-w-md mx-auto">
                  <NewsletterForm />
                </div>
              </div>
            )}
          </section>
        ) : (
          <section className="py-20 text-center animate-reveal">
            <h2 className="text-3xl font-bold font-display text-muted-foreground/30">
              {locale === "es" ? "No se encontraron artículos" : "No articles found"}
            </h2>
          </section>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center pb-12 animate-reveal">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

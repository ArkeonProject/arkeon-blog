import { useEffect, useState, useCallback, type ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import type { MetaFunction } from "react-router";
import {
  FiSearch,
  FiArrowRight,
} from "react-icons/fi";
import NewsletterForm from "@/components/forms/NewsletterForm";
import FeaturedPostCard from "@/components/posts/FeaturedPostCard";
import PostCard from "@/components/posts/PostCard";
import Pagination from "@/components/ui/Pagination";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PostSkeleton from "@/components/ui/PostSkeleton";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/hooks/useLocale";
import type { PostListItem } from "@/types/post";

const PAGE_SIZE = 9;

// eslint-disable-next-line react-refresh/only-export-components
export const meta: MetaFunction = () => {
  return [
    { title: "Blog — Arkeonix Labs" },
    { name: "description", content: "Análisis y guías prácticas sobre desarrollo, testing y crecimiento profesional en el mercado español." },
    { tagName: "link", rel: "canonical", href: "https://arkeonixlabs.com/blog" },
    { property: "og:title", content: "Blog — Arkeonix Labs" },
    { property: "og:description", content: "Análisis y guías prácticas sobre desarrollo, testing y crecimiento profesional en el mercado español." },
    { property: "og:image", content: "https://arkeonixlabs.com/arkeonix-logo.png" },
    { property: "og:url", content: "https://arkeonixlabs.com/blog" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Blog — Arkeonix Labs" },
    { name: "twitter:description", content: "Análisis y guías prácticas sobre desarrollo, testing y crecimiento profesional en el mercado español." },
    { name: "twitter:image", content: "https://arkeonixlabs.com/arkeonix-logo.png" },
  ];
};

function TitleGlow({ children }: { children: ReactNode }) {
  const [pos, setPos] = useState({ x: 0, y: 0, active: false });

  const handleMove = (e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY, active: true });
  };

  const handleEnter = () => setPos((p) => ({ ...p, active: true }));
  const handleLeave = () => setPos((p) => ({ ...p, active: false }));

  return (
    <>
      {/* Fixed glow that follows cursor — never clipped by containers */}
      <div
        className="fixed pointer-events-none z-0 transition-opacity duration-300 ease-out"
        style={{
          left: pos.x - 450,
          top: pos.y - 450,
          width: 900,
          height: 900,
          opacity: pos.active ? 1 : 0,
          background: `radial-gradient(120px circle, color-mix(in oklch, var(--color-primary) 50%, transparent), transparent 40%)`,
          filter: "blur(25px)",
        }}
      />
      {/* Hover area — only the text */}
      <span
        onMouseMove={handleMove}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="relative z-10 inline-block cursor-default"
      >
        {children}
      </span>
    </>
  );
}

export default function BlogPage() {
  const { locale, t } = useLocale();
  const [posts, setPosts] = useState<PostListItem[]>([]);
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
        .eq("status", "published")
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

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const featuredPost = currentPage === 1 ? posts[0] : undefined;
  const otherPosts = currentPage === 1 ? posts.slice(1) : posts;

  if (loading && currentPage === 1 && posts.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="w-32 h-8 bg-muted/40 rounded-full animate-pulse" />
            <div className="w-full max-w-xl h-6 bg-muted/20 rounded-xl animate-pulse" />
          </div>
          <div className="w-full max-w-xl h-14 bg-muted/20 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="tech-card card-accent-border p-10 text-center rounded-2xl max-w-md">
          <div className="text-3xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-3 font-display">
            {locale === "es" ? "Error de conexión" : "Connection Error"}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">{errorMsg}</p>
          <button
            onClick={() => fetchPosts()}
            className="h-10 px-6 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            {locale === "es" ? "Reintentar" : "Retry"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-0 pb-24">
      <Helmet>
        <title>{t("blog_title")}</title>
        <meta name="description" content={t("blog_meta_description")} />
        <link rel="canonical" href="https://www.arkeonixlabs.com/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${t("blog_title")} — Arkeonix Labs`} />
        <meta property="og:description" content={t("blog_meta_description")} />
        <meta property="og:url" content="https://www.arkeonixlabs.com/blog" />
        <meta property="og:site_name" content="Arkeonix Labs" />
        <meta property="og:image" content="https://www.arkeonixlabs.com/arkeonix-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t("blog_title")} — Arkeonix Labs`} />
        <meta name="twitter:description" content={t("blog_meta_description")} />
        <meta name="twitter:image" content="https://www.arkeonixlabs.com/arkeonix-logo.png" />
      </Helmet>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* ── HEADER ── */}
        <div className="pt-24 text-center">
          <div className="space-y-5">
            {/* Title with mouse-tracking glow */}
            <TitleGlow>
              <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight leading-[1.05]">
                {t("blog_title_part1")}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  {t("blog_title_part2")}
                </span>
              </h1>
            </TitleGlow>

            {/* Search */}
            <div className="relative group w-full max-w-2xl mx-auto">
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"
                style={{
                  boxShadow: "0 0 60px color-mix(in oklch, var(--color-primary) 15%, transparent)",
                }}
              />
              <div
                className="relative flex items-center p-2 bg-surface border border-border/60 rounded-2xl focus-within:border-primary/40 transition-all duration-300"
                style={{
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03), 0 0 0 1px color-mix(in oklch, var(--color-border) 40%, transparent)",
                }}
              >
                <FiSearch className="ml-5 text-muted-foreground group-focus-within:text-primary transition-colors text-xl" />
                <input
                  type="text"
                  placeholder={t("blog_search_placeholder")}
                  className="flex-1 px-4 py-4 bg-transparent border-none focus:outline-none focus:ring-0 font-body text-lg placeholder:text-muted-foreground/40"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {(locale === "es"
                ? ["QA Automation", "Carrera Tech", "Sueldos", "Portfolio", "Primer empleo", "DevOps", "Java/Selenium"]
                : ["QA Automation", "Tech Career", "Salaries", "Portfolio", "First Job", "DevOps", "Java/Selenium"]
              ).map((cat) => (
                <span
                  key={cat}
                  className="px-4 py-1.5 rounded-full bg-surface border border-border/50 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors cursor-default"
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base leading-relaxed">
              {t("blog_page_description")}
            </p>
          </div>
        </div>

        {/* ── FEATURED POST ── */}
        {featuredPost && (
          <ScrollReveal variant="flip-up" duration={900}>
            <FeaturedPostCard post={featuredPost} />
          </ScrollReveal>
        )}

        {/* ── POSTS GRID + PAGINATION ── */}
        {otherPosts.length > 0 ? (
          <section className="space-y-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.map((post, idx) => {
                const variants = ["fade-left", "fade-up", "fade-right"] as const;
                return (
                  <ScrollReveal
                    key={post.id}
                    variant={variants[idx % 3]}
                    delay={(idx % 3) * 120}
                    duration={800}
                  >
                    <Link to={`/post/${post.slug}`} className="block h-full">
                      <PostCard post={post} />
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <ScrollReveal variant="scale" duration={600} className="flex justify-center pt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </ScrollReveal>
            )}
          </section>
        ) : (
          <section className="py-20 text-center">
            <h2 className="text-3xl font-bold font-display text-muted-foreground/30">
              {locale === "es" ? "No se encontraron artículos" : "No articles found"}
            </h2>
          </section>
        )}

        {/* ── TAMBIÉN TE PUEDE INTERESAR ── */}
        <section className="space-y-24">
          <ScrollReveal variant="fade-up" duration={800}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <FiArrowRight className="w-4 h-4 text-emerald-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight">
                {t("blog_you_might_like")}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Guía Junior */}
            <ScrollReveal variant="fade-left" duration={800}>
              <Link to="/guia-junior" className="group block h-full">
                <div className="tech-card card-accent-border rounded-2xl p-6 h-full hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex flex-col h-full space-y-3">
                    <span
                      className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-500"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {t("blog_guia_badge")}
                    </span>
                    <h3 className="text-lg font-bold font-display tracking-tight group-hover:text-emerald-500 transition-colors">
                      {t("blog_guia_title")}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                      {t("blog_guia_description")}
                    </p>
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-[0.15em] group-hover:gap-3 transition-all">
                      <span style={{ fontFamily: "var(--font-mono)" }}>
                        {t("blog_guia_cta")}
                      </span>
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* SaaS Boilerplate */}
            <ScrollReveal variant="fade-right" duration={800}>
              <Link to="/arkeonix" className="group block h-full">
                <div className="tech-card card-accent-border rounded-2xl p-6 h-full hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex flex-col h-full space-y-3">
                    <span
                      className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-primary"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      {t("saas_banner_badge")}
                    </span>
                    <h3 className="text-lg font-bold font-display tracking-tight group-hover:text-primary transition-colors">
                      {t("saas_banner_title")}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                      {t("saas_banner_description")}
                    </p>
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-[0.15em] group-hover:gap-3 transition-all">
                      <span style={{ fontFamily: "var(--font-mono)" }}>
                        {t("saas_banner_cta")}
                      </span>
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* ── NEWSLETTER ── */}
        <ScrollReveal variant="zoom-in" duration={900}>
          <div className="tech-card card-accent-border p-10 md:p-16 rounded-2xl text-center space-y-14">
            <div className="dot-grid" />
            <div className="relative max-w-2xl mx-auto space-y-5">
              <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight tracking-tight">
                {t("newsletter_title")}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg font-body">
                {t("newsletter_description")}
              </p>
            </div>
            <div className="relative max-w-md mx-auto">
              <NewsletterForm />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

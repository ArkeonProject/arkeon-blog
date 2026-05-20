import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import type { MetaFunction } from "react-router";
import {
  FiTool,
  FiMap,
  FiTerminal,
  FiFileText,
  FiArrowRight,
  FiZap,
} from "react-icons/fi";
import NewsletterForm from "@/components/forms/NewsletterForm";
import FeaturedPostCard from "@/components/posts/FeaturedPostCard";
import PostCard from "@/components/posts/PostCard";
import LabPostCard from "@/components/posts/LabPostCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PostSkeleton from "@/components/ui/PostSkeleton";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/hooks/useLocale";
import type { PostListItem } from "@/types/post";
import type { LabPostListItem } from "@/types/lab";

// eslint-disable-next-line react-refresh/only-export-components
export const meta: MetaFunction = () => {
  return [
    { title: "Arkeonix Labs — Herramientas, rutas y proyectos para crecer en tech" },
    {
      name: "description",
      content:
        "Herramientas gratuitas, rutas de aprendizaje y contenido técnico para juniors, QA y devs en España.",
    },
    { tagName: "link", rel: "canonical", href: "https://arkeonixlabs.com/" },
    {
      property: "og:title",
      content: "Arkeonix Labs — Herramientas, rutas y proyectos para crecer en tech",
    },
    {
      property: "og:description",
      content:
        "Herramientas gratuitas, rutas de aprendizaje y contenido técnico para juniors, QA y devs en España.",
    },
    { property: "og:image", content: "https://arkeonixlabs.com/arkeonix-logo.png" },
    { property: "og:url", content: "https://arkeonixlabs.com/" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Arkeonix Labs — Herramientas, rutas y proyectos para crecer en tech",
    },
    {
      name: "twitter:description",
      content:
        "Herramientas gratuitas, rutas de aprendizaje y contenido técnico para juniors, QA y devs en España.",
    },
    { name: "twitter:image", content: "https://arkeonixlabs.com/arkeonix-logo.png" },
    { property: "og:site_name", content: "Arkeonix Labs" },
    { property: "og:type", content: "website" },
  ];
};

const POST_LIMIT = 4;
const LAB_LIMIT = 3;

interface EcosystemCard {
  key: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  titleKey: string;
  descKey: string;
  link: string;
  comingSoon?: boolean;
}

export default function HomePage() {
  const { locale, t } = useLocale();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [labPosts, setLabPosts] = useState<LabPostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const languageFilter = locale.toUpperCase();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const [postsRes, labRes] = await Promise.all([
        supabase
          .from("posts")
          .select("*")
          .eq("language", languageFilter)
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(POST_LIMIT),
        supabase
          .from("lab_posts")
          .select("*")
          .eq("language", languageFilter)
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(LAB_LIMIT),
      ]);

      if (postsRes.error) throw postsRes.error;
      if (labRes.error) throw labRes.error;

      setPosts(postsRes.data || []);
      setLabPosts(labRes.data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Error fetching homepage data:", err);
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  }, [languageFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  const ecosystemCards: EcosystemCard[] = [
    {
      key: "tools",
      icon: <FiTool className="w-6 h-6" />,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      titleKey: "home_ecosystem_tools_title",
      descKey: "home_ecosystem_tools_desc",
      link: "/herramientas",
      comingSoon: true,
    },
    {
      key: "routes",
      icon: <FiMap className="w-6 h-6" />,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      titleKey: "home_ecosystem_routes_title",
      descKey: "home_ecosystem_routes_desc",
      link: "/rutas",
      comingSoon: true,
    },
    {
      key: "lab",
      icon: <FiTerminal className="w-6 h-6" />,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      titleKey: "home_ecosystem_lab_title",
      descKey: "home_ecosystem_lab_desc",
      link: "/lab",
    },
    {
      key: "blog",
      icon: <FiFileText className="w-6 h-6" />,
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-500",
      titleKey: "home_ecosystem_blog_title",
      descKey: "home_ecosystem_blog_desc",
      link: "/blog",
    },
  ];

  if (loading && posts.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="space-y-12">
          <div className="space-y-4 text-center">
            <div className="w-48 h-8 bg-muted/40 rounded-full mx-auto animate-pulse" />
            <div className="w-full max-w-2xl h-24 bg-muted/20 rounded-3xl mx-auto animate-pulse" />
          </div>
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
            onClick={() => fetchData()}
            className="h-10 px-6 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            {locale === "es" ? "Reintentar" : "Retry"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-16 pb-24 overflow-hidden">
      <Helmet>
        <title>
          {t("home_meta_title")}
        </title>
        <meta name="description" content={t("home_meta_description")} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t("home_meta_title")} />
        <meta property="og:description" content={t("home_meta_description")} />
        <meta property="og:url" content="https://arkeonixlabs.com/" />
        <meta property="og:site_name" content="Arkeonix Labs" />
        <meta
          property="og:image"
          content="https://arkeonixlabs.com/arkeonix-logo.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("home_meta_title")} />
        <meta name="twitter:description" content={t("home_meta_description")} />
        <meta
          name="twitter:image"
          content="https://arkeonixlabs.com/arkeonix-logo.png"
        />
      </Helmet>

      {/* Atmospheric Background */}
      <div className="grain-overlay" />
      <div className="dot-grid" />
      <div className="glow-spot top-[-10%] left-[-10%] scale-150 opacity-15" />
      <div className="glow-spot bottom-[-20%] right-[-10%] opacity-10 scale-125" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

        {/* ── HERO ── */}
        <header className="pt-24 text-center space-y-8 animate-reveal relative">
          <div
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface border border-border/50 text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground animate-float"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <FiZap className="text-primary animate-pulse" />
            {t("home_hero_badge")}
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.05] tracking-tight">
              {t("home_hero_title_part1")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {t("home_hero_title_highlight")}
              </span>{" "}
              {t("home_hero_title_part2")}
            </h1>

            <p className="max-w-2xl mx-auto text-base md:text-lg text-muted-foreground font-body leading-relaxed">
              {t("home_hero_subtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {t("home_hero_cta_primary")}
              <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/lab"
              className="inline-flex items-center gap-2 px-8 py-4 bg-surface text-foreground border border-border/60 font-bold rounded-xl hover:border-primary/40 hover:bg-surface-hover transition-all uppercase tracking-widest text-[11px]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {t("home_hero_cta_secondary")}
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* ── ECOSYSTEM ── */}
        <section className="space-y-24">
          <ScrollReveal variant="fade-up" duration={800}>
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight">
                {t("home_ecosystem_title")}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t("home_ecosystem_subtitle")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {ecosystemCards.map((card, idx) => {
              const CardContent = (
                <div
                  className={`group relative h-full tech-card card-accent-border rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                    card.comingSoon
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:border-primary/30 cursor-pointer"
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <div
                      className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl ${card.iconBg}`}
                    >
                      <span className={card.iconColor}>{card.icon}</span>
                    </div>
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold font-display">
                          {t(card.titleKey)}
                        </h3>
                        {card.comingSoon && (
                          <span
                            className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {t("home_coming_soon")}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t(card.descKey)}
                      </p>
                      {!card.comingSoon && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-[0.15em] pt-1 group-hover:gap-2.5 transition-all">
                          <span style={{ fontFamily: "var(--font-mono)" }}>
                            {t("explore")}
                          </span>
                          <FiArrowRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );

              return (
                <ScrollReveal
                  key={card.key}
                  variant={idx % 2 === 0 ? "fade-left" : "fade-right"}
                  delay={idx * 100}
                  duration={800}
                >
                  {card.comingSoon ? (
                    CardContent
                  ) : (
                    <Link to={card.link} className="block h-full">
                      {CardContent}
                    </Link>
                  )}
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* ── FEATURED CONTENT ── */}
        {featuredPost && (
          <section className="space-y-24">
            <ScrollReveal variant="fade-up" duration={800}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
                    <FiFileText className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight">
                    {t("home_content_title")}
                  </h2>
                </div>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-[0.15em] hover:opacity-70 transition-colors group"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {t("blog_view_all")}
                  <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="flip-up" duration={900}>
              <FeaturedPostCard post={featuredPost} />
            </ScrollReveal>

            {otherPosts.length > 0 && (
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
            )}
          </section>
        )}

        {/* ── LAB PREVIEW ── */}
        {labPosts.length > 0 && (
          <section className="space-y-24">
            <ScrollReveal variant="fade-up" duration={800}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <FiTerminal className="w-4 h-4 text-amber-500" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight">
                    {t("lab_latest")}
                  </h2>
                </div>
                <Link
                  to="/lab"
                  className="inline-flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-[0.15em] hover:text-amber-400 transition-colors group"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {t("lab_view_all")}
                  <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {labPosts.map((post, idx) => {
                const variants = [
                  "slide-rotate-left",
                  "fade-up",
                  "slide-rotate-right",
                ] as const;
                return (
                  <ScrollReveal
                    key={post.id}
                    variant={variants[idx % 3]}
                    delay={idx * 150}
                    duration={800}
                  >
                    <LabPostCard post={post} />
                  </ScrollReveal>
                );
              })}
            </div>
          </section>
        )}

        {/* ── NEXT STEP CARDS (Guía + SaaS) ── */}
        <section className="space-y-10">
          <ScrollReveal variant="fade-up" duration={800}>
            <div className="text-center space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight">
                {t("home_next_step_title")}
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto text-sm">
                {t("home_next_step_subtitle")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Guía Junior */}
            <ScrollReveal variant="fade-left" duration={800}>
              <Link
                to="/recursos/guia-junior"
                className="group block h-full"
              >
                <div className="tech-card card-accent-border rounded-2xl p-8 h-full hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex flex-col h-full space-y-5">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-500"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {t("blog_guia_badge")}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold font-display tracking-tight group-hover:text-emerald-500 transition-colors">
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
              <Link
                to="/recursos/saas-boilerplate"
                className="group block h-full"
              >
                <div className="tech-card card-accent-border rounded-2xl p-8 h-full hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex flex-col h-full space-y-5">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-primary"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        {t("saas_banner_badge")}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold font-display tracking-tight group-hover:text-primary transition-colors">
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
          <div className="tech-card card-accent-border p-10 md:p-16 rounded-2xl text-center space-y-8">
            <div className="dot-grid" />
            <div className="relative max-w-2xl mx-auto space-y-5">
              <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight tracking-tight">
                {t("home_newsletter_title")}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg font-body">
                {t("home_newsletter_desc")}
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

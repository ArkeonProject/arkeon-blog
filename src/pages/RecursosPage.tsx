import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  FiFilter, FiChevronDown, FiSearch, FiExternalLink,
  FiMonitor, FiCloud, FiServer, FiDatabase, FiBookOpen, FiBell, FiZap,
} from "react-icons/fi";
import PostList from "@/components/posts/PostList";
import Pagination from "@/components/ui/Pagination";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PostSkeleton from "@/components/ui/PostSkeleton";
import Card from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/hooks/useLocale";
import type { PostListItem } from "@/types/post";
import type { ElementType } from "react";

// ---------------------------------------------------------------------------
// Affiliate tools data
// TODO: replace each `url` with your real affiliate link when approved
// ---------------------------------------------------------------------------

type AffiliateCategory = "all" | "testing" | "hosting" | "databases" | "devtools" | "learning";

interface AffiliateTool {
  name: string;
  category: Exclude<AffiliateCategory, "all">;
  descriptionEs: string;
  descriptionEn: string;
  url: string;
  icon: ElementType;
  accent: string;
}

const AFFILIATE_TOOLS: AffiliateTool[] = [
  {
    name: "BrowserStack",
    category: "testing",
    descriptionEs: "Prueba tu web en 3.000+ navegadores reales y dispositivos móviles sin mantener infraestructura propia. Imprescindible para QA automation.",
    descriptionEn: "Test your web app on 3,000+ real browsers and mobile devices without maintaining your own infra. Essential for QA automation.",
    url: "#", // TODO: https://www.browserstack.com/affiliates
    icon: FiMonitor,
    accent: "#F56A00",
  },
  {
    name: "DigitalOcean",
    category: "hosting",
    descriptionEs: "Hosting en cloud sencillo y asequible para developers. $25 de crédito gratuito para quien se registre con tu link.",
    descriptionEn: "Simple and affordable cloud hosting for developers. $25 free credit for anyone who signs up through your link.",
    url: "#", // TODO: https://www.digitalocean.com/referral
    icon: FiCloud,
    accent: "#0080FF",
  },
  {
    name: "Railway",
    category: "hosting",
    descriptionEs: "Despliega backends, bases de datos y workers en segundos. Precio por uso, sin configuración de servidores.",
    descriptionEn: "Deploy backends, databases and workers in seconds. Usage-based pricing, no server config.",
    url: "#", // TODO: https://railway.app referral link from your dashboard
    icon: FiServer,
    accent: "#7B2FBE",
  },
  {
    name: "Vercel",
    category: "hosting",
    descriptionEs: "La plataforma de referencia para desplegar apps Next.js con previews automáticas, CDN global y zero-config.",
    descriptionEn: "The go-to platform for deploying Next.js apps with automatic previews, global CDN and zero-config.",
    url: "#", // TODO: https://vercel.com/referral
    icon: FiZap,
    accent: "#FFFFFF",
  },
  {
    name: "Supabase",
    category: "databases",
    descriptionEs: "PostgreSQL como servicio con auth, storage y realtime incluidos. La alternativa open source a Firebase.",
    descriptionEn: "PostgreSQL as a service with auth, storage and realtime built in. The open source alternative to Firebase.",
    url: "#", // TODO: https://supabase.com/partners
    icon: FiDatabase,
    accent: "#3ECF8E",
  },
  {
    name: "Sentry",
    category: "devtools",
    descriptionEs: "Monitorización de errores en tiempo real con trazas completas. Detecta bugs en producción antes de que los reporten tus usuarios.",
    descriptionEn: "Real-time error monitoring with full stack traces. Catch production bugs before your users report them.",
    url: "#", // TODO: https://sentry.io/partners
    icon: FiBell,
    accent: "#F55150",
  },
  {
    name: "Udemy",
    category: "learning",
    descriptionEs: "Cursos de Playwright, ISTQB, Next.js y QA automation con descuentos frecuentes. Ideal para juniors que quieren aprender con proyectos reales.",
    descriptionEn: "Playwright, ISTQB, Next.js and QA automation courses with frequent discounts. Great for juniors learning with real projects.",
    url: "#", // TODO: https://www.udemy.com/affiliate (via Impact.com)
    icon: FiBookOpen,
    accent: "#A435F0",
  },
];

const AFFILIATE_CATEGORY_LABELS: Record<AffiliateCategory, { es: string; en: string }> = {
  all:       { es: "Todas",                  en: "All" },
  testing:   { es: "Testing y QA",           en: "Testing & QA" },
  hosting:   { es: "Infraestructura",        en: "Infrastructure" },
  databases: { es: "Bases de datos",         en: "Databases" },
  devtools:  { es: "Herramientas dev",       en: "Dev tools" },
  learning:  { es: "Aprendizaje",            en: "Learning" },
};

const AFFILIATE_CATEGORIES: AffiliateCategory[] = ["all", "testing", "hosting", "databases", "devtools", "learning"];

// ---------------------------------------------------------------------------

const RECURSOS_PAGE_SIZE = 6;

const RECURSOS_CATEGORY_VALUES = [
  "product", "Product", "products", "Products",
  "producto", "Producto", "productos", "Productos",
];

export default function RecursosPage() {
  const { locale, t } = useLocale();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [resourceCategories, setResourceCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [affiliateCategory, setAffiliateCategory] = useState<AffiliateCategory>("all");
  const filterRef = useRef<HTMLDivElement>(null);

  const languageFilter = locale.toUpperCase();

  const fetchResourceCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("product_category")
      .eq("language", languageFilter)
      .eq("status", "published")
      .in("category", RECURSOS_CATEGORY_VALUES)
      .not("product_category", "is", null);

    if (error) { console.error(error); return; }

    const categories = Array.from(
      new Set(
        (data ?? [])
          .map((item) => item.product_category)
          .filter((value): value is string => Boolean(value))
      )
    ).sort((a, b) => a.localeCompare(b));
    setResourceCategories(categories);
  }, [languageFilter]);

  const fetchResourcePosts = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_image, published_at, language, category, product_category")
      .eq("language", languageFilter)
      .eq("status", "published")
      .in("category", RECURSOS_CATEGORY_VALUES)
      .order("published_at", { ascending: false });

    if (selectedCategory !== "all") {
      query = query.eq("product_category", selectedCategory);
    }

    const { data, error } = await query;
    if (error) {
      console.error(error);
      setErrorMsg(t("recursos_error"));
      setPosts([]);
    } else {
      setErrorMsg(null);
      setPosts((data ?? []) as PostListItem[]);
    }
    setLoading(false);
  }, [languageFilter, selectedCategory, t]);

  useEffect(() => {
    setSelectedCategory("all");
    void fetchResourceCategories();
  }, [fetchResourceCategories]);

  useEffect(() => { void fetchResourcePosts(); }, [fetchResourcePosts]);

  useEffect(() => {
    if (!isFilterOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isFilterOpen]);

  const filteredPosts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return posts;
    return posts.filter((post) => {
      const haystack = `${post.title} ${post.excerpt ?? ""}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [posts, searchTerm]);

  const totalPages = Math.ceil(filteredPosts.length / RECURSOS_PAGE_SIZE);
  const displayedPosts = useMemo(() => {
    const start = (currentPage - 1) * RECURSOS_PAGE_SIZE;
    return filteredPosts.slice(start, start + RECURSOS_PAGE_SIZE);
  }, [filteredPosts, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsFilterOpen(false);
  };

  const filteredAffiliateTools = useMemo(() =>
    affiliateCategory === "all"
      ? AFFILIATE_TOOLS
      : AFFILIATE_TOOLS.filter((tool) => tool.category === affiliateCategory),
    [affiliateCategory]
  );

  const isEs = locale === "es";

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 md:py-16 space-y-12">
        <div className="text-center space-y-4">
          <div className="w-64 h-12 bg-muted/40 rounded-2xl mx-auto animate-pulse" />
          <div className="w-full max-w-2xl h-6 bg-muted/20 rounded-lg mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <PostSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return <p className="text-center mt-20 text-red-500 tracking-wide font-semibold text-lg">{errorMsg}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
      <Helmet>
        <title>{t("recursos_title")} | Arkeonix Labs</title>
        <meta name="description" content={t("recursos_meta_description")} />
        <link rel="canonical" href={`https://www.arkeonixlabs.com/${locale}/recursos`} />
        <meta property="og:title" content={`${t("recursos_title")} | Arkeonix Labs`} />
        <meta property="og:description" content={t("recursos_meta_description")} />
      </Helmet>

      {/* Header */}
      <ScrollReveal variant="blur" duration={800}>
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t("recursos_title")}
          </h1>
          <p className="text-gray-700 dark:text-white/80 text-lg md:text-xl max-w-3xl mx-auto">
            {t("recursos_description")}
          </p>
        </section>
      </ScrollReveal>

      {/* ------------------------------------------------------------------ */}
      {/* Affiliate tools section */}
      {/* ------------------------------------------------------------------ */}
      <ScrollReveal variant="fade-up" duration={700}>
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEs ? "Herramientas recomendadas" : "Recommended tools"}
            </h2>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap mb-8">
            {AFFILIATE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setAffiliateCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  affiliateCategory === cat
                    ? "bg-[#007EAD]/20 border-[#00aaff]/50 text-[#00aaff]"
                    : "border-gray-300 dark:border-white/10 text-gray-600 dark:text-white/60 hover:border-[#00aaff]/40 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {isEs ? AFFILIATE_CATEGORY_LABELS[cat].es : AFFILIATE_CATEGORY_LABELS[cat].en}
              </button>
            ))}
          </div>

          {/* Tools grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAffiliateTools.map((tool) => {
              const Icon = tool.icon;
              const description = isEs ? tool.descriptionEs : tool.descriptionEn;
              const categoryLabel = isEs
                ? AFFILIATE_CATEGORY_LABELS[tool.category].es
                : AFFILIATE_CATEGORY_LABELS[tool.category].en;

              return (
                <Card key={tool.name} className="p-5 flex flex-col gap-4 hover:border-[#00aaff]/40 transition-all duration-300 group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${tool.accent}1A`, border: `1px solid ${tool.accent}40` }}
                      >
                        <Icon className="w-5 h-5 shrink-0" style={{ color: tool.accent }} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white leading-tight">{tool.name}</p>
                        <span className="text-xs text-gray-500 dark:text-white/40">{categoryLabel}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed flex-1">
                    {description}
                  </p>

                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#00aaff] hover:text-[#007EAD] transition-colors duration-200 group-hover:gap-3"
                  >
                    {isEs ? "Ver herramienta" : "Visit tool"}
                    <FiExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </Card>
              );
            })}
          </div>

          {/* Affiliate disclosure */}
          <p className="mt-6 text-xs text-gray-400 dark:text-white/30 text-center">
            {isEs
              ? "Algunos enlaces son de afiliado. Si compras a través de ellos, recibo una pequeña comisión sin coste adicional para ti."
              : "Some links are affiliate links. If you purchase through them, I receive a small commission at no extra cost to you."}
          </p>
        </section>
      </ScrollReveal>

      {/* ------------------------------------------------------------------ */}
      {/* Posts section (existing) */}
      {/* ------------------------------------------------------------------ */}
      <ScrollReveal variant="fade-up" duration={700}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEs ? "Análisis y revisiones" : "Reviews & analysis"}
          </h2>
        </div>
      </ScrollReveal>

      <ScrollReveal variant="fade-left" duration={700}>
        <section className="mb-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative inline-block w-full md:w-auto md:min-w-60" ref={filterRef}>
              <button
                type="button"
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className="w-full flex items-center justify-between gap-3 px-5 py-3 rounded-2xl border border-gray-300 dark:border-[#00aaff]/40 bg-gray-100 dark:bg-[#0f1f38]/60 text-gray-900 dark:text-white/90 hover:text-gray-900 dark:hover:text-white hover:border-[#00aaff] transition-all duration-300 shadow-lg dark:shadow-[#007EAD]/20"
              >
                <span className="flex items-center gap-3">
                  <FiFilter className="w-4 h-4 text-[#00aaff]" />
                  {selectedCategory === "all" ? t("recursos_filter_all") : selectedCategory}
                </span>
                <FiChevronDown
                  className={`w-4 h-4 text-[#00aaff] transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isFilterOpen && (
                <div className="absolute z-20 mt-3 w-full rounded-2xl border border-gray-300 dark:border-[#00aaff]/30 bg-white dark:bg-[#0a1628]/95 backdrop-blur-xl shadow-2xl dark:shadow-[#007EAD]/30 overflow-hidden">
                  <div className="max-h-64 overflow-y-auto p-2">
                    <button
                      type="button"
                      onClick={() => handleCategorySelect("all")}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium capitalize transition-all duration-200 ${
                        selectedCategory === "all"
                          ? "bg-[#007EAD]/30 text-gray-900 dark:text-white border border-[#00aaff]/30"
                          : "text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                      }`}
                    >
                      {t("recursos_filter_all")}
                    </button>
                    {resourceCategories.map((category) => (
                      <button
                        type="button"
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        className={`w-full text-left px-4 py-3 rounded-xl font-medium capitalize transition-all duration-200 ${
                          selectedCategory === category
                            ? "bg-[#007EAD]/30 text-gray-900 dark:text-white border border-[#00aaff]/30"
                            : "text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative w-full md:max-w-sm">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t("recursos_search_placeholder")}
                className="w-full bg-gray-100 dark:bg-[#0f1f38]/60 border border-gray-300 dark:border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#00aaff]/40 focus:border-transparent transition-all duration-300 shadow-lg dark:shadow-[#007EAD]/20"
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {displayedPosts.length > 0 ? (
        <ScrollReveal variant="fade-up" duration={800}>
          <PostList posts={displayedPosts} />
        </ScrollReveal>
      ) : (
        <p className="text-center text-gray-600 dark:text-white/70 text-lg">{t("recursos_empty")}</p>
      )}

      {totalPages > 1 && (
        <ScrollReveal variant="scale" duration={600}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="mt-12"
          />
        </ScrollReveal>
      )}
    </div>
  );
}

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { FiFilter, FiChevronDown, FiSearch } from "react-icons/fi";
import PostList from "../components/posts/PostList";
import { supabase } from "../lib/supabase";
import { useLocale } from "../hooks/useLocale";
import type { PostListItem } from "../types/post";

const PRODUCT_CATEGORY_VALUES = [
  "product",
  "Product",
  "products",
  "Products",
  "producto",
  "Producto",
  "productos",
  "Productos",
];

export default function ProductsPage() {
  const { locale, t } = useLocale();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [productCategories, setProductCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const languageFilter = locale.toUpperCase();

  const fetchProductCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("product_category")
      .eq("language", languageFilter)
      .in("category", PRODUCT_CATEGORY_VALUES)
      .not("product_category", "is", null);

    if (error) {
      console.error(error);
      return;
    }

    const categories = Array.from(
      new Set(
        (data ?? [])
          .map((item) => item.product_category)
          .filter((value): value is string => Boolean(value))
      )
    ).sort((a, b) => a.localeCompare(b));
    setProductCategories(categories);
  }, [languageFilter]);

  const fetchProductPosts = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_image, published_at, language, category, product_category")
      .eq("language", languageFilter)
      .in("category", PRODUCT_CATEGORY_VALUES)
      .order("published_at", { ascending: false });

    if (selectedCategory !== "all") {
      query = query.eq("product_category", selectedCategory);
    }

    const { data, error } = await query;
    if (error) {
      console.error(error);
      setErrorMsg(t("products_error"));
      setPosts([]);
    } else {
      setErrorMsg(null);
      setPosts((data ?? []) as PostListItem[]);
    }
    setLoading(false);
  }, [languageFilter, selectedCategory, t]);

  useEffect(() => {
    setSelectedCategory("all");
    void fetchProductCategories();
  }, [fetchProductCategories]);

  useEffect(() => {
    void fetchProductPosts();
  }, [fetchProductPosts]);

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

  const displayedPosts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return posts;
    return posts.filter((post) => {
      const haystack = `${post.title} ${post.excerpt ?? ""}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [posts, searchTerm]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsFilterOpen(false);
  };

  if (loading) {
    return <p className="text-center mt-20 text-gray-600 dark:text-white/70 tracking-wide font-semibold text-lg">{t("category_loading")}</p>;
  }

  if (errorMsg) {
    return <p className="text-center mt-20 text-red-500 tracking-wide font-semibold text-lg">{errorMsg}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
      <Helmet>
        <title>{t("products_title")} | Arkeon</title>
        <meta name="description" content={t("products_meta_description")} />
        <meta property="og:title" content={`${t("products_title")} | Arkeon`} />
        <meta property="og:description" content={t("products_meta_description")} />
      </Helmet>

      <section className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">{t("products_title")}</h1>
        <p className="text-gray-700 dark:text-white/80 text-lg md:text-xl max-w-3xl mx-auto">{t("products_description")}</p>
      </section>

      <section className="mb-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative inline-block w-full md:w-auto md:min-w-[240px]" ref={filterRef}>
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="w-full flex items-center justify-between gap-3 px-5 py-3 rounded-2xl border border-gray-300 dark:border-[#00aaff]/40 bg-gray-100 dark:bg-[#0f1f38]/60 text-gray-900 dark:text-white/90 hover:text-gray-900 dark:hover:text-white hover:border-[#00aaff] transition-all duration-300 shadow-lg dark:shadow-[#007EAD]/20"
            >
              <span className="flex items-center gap-3">
                <FiFilter className="w-4 h-4 text-[#00aaff]" />
                {selectedCategory === "all" ? t("products_filter_all") : selectedCategory}
              </span>
              <FiChevronDown
                className={`w-4 h-4 text-[#00aaff] transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {isFilterOpen && (
              <div className="absolute z-20 mt-3 w-full rounded-2xl border border-gray-300 dark:border-[#00aaff]/30 bg-white dark:bg-[#0a1628]/95 backdrop-blur-xl shadow-2xl dark:shadow-[#007EAD]/30 overflow-hidden">
                <div className="max-h-64 overflow-y-auto p-2">
                  <button
                    type="button"
                    onClick={() => handleCategorySelect("all")}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium capitalize transition-all duration-200 ${selectedCategory === "all"
                        ? "bg-[#007EAD]/30 text-gray-900 dark:text-white border border-[#00aaff]/30"
                        : "text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                      }`}
                  >
                    {t("products_filter_all")}
                  </button>
                  {productCategories.map((category) => (
                    <button
                      type="button"
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium capitalize transition-all duration-200 ${selectedCategory === category
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
              placeholder={t("products_search_placeholder")}
              className="w-full bg-gray-100 dark:bg-[#0f1f38]/60 border border-gray-300 dark:border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#00aaff]/40 focus:border-transparent transition-all duration-300 shadow-lg dark:shadow-[#007EAD]/20"
            />
          </div>
        </div>
      </section>

      {displayedPosts.length > 0 ? (
        <PostList posts={displayedPosts} />
      ) : (
        <p className="text-center text-gray-600 dark:text-white/70 text-lg">{t("products_empty")}</p>
      )}
    </div>
  );
}

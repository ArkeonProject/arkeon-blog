import { useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/hooks/useLocale";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import ReadingProgressBar from "@/components/ui/ReadingProgressBar";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ShareButtons from "@/components/ui/ShareButtons";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import type { PostDetail } from "@/types/post";

marked.setOptions({ async: false });

export default function PostPage() {
  const { slug } = useParams();
  const { locale, t } = useLocale();
  const languageFilter = locale.toUpperCase();

  const queryPost = useCallback(async () => {
    if (!slug) return { data: null, error: null };

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("language", languageFilter)
      .eq("status", "published")
      .maybeSingle();

    if (error) console.error(error);
    return { data: (data as PostDetail | null) ?? null, error };
  }, [languageFilter, slug]);

  const { data: post, loading, error } = useSupabaseQuery<PostDetail | null>(queryPost);
  const errorMsg = error ? t("post_error") : null;

  const affiliateUrl = useMemo(() => {
    if (!post?.content) return null;
    const match = post.content.match(/https:\/\/www\.amazon\.es\/[^\s)]+/);
    return match ? match[0] : null;
  }, [post?.content]);

  // Smart MD/HTML detection: HTML content starts with a tag or contains block-level HTML
  const isHtmlContent = useMemo(
    () => /^\s*<[a-zA-Z]/.test(post?.content ?? ""),
    [post?.content]
  );

  const rawHtml = useMemo(() => {
    if (!post?.content) return "";
    if (isHtmlContent) return post.content;
    return marked.parse(post.content) as string;
  }, [post?.content, isHtmlContent]);

  const cleanedHtml = useMemo(() => {
    if (!rawHtml) return "";
    return rawHtml.replace(/https:\/\/www\.amazon\.es\/[^\s<>"]+/g, "");
  }, [rawHtml]);

  const safeHtml = useMemo(
    () => DOMPurify.sanitize(cleanedHtml),
    [cleanedHtml]
  );

  const { beforeBuy, afterBuy } = useMemo(() => {
    const headerRegex = /<h3[^>]*>[^<]*(Enlace de compra|Purchase link)[^<]*<\/h3>/i;
    const match = safeHtml.match(headerRegex);

    if (!match) {
      return { beforeBuy: safeHtml, afterBuy: "" };
    }

    const headerIndex = safeHtml.indexOf(match[0]);
    const headerEnd = headerIndex + match[0].length;

    return {
      beforeBuy: safeHtml.slice(0, headerEnd),
      afterBuy: safeHtml.slice(headerEnd)
    };
  }, [safeHtml]);



  if (!slug) return <p className="text-center mt-10 text-gray-600 dark:text-white/70">{t("post_not_found")}</p>;
  if (loading) return <p className="text-center mt-10 text-gray-600 dark:text-white/70">{t("post_loading")}</p>;
  if (errorMsg) return <p className="text-center mt-10 text-red-500 dark:text-red-400">{errorMsg}</p>;
  if (!post) return <p className="text-center mt-10 text-gray-600 dark:text-white/70">{t("post_not_found")}</p>;

  const description =
    post.content.length > 160 ? post.content.slice(0, 157) + "…" : post.content;

  return (
    <>
      <ReadingProgressBar />
      <ScrollReveal variant="fade-up" duration={800}>
      <div className="max-w-4xl mx-auto p-8 md:p-12 bg-gradient-to-br from-white to-gray-50 dark:from-[#0b1226] dark:via-[#071622] dark:to-[#0a172b] rounded-3xl shadow-lg dark:shadow-[#007EAD]/20 transition-colors duration-300">
        <Breadcrumbs />

        <Helmet>
          <title>{post.title} | Arkeonix Labs</title>
          <meta name="description" content={description} />
          <link rel="canonical" href={`https://www.arkeonixlabs.com/post/${slug}`} />
          <meta property="og:title" content={`${post.title} | Arkeonix Labs`} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content="article" />
          <meta
            property="og:image"
            content={
              post.cover_image
                ? post.cover_image
                : `/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category ?? "")}&author=${encodeURIComponent(post.author)}`
            }
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${post.title} | Arkeonix Labs`} />
          <meta name="twitter:description" content={description} />
          <meta
            name="twitter:image"
            content={
              post.cover_image
                ? post.cover_image
                : `/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category ?? "")}&author=${encodeURIComponent(post.author)}`
            }
          />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": post.title,
              "description": description,
              "author": {
                "@type": "Person",
                "name": post.author,
              },
              "datePublished": post.published_at,
              "dateModified": post.published_at,
              "publisher": {
                "@type": "Organization",
                "name": "Arkeonix Labs",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.arkeonixlabs.com/arkeonix-logo.png",
                },
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://www.arkeonixlabs.com/post/${slug}`,
              },
              ...(post.cover_image && { image: post.cover_image }),
            })}
          </script>
        </Helmet>

        <Link
          to="/blog"
          className="text-[#00aaff] hover:text-[#00bbee] transition-colors duration-300 inline-flex items-center gap-2 mb-6"
        >
          <span>←</span> {t("post_back_to_blog")}
        </Link>

        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={post.title}
            className="rounded-xl my-6 w-full object-cover aspect-auto border border-gray-300 dark:border-[#007EAD]/20 shadow-lg dark:shadow-[#007EAD]/10"
            loading="lazy"
          />
        )}

        <h1 className="text-4xl font-bold mb-2 text-[#007EAD] dark:text-[#00aaff]">{post.title}</h1>

        <p className="text-sm text-gray-600 dark:text-white/60 mb-6">
          {new Date(post.published_at).toLocaleDateString(
            locale === "es" ? "es-ES" : "en-US",
            { year: "numeric", month: "long", day: "numeric" }
          )}{" "}
          — <span className="text-[#00aaff]">{post.author}</span>
        </p>

        <div className="border-t border-gray-300 dark:border-[#007EAD]/20 mt-8 mb-8" />

        <div className="mb-8">
          <ShareButtons
            url={window.location.href}
            title={post.title}
          />
        </div>

        <div className="border-t border-gray-300 dark:border-[#007EAD]/20 mb-8" />

        <article
          className="
          prose prose-lg max-w-none
          dark:prose-invert
          prose-headings:text-[#007EAD] dark:prose-headings:text-[#00aaff]
          prose-p:text-gray-700 dark:prose-p:text-white/80
          prose-a:text-[#007EAD] dark:prose-a:text-[#00aaff] hover:prose-a:text-[#00bbee]
          prose-strong:text-gray-900 dark:prose-strong:text-white
          prose-code:text-[#007EAD]
          prose-pre:bg-gray-100 dark:prose-pre:bg-[#0f1f38]/50 prose-pre:border prose-pre:border-gray-300 dark:prose-pre:border-[#007EAD]/20
          prose-img:rounded-xl prose-img:border prose-img:border-gray-300 dark:prose-img:border-[#007EAD]/20 prose-img:shadow-lg prose-img:my-6
          leading-relaxed
        "
        >
          <div dangerouslySetInnerHTML={{ __html: beforeBuy }} />

          {affiliateUrl && (
            <div className="my-10 flex justify-center">
              <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center justify-center
                  px-8 py-4 
                  bg-gradient-to-r from-[#007EAD] to-[#00aaff]
                  text-white font-bold text-lg uppercase tracking-wider
                  rounded-2xl shadow-xl shadow-[#007EAD]/30
                  hover:scale-105 hover:shadow-[#00aaff]/40
                  transition-all duration-300
                  no-underline !text-white
                "
              >
                {t("buy_in_amazon")}
              </a>
            </div>
          )}

          <div dangerouslySetInnerHTML={{ __html: afterBuy }} />
        </article>
      </div>
      </ScrollReveal>
    </>
  );
}
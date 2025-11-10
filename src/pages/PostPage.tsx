import { useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { supabase } from "../lib/supabase";
import { useLocale } from "../hooks/useLocale";
import { useSupabaseQuery } from "../hooks/useSupabaseQuery";
import type { PostDetail } from "../types/post";

marked.setOptions({ async: false });

export default function PostPage() {
  const { slug } = useParams();
  const { locale, t } = useLocale();
  const languageFilter = locale.toUpperCase();

  const queryPost = useCallback(async () => {
    if (!slug) {
      return { data: null, error: null };
    }
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("language", languageFilter)
      .maybeSingle();

    if (error) {
      console.error(error);
    }
    return { data: (data as PostDetail | null) ?? null, error };
  }, [languageFilter, slug]);

  const { data: post, loading, error } = useSupabaseQuery<PostDetail | null>(queryPost);
  const errorMsg = error ? t("post_error") : null;

  const htmlContent = useMemo(() => {
    if (!post?.content) return "";
    const html = marked.parse(post.content) as string;
    return DOMPurify.sanitize(html);
  }, [post?.content]);

  if (!slug) return <p className="text-center mt-10 text-white/70">{t("post_not_found")}</p>;
  if (loading) return <p className="text-center mt-10 text-white/70">{t("post_loading")}</p>;
  if (errorMsg) return <p className="text-center mt-10 text-red-400">{errorMsg}</p>;
  if (!post) return <p className="text-center mt-10 text-white/70">{t("post_not_found")}</p>;

  const description = post.content.length > 160 ? post.content.slice(0, 157) + "…" : post.content;

  return (
    <div className="max-w-4xl mx-auto p-8 md:p-12 bg-linear-to-br from-[#0b1226] via-[#071622] to-[#0a172b] rounded-3xl shadow-lg shadow-[#007EAD]/20">
      <Helmet>
        <title>{post.title} | Arkeon</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${post.title} | Arkeon`} />
        <meta property="og:description" content={description} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
      </Helmet>

      <Link to="/blog" className="text-[#00aaff] hover:text-[#00bbee] transition-colors duration-300 inline-flex items-center gap-2 mb-6">
        <span>←</span> {t("post_back_to_blog")}
      </Link>
      {post.cover_image && (
        <img
          src={post.cover_image}
          alt={post.title}
          className="rounded-xl my-6 w-full object-cover h-64 border border-[#007EAD]/20 shadow-lg shadow-[#007EAD]/10"
          loading="lazy"
        />
      )}
      <h1 className="text-4xl font-bold mb-2 text-[#00aaff]">{post.title}</h1>
      <p className="text-sm text-white/60 mb-6">
        {new Date(post.published_at).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })} — <span className="text-[#00aaff]">{post.author}</span>
      </p>
      <div className="border-t border-[#007EAD]/20 mt-8 mb-8" />
      <article className="prose prose-lg prose-invert max-w-none prose-headings:text-[#00aaff] prose-p:text-white/80 prose-a:text-[#00aaff] hover:prose-a:text-[#00bbee] prose-strong:text-white prose-code:text-[#007EAD] prose-pre:bg-[#0f1f38]/50 prose-pre:border prose-pre:border-[#007EAD]/20 leading-relaxed">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </article>
    </div>
  );
}

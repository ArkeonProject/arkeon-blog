import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "../lib/supabase";
import { useLocale } from "../context/LocaleContext";
import type { PostDetail } from "../types/post";
import { marked } from "marked";
import DOMPurify from "dompurify";

marked.setOptions({ async: false });

export default function PostPage() {
  const { slug } = useParams();
  const { locale, t } = useLocale();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Convertir locale del contexto ("es"/"en") a formato de base de datos ("ES"/"EN")
  const languageFilter = locale.toUpperCase();

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("language", languageFilter)
        .single();

      if (error) {
        console.error(error);
        setErrorMsg(t("post_error"));
      } else {
        setPost(data as PostDetail);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug, locale]);

  const htmlContent = useMemo(() => {
    if (!post?.content) return "";
    const html = marked.parse(post.content) as string;
    return DOMPurify.sanitize(html);
  }, [post?.content]);

  if (loading) return <p className="text-center mt-10 text-white/70">{t("post_loading")}</p>;
  if (errorMsg) return <p className="text-center mt-10 text-red-400">{errorMsg}</p>;
  if (!post) return <p className="text-center mt-10 text-white/70">{t("post_not_found")}</p>;

  const description = post.content.length > 160 ? post.content.slice(0, 157) + "…" : post.content;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Helmet>
        <title>{post.title} | Arkeon</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${post.title} | Arkeon`} />
        <meta property="og:description" content={description} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
      </Helmet>

      <Link to="/blog" className="text-[#007EAD] hover:text-[#007EAD]/80 transition-colors duration-300 inline-flex items-center gap-2 mb-6">
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
      <h1 className="text-4xl font-bold mb-2 text-white">{post.title}</h1>
      <p className="text-sm text-white/60 mb-6">
        {new Date(post.published_at).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })} — <span className="text-[#007EAD]">{post.author}</span>
      </p>
      <article className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/80 prose-a:text-[#007EAD] prose-strong:text-white prose-code:text-[#007EAD] prose-pre:bg-[#0f1f38]/50 prose-pre:border prose-pre:border-[#007EAD]/20">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </article>
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "../lib/supabase";
import type { PostDetail } from "../types/post";
import { marked } from "marked";
import DOMPurify from "dompurify";

marked.setOptions({ async: false });

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error(error);
        setErrorMsg("No se pudo cargar la publicación. Intenta nuevamente más tarde.");
      } else {
        setPost(data as PostDetail);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  const htmlContent = useMemo(() => {
    if (!post?.content) return "";
    const html = marked.parse(post.content) as string;
    return DOMPurify.sanitize(html);
  }, [post?.content]);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (errorMsg) return <p className="text-center mt-10 text-red-600">{errorMsg}</p>;
  if (!post) return <p className="text-center mt-10">Publicación no encontrada</p>;

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

      <Link to="/blog" className="text-blue-600 hover:underline">← Volver al blog</Link>
      {post.cover_image && (
        <img
          src={post.cover_image}
          alt={post.title}
          className="rounded-xl my-6 w-full object-cover h-64"
          loading="lazy"
        />
      )}
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(post.published_at).toLocaleDateString()} — {post.author}
      </p>
      <article className="prose max-w-none text-gray-800">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </article>
    </div>
  );
}
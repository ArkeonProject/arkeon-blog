import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Post {
  title: string;
  content: string;
  cover_image?: string;
  author: string;
  published_at: string;
}

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) console.error(error);
      else setPost(data);
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (!post) return <p className="text-center mt-10">Publicación no encontrada</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/blog" className="text-blue-600 hover:underline">← Volver al blog</Link>
      {post.cover_image && (
        <img
          src={post.cover_image}
          alt={post.title}
          className="rounded-xl my-6 w-full object-cover h-64"
        />
      )}
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(post.published_at).toLocaleDateString()} — {post.author}
      </p>
      <article className="prose max-w-none text-gray-800 whitespace-pre-wrap">
        {post.content}
      </article>
    </div>
  );
}
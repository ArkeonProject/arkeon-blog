import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard.tsx";
import NewsletterForm from "../components/NewsletterForm.tsx";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image?: string;
  published_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, excerpt, cover_image, published_at")
        .order("published_at", { ascending: false });

      if (error) console.error(error);
      else setPosts(data);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando publicaciones...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-10 text-center">📰 Blog de Arkeon</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link key={post.id} to={`/post/${post.slug}`}>
            <PostCard post={post} />
          </Link>
        ))}
      </div>

      <div className="mt-16">
        <NewsletterForm />
      </div>
    </div>
  );
}
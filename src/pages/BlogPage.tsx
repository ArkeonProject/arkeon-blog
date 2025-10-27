import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PostCard from "../components/PostCard.tsx";
import NewsletterForm from "../components/NewsletterForm.tsx";
import type { PostListItem } from "../types/post";

const PAGE_SIZE = 6;

export default function BlogPage() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPage = async (pageIndex: number) => {
    const from = pageIndex * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_image, published_at")
      .order("published_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error(error);
      setErrorMsg("No se pudieron cargar las publicaciones. Intenta nuevamente más tarde.");
      return [] as PostListItem[];
    }
    return (data ?? []) as PostListItem[];
  };

  useEffect(() => {
    (async () => {
      const first = await loadPage(0);
      setPosts(first);
      setHasMore(first.length === PAGE_SIZE);
      setLoading(false);
    })();
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const next = await loadPage(nextPage);
    setPosts((prev) => [...prev, ...next]);
    setPage(nextPage);
    setHasMore(next.length === PAGE_SIZE);
    setLoadingMore(false);
  };

  if (loading) return <p className="text-center mt-10">Cargando publicaciones...</p>;
  if (errorMsg) return <p className="text-center mt-10 text-red-600">{errorMsg}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Helmet>
        <title>Blog | Arkeon</title>
        <meta name="description" content="Artículos y novedades del proyecto Arkeon." />
        <meta property="og:title" content="Blog | Arkeon" />
        <meta property="og:description" content="Artículos y novedades del proyecto Arkeon." />
      </Helmet>

      <h1 className="text-4xl font-bold mb-10 text-center">📰 Blog de Arkeon</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link key={post.id} to={`/post/${post.slug}`}>
            <PostCard post={post} />
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-4 py-2 rounded bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {loadingMore ? "Cargando…" : "Cargar más"}
          </button>
        </div>
      )}

      <div className="mt-16">
        <NewsletterForm />
      </div>
    </div>
  );
}
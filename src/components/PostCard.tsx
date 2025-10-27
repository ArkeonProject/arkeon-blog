interface PostCardProps {
  post: {
    title: string;
    excerpt: string;
    cover_image?: string;
    published_at: string;
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      {post.cover_image && (
        <img
          src={post.cover_image}
          alt={post.title}
          className="rounded-lg mb-4 w-full object-cover h-48"
        />
      )}
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-600 text-sm mb-2">
        {new Date(post.published_at).toLocaleDateString()}
      </p>
      <p className="text-gray-700">{post.excerpt}</p>
    </article>
  );
}
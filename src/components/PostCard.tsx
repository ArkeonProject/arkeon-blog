import { useLocale } from "../context/LocaleContext";
import type { PostListItem } from "../types/post";

interface PostCardProps {
  readonly post: PostListItem;
}

export default function PostCard({ post }: PostCardProps) {
  const { locale } = useLocale();
  const dateFormat = locale === "es" ? "es-ES" : "en-US";

  return (
    <article className="relative border border-gray-800 rounded-xl p-6 shadow-md shadow-[#007EAD]/20 bg-gradient-to-br from-[#0a1628] to-[#0f1f38] backdrop-blur-sm group transition-all duration-400 hover:shadow-[0_0_15px_4px_rgba(0,126,173,0.6)] hover:scale-105 hover:z-10">
      {post.cover_image && (
        <img
          src={post.cover_image}
          alt={post.title}
          className="rounded-lg mb-5 w-full object-cover h-52 group-hover:scale-105 transition-transform duration-400"
          loading="lazy"
        />
      )}
      <h2 className="text-2xl font-semibold mb-1 text-white group-hover:text-[#007EAD] transition-colors duration-400">
        {post.title}
      </h2>
      <p className="text-white/40 text-sm mb-4 border-b border-gray-700 pb-4">
        {new Date(post.published_at).toLocaleDateString(dateFormat, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p className="text-white/70">{post.excerpt}</p>
    </article>
  );
}
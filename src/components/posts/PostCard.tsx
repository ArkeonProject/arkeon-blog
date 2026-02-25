import { useLocale } from "../../hooks/useLocale";
import type { PostListItem } from "../../types/post";

interface PostCardProps {
  readonly post: PostListItem;
}

export default function PostCard({ post }: PostCardProps) {
  const { locale } = useLocale();
  const dateFormat = locale === "es" ? "es-ES" : "en-US";

  return (
    <article className="relative group overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827] flex flex-col h-full hover:border-[#007EAD]/50 transition-all duration-300">
      {post.cover_image && (
        <div className="h-48 overflow-hidden relative">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-[#0A0F1C]/80 to-transparent z-10 transition-opacity duration-300" />
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-[#007EAD] dark:group-hover:text-[#00aaff] transition-colors duration-300 line-clamp-2">
          {post.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6">
          {post.excerpt || ""}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">
            {new Date(post.published_at).toLocaleDateString(dateFormat, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="text-sm font-semibold text-[#007EAD] dark:text-[#00aaff] flex items-center gap-1">
            {locale === "es" ? "Leer más" : "Read more"}{" "}
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </span>
        </div>
      </div>
    </article>
  );
}

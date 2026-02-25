import { useLocale } from "../../hooks/useLocale";
import type { PostListItem } from "../../types/post";
import Card from "../ui/Card";

interface PostCardProps {
  readonly post: PostListItem;
}

export default function PostCard({ post }: PostCardProps) {
  const { locale } = useLocale();
  const dateFormat = locale === "es" ? "es-ES" : "en-US";

  return (
    <Card className="relative p-0 group transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,126,173,0.4)] hover:scale-[1.02] hover:z-10 flex flex-col h-full overflow-hidden">
      {post.cover_image && (
        <div className="relative overflow-hidden">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      )}
      <div className="flex flex-col flex-grow p-6">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-[#007EAD] dark:group-hover:text-[#00aaff] transition-colors duration-300 line-clamp-2">
          {post.title}
        </h2>
        <p className="text-gray-400 dark:text-white/35 text-xs font-medium mb-3 uppercase tracking-wider">
          {new Date(post.published_at).toLocaleDateString(dateFormat, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
        <p className="text-gray-600 dark:text-white/60 text-sm leading-relaxed line-clamp-3 flex-grow">
          {post.excerpt || ""}
        </p>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
          <span className="text-[#007EAD] dark:text-[#00aaff] text-sm font-semibold group-hover:tracking-wider transition-all duration-300">
            {locale === "es" ? "Leer más →" : "Read more →"}
          </span>
        </div>
      </div>
    </Card>
  );
}

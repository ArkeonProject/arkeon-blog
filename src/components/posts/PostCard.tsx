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
    <Card className="relative p-6 group transition-all duration-300 hover:shadow-[0_0_18px_rgba(0,126,173,0.5)] hover:scale-[1.02] hover:z-10 flex flex-col h-full">
      {post.cover_image && (
        <img
          src={post.cover_image}
          alt={post.title}
          className="rounded-lg mb-5 w-full object-cover h-52 group-hover:scale-105 transition-transform duration-400"
          loading="lazy"
        />
      )}
      <div className="flex flex-col flex-grow">
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
        <p className="text-white/70 line-clamp-3">{post.excerpt || ""}</p>
      </div>
    </Card>
  );
}

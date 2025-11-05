import { Link } from "react-router-dom";
import { useLocale } from "../context/LocaleContext";
import type { PostListItem } from "../types/post";

interface FeaturedPostCardProps {
  readonly post: PostListItem;
}

export default function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  const { locale, t } = useLocale();

  const dateFormat = locale === "es" ? "es-ES" : "en-US";

  return (
    <Link to={`/post/${post.slug}`} className="block group">
      <article className="border border-[#007EAD]/20 rounded-2xl overflow-hidden shadow-lg shadow-[#007EAD]/10 hover:shadow-xl hover:shadow-[#007EAD]/20 transition-all duration-300 bg-linear-to-br from-[#0f1f38]/95 to-[#0a1628]/98 backdrop-blur-sm">
        <div className="md:flex">
          {post.cover_image && (
            <div className="md:w-1/2 overflow-hidden">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="eager"
              />
            </div>
          )}
          <div className={`p-6 md:p-8 ${post.cover_image ? "md:w-1/2" : "w-full"}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-[#007EAD] text-white text-xs font-semibold rounded-full uppercase tracking-wide shadow-lg shadow-[#007EAD]/30">
                {t("featured_post_label")}
              </span>
              <span className="text-white/60 text-sm">
                {new Date(post.published_at).toLocaleDateString(dateFormat, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white group-hover:text-[#007EAD] transition-colors duration-300">
              {post.title}
            </h2>
            <p className="text-white/70 text-lg leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
            <div className="mt-6 flex items-center text-[#007EAD] font-semibold group-hover:gap-2 transition-all duration-300">
              <span>{t("read_more")}</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}


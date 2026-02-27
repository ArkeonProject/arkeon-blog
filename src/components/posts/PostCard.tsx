import { useLocale } from "../../hooks/useLocale";
import type { PostListItem } from "../../types/post";

interface PostCardProps {
  readonly post: PostListItem;
}

export default function PostCard({ post }: PostCardProps) {
  const { locale, t } = useLocale();
  const dateFormat = locale === "es" ? "es-ES" : "en-US";

  return (
    <article className="tech-card card-accent-border flex flex-col h-full overflow-hidden rounded-2xl group">
      {post.cover_image && (
        <div className="h-52 overflow-hidden relative">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          {/* Scan-line effect */}
          <div className="absolute inset-0 z-10 opacity-[0.015] pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)",
            }}
          />
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            loading="lazy"
          />
          {/* Category badge */}
          <div className="absolute top-4 left-4 z-20">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.15em]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/60 animate-pulse" />
              {post.category || "Labs"}
            </span>
          </div>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1 relative z-20 space-y-3">
        {/* Meta row */}
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
          <span
            className="text-primary/80"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {new Date(post.published_at).toLocaleDateString(dateFormat, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>5 min</span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-snug">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed font-body">
          {post.excerpt || ""}
        </p>

        {/* CTA */}
        <div className="mt-auto pt-4">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-[0.15em] group/cta">
            <span
              className="border-b border-primary/20 group-hover/cta:border-primary/60 pb-0.5 transition-colors duration-300"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {t("read_more")}
            </span>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-primary/20 group-hover/cta:bg-primary group-hover/cta:text-primary-foreground group-hover/cta:border-primary transition-all duration-300 text-[11px]">
              <span className="group-hover/cta:translate-x-0.5 transition-transform duration-300">→</span>
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}

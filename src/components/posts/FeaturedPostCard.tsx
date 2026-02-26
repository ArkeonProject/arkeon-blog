import { Link } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale";
import type { PostListItem } from "../../types/post";

interface FeaturedPostCardProps {
  readonly post: PostListItem;
}

export default function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  const { locale, t } = useLocale();
  const dateFormat = locale === "es" ? "es-ES" : "en-US";

  return (
    <div className="relative group overflow-visible h-full">
      <Link to={`/post/${post.slug}`} className="block h-full">
        <article className="tech-card card-accent-border min-h-[480px] md:min-h-[560px] flex flex-col md:flex-row rounded-2xl overflow-hidden h-full">
          {/* Image Section */}
          <div className="relative w-full md:w-[55%] overflow-hidden h-72 md:h-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface/30 z-10 hidden md:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface/50 to-transparent z-10 md:hidden" />
            {/* Scan-lines */}
            <div
              className="absolute inset-0 z-10 opacity-[0.012] pointer-events-none"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)",
              }}
            />
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] ease-out group-hover:scale-105"
              style={{ backgroundImage: `url('${post.cover_image}')` }}
            />
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col justify-center p-8 md:p-12 lg:p-16 relative z-20 space-y-6 bg-surface/80 backdrop-blur-sm md:border-l border-border/30">
            {/* Dot grid decoration */}
            <div className="dot-grid" />

            <div className="space-y-5 relative">
              {/* Badges */}
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.15em]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/60 animate-pulse" />
                  {t("category_featured")}
                </span>
                <span
                  className="text-muted-foreground text-[10px] font-medium uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {new Date(post.published_at!).toLocaleDateString(dateFormat, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-foreground leading-[0.95] tracking-tight group-hover:text-primary transition-colors duration-500">
                {post.title}
              </h3>
            </div>

            {/* Excerpt */}
            <p className="text-muted-foreground text-lg leading-relaxed font-body line-clamp-3">
              {post.excerpt}
            </p>

            {/* CTA */}
            <div className="flex items-center gap-4 pt-2">
              <span className="inline-flex items-center gap-3 text-primary font-bold uppercase tracking-[0.15em] text-xs group/cta">
                <span
                  className="border-b border-primary/20 group-hover/cta:border-primary/60 pb-0.5 transition-colors duration-300"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {t("read_more")}
                </span>
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-primary/20 group-hover/cta:bg-primary group-hover/cta:text-primary-foreground group-hover/cta:border-primary transition-all duration-300">
                  <span className="text-base group-hover/cta:translate-x-0.5 transition-transform duration-300">→</span>
                </span>
              </span>
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
}

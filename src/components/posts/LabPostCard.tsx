import { Link } from "react-router";
import { FiCode } from "react-icons/fi";
import { useLocale } from "@/hooks/useLocale";
import type { LabPostListItem } from "@/types/lab";

interface LabPostCardProps {
    readonly post: LabPostListItem;
}

const DIFFICULTY_LABELS: Record<string, { label_es: string; label_en: string; color: string }> = {
    beginner: { label_es: "Principiante", label_en: "Beginner", color: "bg-emerald-500" },
    intermediate: { label_es: "Intermedio", label_en: "Intermediate", color: "bg-amber-500" },
    advanced: { label_es: "Avanzado", label_en: "Advanced", color: "bg-rose-500" },
};

export default function LabPostCard({ post }: LabPostCardProps) {
    const { locale } = useLocale();
    const diff = post.difficulty ? DIFFICULTY_LABELS[post.difficulty] : null;

    return (
        <Link
            to={`/lab/${post.slug}`}
            className="block h-full"
            aria-label={post.title}
        >
            <article className="group relative glass-card rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-500 flex flex-col h-full hover:-translate-y-1">
                {/* Emerald accent bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500 z-10" />

                {/* Cover image with difficulty badge overlay */}
                {post.cover_image && (
                    <div className="aspect-[21/9] w-full overflow-hidden relative">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-[#0A0F1C]/80 to-transparent z-10 transition-opacity duration-300" />
                        <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            loading="lazy"
                        />
                        {diff && (
                            <div className="absolute top-4 left-4 z-20">
                                <span className={`${diff.color} text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest`}>
                                    {locale === "es" ? diff.label_es : diff.label_en}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <div className="p-6 flex flex-col flex-grow">
                    {/* Tags */}
                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 4).map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[10px] font-bold px-2 py-0.5 rounded border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 uppercase"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors duration-300 line-clamp-2">
                        {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 flex-grow mb-6">
                        {post.excerpt || ""}
                    </p>

                    {/* CTA */}
                    <span className="inline-flex items-center gap-2 text-emerald-500 font-bold text-sm group/btn">
                        <FiCode className="w-4 h-4" />
                        {locale === "es" ? "Leer artículo" : "Read article"}{" "}
                        <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </span>
                </div>
            </article>
        </Link>
    );
}

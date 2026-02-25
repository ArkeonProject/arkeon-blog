import { Link } from "react-router-dom";
import {
    FiBox,
    FiCheckCircle,
    FiLayers,
    FiServer,
    FiTerminal,
    FiCode,
} from "react-icons/fi";
import { useLocale } from "../../hooks/useLocale";
import Card from "../ui/Card";
import type { LabPostListItem } from "../../types/lab";

interface LabPostCardProps {
    readonly post: LabPostListItem;
}

const TAG_ICONS: Record<string, React.ReactNode> = {
    docker: <FiBox className="w-3.5 h-3.5" />,
    testing: <FiCheckCircle className="w-3.5 h-3.5" />,
    "ci-cd": <FiLayers className="w-3.5 h-3.5" />,
    server: <FiServer className="w-3.5 h-3.5" />,
    terminal: <FiTerminal className="w-3.5 h-3.5" />,
};

const DIFFICULTY_STYLES: Record<string, string> = {
    beginner: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    advanced: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

export default function LabPostCard({ post }: LabPostCardProps) {
    const { locale, t } = useLocale();
    const dateFormat = locale === "es" ? "es-ES" : "en-US";
    const difficultyKey = post.difficulty
        ? `lab_difficulty_${post.difficulty}`
        : null;

    return (
        <Link
            to={`/lab/${post.slug}`}
            className="block h-full"
            aria-label={post.title}
        >
            <Card className="relative p-0 group transition-all duration-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] hover:z-10 flex flex-col h-full overflow-hidden">
                {/* Terminal accent bar */}
                <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 group-hover:h-2 transition-all duration-300" />

                {post.cover_image && (
                    <div className="relative overflow-hidden">
                        <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                )}

                <div className="flex flex-col flex-grow p-6">
                    {/* Difficulty + date */}
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 dark:text-white/35 text-xs font-medium uppercase tracking-wider">
                            {new Date(post.published_at).toLocaleDateString(dateFormat, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>

                        {post.difficulty && difficultyKey && (
                            <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${DIFFICULTY_STYLES[post.difficulty] ?? "bg-gray-500/15 text-gray-400 border-gray-500/30"}`}
                            >
                                {t(difficultyKey)}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2">
                        {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-white/60 text-sm leading-relaxed line-clamp-3 flex-grow mb-4">
                        {post.excerpt || ""}
                    </p>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {post.tags.slice(0, 4).map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-[#007EAD]/8 text-[#00aaff]/80 border border-[#007EAD]/15"
                                >
                                    {TAG_ICONS[tag] ?? <FiCode className="w-3 h-3" />}
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="pt-3 border-t border-gray-200 dark:border-white/10">
                        <span className="text-emerald-500 dark:text-emerald-400 text-sm font-semibold group-hover:tracking-wider transition-all duration-300 inline-flex items-center gap-1.5">
                            <FiTerminal className="w-3.5 h-3.5" />
                            {locale === "es" ? "Leer artículo →" : "Read article →"}
                        </span>
                    </div>
                </div>
            </Card>
        </Link>
    );
}

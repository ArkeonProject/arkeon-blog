import { useLocale } from "../../hooks/useLocale";
import type { LabPostListItem } from "../../types/lab";
import Card from "../ui/Card";
import { FiTerminal, FiBox, FiCheckCircle, FiCode, FiServer, FiLayers } from "react-icons/fi";

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

interface LabPostCardProps {
    readonly post: LabPostListItem;
}

export default function LabPostCard({ post }: LabPostCardProps) {
    const { locale, t } = useLocale();
    const dateFormat = locale === "es" ? "es-ES" : "en-US";

    const difficultyKey = post.difficulty
        ? `lab_difficulty_${post.difficulty}`
        : null;

    return (
        <Card className="relative p-6 group transition-all duration-300 hover:shadow-[0_0_18px_rgba(0,126,173,0.5)] hover:scale-[1.02] hover:z-10 flex flex-col h-full overflow-hidden">
            {/* Decorative terminal-style accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#007EAD] via-[#00aaff] to-[#007EAD] opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

            {post.cover_image && (
                <img
                    src={post.cover_image}
                    alt={post.title}
                    className="rounded-lg mb-5 w-full object-cover aspect-video group-hover:scale-105 transition-transform duration-400"
                    loading="lazy"
                />
            )}

            <div className="flex flex-col flex-grow">
                {/* Tags + Difficulty row */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    {post.difficulty && difficultyKey && (
                        <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${DIFFICULTY_STYLES[post.difficulty] ?? "bg-gray-500/15 text-gray-400 border-gray-500/30"}`}
                        >
                            {t(difficultyKey)}
                        </span>
                    )}
                    {post.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-[#007EAD]/10 text-[#00aaff] border border-[#007EAD]/20"
                        >
                            {TAG_ICONS[tag.toLowerCase()] ?? (
                                <FiCode className="w-3.5 h-3.5" />
                            )}
                            {tag}
                        </span>
                    ))}
                </div>

                <h2 className="text-2xl font-semibold mb-1 text-gray-900 dark:text-white group-hover:text-[#007EAD] transition-colors duration-400">
                    {post.title}
                </h2>

                <p className="text-gray-500 dark:text-white/40 text-sm mb-4 border-b border-gray-300 dark:border-gray-700 pb-4">
                    {new Date(post.published_at).toLocaleDateString(dateFormat, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>

                <p className="text-gray-700 dark:text-white/70 line-clamp-3">
                    {post.excerpt || ""}
                </p>
            </div>
        </Card>
    );
}

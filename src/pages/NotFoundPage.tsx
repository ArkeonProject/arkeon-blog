import { Link, data } from "react-router";
import { Helmet } from "react-helmet-async";
import { FiHome, FiArrowLeft, FiAlertTriangle } from "react-icons/fi";
import { useLocale } from "@/hooks/useLocale";
import type { MetaFunction } from "react-router";

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
  return data(null, { status: 404 });
}

// eslint-disable-next-line react-refresh/only-export-components
export const meta: MetaFunction = () => [
  { title: "404 — Página no encontrada | Arkeonix Labs" },
  { name: "robots", content: "noindex, follow" },
];

export default function NotFoundPage() {
  const { t } = useLocale();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <Helmet>
        <title>404 — Page Not Found | Arkeonix Labs</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* Atmospheric Background */}
      <div className="dot-grid opacity-10" />
      <div className="glow-spot top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 opacity-10" />

      <div className="relative z-10 text-center space-y-8 animate-reveal">
        {/* Neon 404 badge */}
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 font-mono text-sm tracking-widest uppercase animate-pulse">
          <FiAlertTriangle />
          {t("not_found_error_code")}
        </div>

        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-bold font-display tracking-tighter text-glow">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-muted-foreground uppercase tracking-wider">
            {t("not_found_page_lost")}
          </h2>
          <p className="max-w-md mx-auto text-muted-foreground/60 font-body leading-relaxed">
             {t("not_found_message")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/25"
          >
            <FiHome className="text-lg" />
            {t("not_found_back_to_home")}
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-surface border border-border/60 text-foreground font-bold text-sm uppercase tracking-widest hover:bg-surface-hover hover:-translate-y-0.5 transition-all"
          >
            <FiArrowLeft className="text-lg" />
            {t("post_back_to_blog")}
          </button>
        </div>
      </div>
      
      {/* Tech decoration */}
      <div className="absolute bottom-10 left-10 hidden lg:block opacity-20 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.5em] [writing-mode:vertical-lr]">
        Protocol Error // Resource Missing // 0x404
      </div>
    </div>
  );
}

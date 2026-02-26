import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { useLocale } from "../../hooks/useLocale";

const QUICK_LINKS = [
  { path: "/blog", key: "nav_blog" },
  { path: "/news", key: "category_news" },
  { path: "/products", key: "category_products" },
  { path: "/lab", key: "category_lab" },
  { path: "/about", key: "footer_about" },
  { path: "/contact", key: "nav_contact" },
];

const LEGAL_LINKS = [
  { path: "/privacy", key: "footer_privacy" },
  { path: "/terms", key: "footer_terms" },
  { path: "/cookies", key: "footer_cookies" },
];

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="relative bg-surface pt-0 pb-10">
      {/* Gradient top border */}
      <div className="footer-gradient-border w-full mb-14" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-10">
          {/* Brand */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/blog" className="inline-flex items-center gap-2.5 group">
              <img
                src="/arkeon-logo.svg"
                alt="Arkeon Logo"
                className="w-7 h-7 rounded-lg group-hover:scale-105 transition-transform duration-300"
                style={{
                  boxShadow: "0 2px 6px color-mix(in oklch, var(--color-primary) 15%, transparent)",
                }}
              />
              <span className="text-base font-bold font-display text-foreground uppercase tracking-tight group-hover:text-primary transition-colors duration-300">
                Arkeon
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              {t("footer_tagline")}
            </p>
            <div className="flex gap-2 pt-1">
              <a
                href="https://github.com/ArkeonProject"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-background border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                aria-label="GitHub"
              >
                <FaGithub className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/david-l%C3%B3pez-santamar%C3%ADa-946965260/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-background border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-4">
            <h3
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {t("footer_quick_links")}
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ path, key }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-border group-hover:bg-primary transition-colors duration-200" />
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-3">
            <h3
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {t("footer_legal")}
            </h3>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map(({ path, key }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-border group-hover:bg-primary transition-colors duration-200" />
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p
            className="text-muted-foreground text-[11px] font-medium opacity-60 order-2 md:order-1"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            © {new Date().getFullYear()} Arkeon Project. {t("footer_rights")}
          </p>
          <p className="text-muted-foreground text-[11px] font-medium opacity-60 order-1 md:order-2 flex items-center gap-1.5">
            {t("footer_developed")}{" "}
            <FiHeart className="w-3 h-3 text-red-400 animate-pulse" />{" "}
            {t("footer_by")} {t("footer_creator")}
          </p>
        </div>
      </div>
    </footer>
  );
}

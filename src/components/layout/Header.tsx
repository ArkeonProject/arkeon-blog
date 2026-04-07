import { Link, useLocation, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { useLocale } from "@/hooks/useLocale";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import type { Locale } from "@/context/LocaleContext";

const NAV_LINKS = [
  { path: "/blog", key: "blog" },
  { path: "/recursos", key: "recursos" },
  { path: "/lab", key: "lab" },
  { path: "/guia-junior", key: "guide" },
  { path: "/academia", key: "academia" },
  { path: "/arkeonix", key: "saas" },
];


export default function Header() {
  const { locale, setLocale, t } = useLocale();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const navLinkLabel = (key: string) => {
    if (key === "blog") return t("nav_blog");
    if (key === "recursos") return t("nav_recursos");
    if (key === "guide") return t("nav_guide");
    if (key === "academia") return t("nav_academia");
    if (key === "saas") return t("nav_saas");
    if (key === "contact") return t("nav_contact");
    return t(`category_${key}`);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "glass-nav-scrolled" : "glass-nav"
        }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-500 ease-in-out ${isScrolled ? "h-12" : "h-16"
            }`}
        >
          {/* Logo */}
          <Link to="/blog" className="flex-shrink-0 flex items-center gap-2.5 group min-w-0">
            <img
              src="/arkeonix-logo.png"
              alt="Arkeonix Labs Logo"
              className={`rounded-lg object-contain transition-all duration-300 group-hover:scale-105 ${isScrolled ? "w-7 h-7" : "w-8 h-8"
                }`}
              style={{
                boxShadow: "0 2px 8px color-mix(in oklch, var(--color-primary) 20%, transparent)",
              }}
            />
            <span
              className={`font-bold tracking-tight font-display text-foreground group-hover:text-primary transition-all duration-300 uppercase whitespace-nowrap ${isScrolled ? "text-base" : "text-lg"
                }`}
            >
              Arkeonix Labs
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center justify-center gap-0.5 mx-auto">
            {NAV_LINKS.map(({ path, key }) => {
              const isActive =
                location.pathname === path ||
                (path === "/blog" && location.pathname === "/");
              return (
                <Link
                  key={path}
                  to={path}
                  className={`relative px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-300 ${isActive
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface"
                    }`}
                >
                  {navLinkLabel(key)}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center justify-end gap-2">
            {/* Language — desktop only */}
            <div className="relative hidden md:block" ref={langRef}>
              <button
                onClick={() => setIsLangOpen((prev) => !prev)}
                className="flex items-center gap-1 px-2 py-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface transition-all duration-300"
              >
                {locale.toUpperCase()}
                <FiChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-36 surface-elevated rounded-xl overflow-hidden animate-reveal p-1.5 border border-border/60">
                  {(["es", "en"] as Locale[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLocale(lang);
                        setIsLangOpen(false);
                      }}
                      className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${locale === lang
                        ? "text-primary font-semibold bg-primary/10"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`}
                    >
                      <span className="text-sm">{lang === "es" ? "🇪🇸" : "🇬🇧"}</span>
                      {lang === "es" ? "Español" : "English"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden md:block h-4 w-px bg-border/40" />

            {/* ThemeToggle — desktop only */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* User menu — desktop only */}
            {user ? (
              <div className="relative hidden md:block" ref={userRef}>
                <button
                  onClick={() => setIsUserOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface transition-all duration-300"
                >
                  <FiUser className="w-4 h-4" />
                  <span className="text-xs font-medium max-w-24 truncate">{user.email}</span>
                  <FiChevronDown className={`w-3 h-3 transition-transform duration-200 ${isUserOpen ? "rotate-180" : ""}`} />
                </button>
                {isUserOpen && (
                  <div className="absolute right-0 mt-2 w-48 surface-elevated rounded-xl overflow-hidden animate-reveal p-1.5 border border-border/60">
                    <Link
                      to="/guia-junior/dashboard"
                      onClick={() => setIsUserOpen(false)}
                      className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    >
                      <FiSettings className="w-3.5 h-3.5" />
                      {t("guia_dashboard_title")}
                    </Link>
                    <button
                      onClick={() => { signOut(); setIsUserOpen(false); navigate("/"); }}
                      className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 text-red-500 hover:bg-red-500/10"
                    >
                      <FiLogOut className="w-3.5 h-3.5" />
                      {t("auth_signout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-all"
              >
                <FiUser className="w-3.5 h-3.5" />
                {t("auth_login_title")}
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-surface hover:text-foreground transition-all duration-200"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                {isMobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scrolled gradient line */}
      {isScrolled && (
        <div className="footer-gradient-border w-full opacity-20" />
      )}

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-out ${isMobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="border-t border-border/20 bg-surface/95 backdrop-blur-3xl">
          <div className="px-4 py-3 space-y-0.5">
            {NAV_LINKS.map(({ path, key }) => {
              const isActive =
                location.pathname === path ||
                (path === "/blog" && location.pathname === "/");
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                  {navLinkLabel(key)}
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="mx-4 h-px bg-border/30" />

          {/* Language + Theme */}
          <div className="px-4 py-3 flex items-center justify-between">
            {/* Language selector */}
            <div className="flex items-center gap-2">
              {(["es", "en"] as Locale[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLocale(lang);
                    setIsMobileOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${locale === lang
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    }`}
                >
                  <span>{lang === "es" ? "🇪🇸" : "🇬🇧"}</span>
                  {lang === "es" ? "Español" : "English"}
                </button>
              ))}
            </div>

            {/* Theme toggle */}
            <ThemeToggle />
          </div>

          {/* Auth — mobile */}
          {user ? (
            <div className="mx-4 h-px bg-border/30" />
          ) : null}
          {user ? (
            <div className="px-4 py-3 space-y-2">
              <Link
                to="/guia-junior/dashboard"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-all"
              >
                <FiSettings className="w-4 h-4" />
                {t("guia_dashboard_title")}
              </Link>
              <button
                onClick={() => { signOut(); setIsMobileOpen(false); navigate("/"); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all w-full"
              >
                <FiLogOut className="w-4 h-4" />
                {t("auth_signout")}
              </button>
            </div>
          ) : (
            <div className="mx-4 h-px bg-border/30" />
          )}
          {!user ? (
            <div className="px-4 pb-4">
              <Link
                to="/login"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all w-full"
              >
                <FiUser className="w-4 h-4" />
                {t("auth_login_title")}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

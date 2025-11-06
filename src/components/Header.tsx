import { Link } from "react-router-dom";
import { useLocale } from "../context/LocaleContext";
import { FiGlobe as Globe, FiMenu as Menu, FiX as X } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

type Locale = "es" | "en";

export default function Header() {
  const { locale, setLocale } = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Cerrar el dropdown si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-linear-to-b from-[#0a1628] to-[#0d1a2d]/98 backdrop-blur-xl border-b border-[#007EAD]/20 shadow-lg shadow-[#007EAD]/5">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-30">
        {/* Left: Blog name */}
        <div className="flex items-center min-w-0 shrink-0">
          <Link to="/" className="block group">
            <span className="font-bold text-white text-xl tracking-tight transition-all duration-300 group-hover:text-[#007EAD]">
              Arkeon<span className="text-[#007EAD] group-hover:text-white">Blog</span>
            </span>
          </Link>
        </div>
        {/* Center: Logo */}
        <div className="flex justify-center items-center flex-1">
          <Link to="/" className="block group">
            <div className="relative">
              <div className="absolute inset-0 bg-[#007EAD]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src="/arkeon-logo.svg"
                alt="Arkeon Blog"
                className="h-36 w-36 mx-auto transition-all duration-500 group-hover:scale-105 relative z-10"
              />
            </div>
          </Link>
        </div>
        {/* Right: Navigation and language selector */}
        <div className="flex items-center gap-4 min-w-0 shrink-0">
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-10">

            {/* Language selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 border border-[#007EAD]/30 rounded-lg bg-[#0f1f38]/50 
                          hover:border-[#007EAD] hover:bg-[#007EAD]/10 hover:shadow-lg hover:shadow-[#007EAD]/20 
                          transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#007EAD]/50 backdrop-blur-sm"
              >
                <Globe className="w-4 h-4 text-[#007EAD]" />
                <span className="text-sm font-medium text-white/90">{locale.toUpperCase()}</span>
                <svg
                  className={`w-4 h-4 text-[#007EAD] transform transition-transform duration-300 ${
                    isLangOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-[#0f1f38]/95 backdrop-blur-xl rounded-lg border border-[#007EAD]/30 shadow-2xl shadow-[#007EAD]/20 overflow-hidden">
                  <button
                    onClick={() => {
                      setLocale("es");
                      setIsLangOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 text-sm transition-all duration-200 ${
                      locale === "es"
                        ? "text-[#007EAD] font-semibold bg-[#007EAD]/15"
                        : "text-white/80 hover:text-white hover:bg-[#007EAD]/10"
                    }`}
                  >
                    Español
                  </button>
                  <div className="h-px bg-[#007EAD]/20"></div>
                  <button
                    onClick={() => {
                      setLocale("en");
                      setIsLangOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 text-sm transition-all duration-200 ${
                      locale === "en"
                        ? "text-[#007EAD] font-semibold bg-[#007EAD]/15"
                        : "text-white/80 hover:text-white hover:bg-[#007EAD]/10"
                    }`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>
          </nav>
          {/* Mobile button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#007EAD]/10 hover:shadow-lg hover:shadow-[#007EAD]/20 transition-all duration-300 border border-transparent hover:border-[#007EAD]/30"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#007EAD]/20 bg-linear-to-b from-[#0f1f38]/95 to-[#0a1628]/98 backdrop-blur-xl">
          <nav className="flex flex-col items-center gap-3 py-6">

            {/* Language selector (mobile) */}
            <div className="flex items-center gap-3 mt-2 px-4 py-2 bg-[#0f1f38]/50 rounded-lg border border-[#007EAD]/30">
              <Globe className="w-4 h-4 text-[#007EAD]" />
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                className="bg-transparent border-none text-sm font-medium text-white focus:outline-none focus:ring-0 cursor-pointer"
              >
                <option value="es" className="bg-[#0f1f38] text-white">Español</option>
                <option value="en" className="bg-[#0f1f38] text-white">English</option>
              </select>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
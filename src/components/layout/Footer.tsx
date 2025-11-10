import { FaGithub, FaLinkedin, FaEnvelope, FaHeart } from "react-icons/fa";

import { useLocale } from "../../hooks/useLocale";

export default function Footer() {
  const { t } = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-b from-[#0a1628] to-[#060f1a] border-t border-[#007EAD]/20 mt-20 shadow-[0_-10px_40px_rgba(0,126,173,0.1)]">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-center md:text-left">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 group justify-center md:justify-start">
              <div className="relative">
                <div className="absolute inset-0 bg-[#007EAD]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img 
                  src="/arkeon-logo.svg" 
                  alt="Arkeon Logo" 
                  className="h-10 w-10 relative z-10 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-[#007EAD]">
                {t("brand")}
              </h3>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              {t("footer_description")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">{t("footer_quick_links")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/blog" className="text-white/70 hover:text-[#007EAD] transition-all duration-300 flex items-center gap-1 hover:translate-x-1">
                  {t("footer_articles")}
                </a>
              </li>
              <li>
                <a href="/contact" className="text-white/70 hover:text-[#007EAD] transition-all duration-300 flex items-center gap-1 hover:translate-x-1">
                  {t("nav_contact")}
                </a>
              </li>
              <li>
                <a href="/about" className="text-white/70 hover:text-[#007EAD] transition-all duration-300 flex items-center gap-1 hover:translate-x-1">
                  {t("footer_about")}
                </a>
              </li>
              <li>
                {/* <a href="/portfolio" className="text-white/70 hover:text-[#007EAD] transition-all duration-300 flex items-center gap-1 hover:translate-x-1">
                  {t("footer_portfolio")}
                </a> */}
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">{t("footer_resources")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/privacy" className="text-white/70 hover:text-[#007EAD] transition-all duration-300 hover:translate-x-1 inline-block">
                  {t("footer_privacy")}
                </a>
              </li>
              <li>
                <a href="/terms" className="text-white/70 hover:text-[#007EAD] transition-all duration-300 hover:translate-x-1 inline-block">
                  {t("footer_terms")}
                </a>
              </li>
              <li>
                <a href="/cookies" className="text-white/70 hover:text-[#007EAD] transition-all duration-300 hover:translate-x-1 inline-block">
                  {t("footer_cookies")}
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">{t("footer_connect")}</h4>
            <div className="space-y-4">
              <a 
                href="mailto:davidlopez00@proton.me" 
                className="flex items-center gap-2 text-sm text-white/70 hover:text-[#007EAD] transition-colors duration-300 group justify-center md:justify-start"
              >
                <FaEnvelope className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="break-all">davidlopez00@proton.me</span>
              </a>
              
              {/* Social Links */}
              <div className="flex gap-3 justify-center md:justify-start">
                <a 
                  href="https://github.com/ArkeonProject" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-[#0f1f38]/50 border border-[#007EAD]/30 rounded-lg hover:bg-[#007EAD]/10 hover:border-[#007EAD] hover:shadow-lg hover:shadow-[#007EAD]/20 transition-all duration-300 group backdrop-blur-sm"
                  aria-label="GitHub"
                >
                  <FaGithub className="w-5 h-5 text-white/70 group-hover:text-[#007EAD] group-hover:scale-110 transition-all duration-300" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/david-l%C3%B3pez-santamar%C3%ADa-946965260/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-[#0f1f38]/50 border border-[#007EAD]/30 rounded-lg hover:bg-[#007EAD]/10 hover:border-[#007EAD] hover:shadow-lg hover:shadow-[#007EAD]/20 transition-all duration-300 group backdrop-blur-sm"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5 text-white/70 group-hover:text-[#007EAD] group-hover:scale-110 transition-all duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#007EAD]/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60 text-center md:text-left">
            <p className="flex flex-col sm:flex-row items-center justify-center gap-1">
              <span>© {currentYear}</span>
              <span className="font-semibold text-[#007EAD]">{t("brand")}</span>
              <span>{t("footer_rights")}</span>
            </p>
            
            <p className="flex items-center gap-2 justify-center">
              {t("footer_developed")} 
              <FaHeart className="w-4 h-4 text-[#007EAD] fill-[#007EAD] animate-pulse" /> 
              {t("footer_by")} <span className="font-medium text-white">{t("footer_creator") || "David López"}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

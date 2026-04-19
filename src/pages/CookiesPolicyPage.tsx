import { Helmet } from "react-helmet-async";
import type { MetaFunction } from "react-router";

// eslint-disable-next-line react-refresh/only-export-components
export const meta: MetaFunction = () => [
  { title: "Política de Cookies | Arkeonix Labs" },
  { name: "description", content: "Explicamos cómo gestionamos las cookies para optimizar tu experiencia técnica en nuestro sitio." },
  { tagName: "link", rel: "canonical", href: "https://arkeonixlabs.com/cookies" },
  { name: "robots", content: "noindex, follow" },
];
import { useLocale } from "@/hooks/useLocale";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function CookiesPolicyPage() {
  const { t } = useLocale();

  return (
    <ScrollReveal variant="fade-up" duration={700}>
    <Helmet>
      <title>{t("cookies_title")} | Arkeonix Labs</title>
      <meta name="description" content={t("cookies_intro")} />
      <link rel="canonical" href="https://www.arkeonixlabs.com/cookies" />
    </Helmet>
    <div className="max-w-3xl mx-auto p-12 bg-gradient-to-br from-white to-gray-50 dark:from-[#0b1226] dark:via-[#071622] dark:to-[#0a172b] rounded-3xl shadow-lg dark:shadow-[#007EAD]/20 text-gray-900 dark:text-white font-sans leading-relaxed transition-colors duration-300">
      <h1 className="text-4xl font-semibold mb-6 text-[#007EAD] dark:text-[#00aaff]">
        {t("cookies_title")}
      </h1>

      <p className="mb-4">{t("cookies_intro")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#007EAD]">
        {t("cookies_what_title")}
      </h2>
      <p className="mb-4">{t("cookies_what_text")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#007EAD]">
        {t("cookies_types_title")}
      </h2>
      <p className="mb-4">{t("cookies_types_text")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#007EAD]">
        {t("cookies_management_title")}
      </h2>
      <p className="mb-4">{t("cookies_management_text")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#007EAD]">
        {t("cookies_third_title")}
      </h2>
      <p className="mb-4">{t("cookies_third_text")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#007EAD]">
        {t("cookies_changes_title")}
      </h2>
      <p className="mb-4">{t("cookies_changes_text")}</p>

      <p className="text-sm text-gray-600 dark:text-white/60 mt-8">
        {t("cookies_last_updated")} 06/11/2025
      </p>
    </div>
    </ScrollReveal>
  );
}

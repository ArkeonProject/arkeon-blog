import { Helmet } from "react-helmet-async";
import type { MetaFunction } from "react-router";

// eslint-disable-next-line react-refresh/only-export-components
export const meta: MetaFunction = () => [
  { title: "Términos de Uso | Arkeonix Labs" },
  { name: "description", content: "El uso de Arkeonix Labs implica la aceptación de nuestras normas de navegación y uso de contenido técnico." },
  { tagName: "link", rel: "canonical", href: "https://arkeonixlabs.com/terms" },
  { name: "robots", content: "noindex, follow" },
];
import { useLocale } from "@/hooks/useLocale";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function TermsPage() {
  const { t } = useLocale();

  return (
    <ScrollReveal variant="fade-up" duration={700}>
    <Helmet>
      <title>{t("terms_title")} | Arkeonix Labs</title>
      <meta name="description" content={t("terms_intro")} />
      <link rel="canonical" href="https://www.arkeonixlabs.com/terms" />
    </Helmet>
    <div className="max-w-3xl mx-auto p-12 bg-gradient-to-br from-white to-gray-50 dark:from-[#0b1226] dark:via-[#071622] dark:to-[#0a172b] rounded-3xl shadow-lg dark:shadow-[#007EAD]/20 text-gray-900 dark:text-white font-sans leading-relaxed transition-colors duration-300">
      <h1 className="text-4xl font-semibold mb-6 text-[#007EAD] dark:text-[#00aaff]">
        {t("terms_title")}
      </h1>

      <p className="mb-4">{t("terms_intro")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#007EAD]">
        {t("terms_usage_title")}
      </h2>
      <p className="mb-4">{t("terms_usage_text")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#007EAD]">
        {t("terms_content_title")}
      </h2>
      <p className="mb-4">{t("terms_content_text")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#007EAD]">
        {t("terms_liability_title")}
      </h2>
      <p className="mb-4">{t("terms_liability_text")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#007EAD]">
        {t("terms_changes_title")}
      </h2>
      <p className="mb-4">{t("terms_changes_text")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#007EAD]">
        {t("terms_contact_title")}
      </h2>
      <p>{t("terms_contact_text")}</p>
    </div>
    </ScrollReveal>
  );
}

import { Helmet } from "react-helmet-async";
import type { MetaFunction } from "react-router";
import { useLocale } from "@/hooks/useLocale";
import ScrollReveal from "@/components/ui/ScrollReveal";

// eslint-disable-next-line react-refresh/only-export-components
export const meta: MetaFunction = () => [
  { title: "Declaración de Afiliados | Arkeonix Labs" },
  { name: "description", content: "Información sobre el programa de afiliados de Arkeonix Labs y cómo utilizamos enlaces de afiliados." },
  { tagName: "link", rel: "canonical", href: "https://arkeonixlabs.com/affiliate-disclosure" },
  { property: "og:title", content: "Declaración de Afiliados | Arkeonix Labs" },
  { property: "og:description", content: "Información sobre el programa de afiliados de Arkeonix Labs y cómo utilizamos enlaces de afiliados." },
  { property: "og:image", content: "https://arkeonixlabs.com/arkeonix-logo.png" },
  { property: "og:url", content: "https://arkeonixlabs.com/affiliate-disclosure" },
  { property: "og:site_name", content: "Arkeonix Labs" },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Declaración de Afiliados | Arkeonix Labs" },
  { name: "twitter:description", content: "Información sobre el programa de afiliados de Arkeonix Labs y cómo utilizamos enlaces de afiliados." },
  { name: "twitter:image", content: "https://arkeonixlabs.com/arkeonix-logo.png" },
];

export default function AffiliateDisclosurePage() {
  const { t } = useLocale();

  return (
    <ScrollReveal variant="fade-up" duration={700}>
    <div className="max-w-3xl mx-auto p-12 bg-gradient-to-br from-white to-gray-50 dark:from-[#0b1226] dark:via-[#071622] dark:to-[#0a172b] rounded-3xl shadow-lg dark:shadow-[#007EAD]/20 text-gray-900 dark:text-white font-sans leading-relaxed transition-colors duration-300">
      <Helmet>
        <title>{t("affiliate_title")} | Arkeonix Labs</title>
        <meta name="description" content={t("affiliate_intro")} />
        <meta property="og:title" content={`${t("affiliate_title")} | Arkeonix Labs`} />
        <meta property="og:description" content={t("affiliate_intro")} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://arkeonixlabs.com/affiliate-disclosure" />
        <meta property="og:image" content="https://arkeonixlabs.com/arkeonix-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t("affiliate_title")} | Arkeonix Labs`} />
        <meta name="twitter:description" content={t("affiliate_intro")} />
        <meta name="twitter:image" content="https://arkeonixlabs.com/arkeonix-logo.png" />
      </Helmet>
      <h1 className="text-4xl font-semibold mb-6 text-[#007EAD] dark:text-[#00aaff]">
        {t("affiliate_title")}
      </h1>

      <p className="mb-4">{t("affiliate_intro")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#007EAD]">{t("affiliate_what_title")}</h2>
      <p className="mb-4">{t("affiliate_what_text")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#007EAD]">{t("affiliate_how_title")}</h2>
      <p className="mb-4">{t("affiliate_how_text")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#007EAD]">{t("affiliate_editorial_title")}</h2>
      <p className="mb-4">{t("affiliate_editorial_text")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#007EAD]">{t("affiliate_cost_title")}</h2>
      <p className="mb-4">{t("affiliate_cost_text")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#007EAD]">{t("affiliate_contact_title")}</h2>
      <p>{t("affiliate_contact_text")}</p>
    </div>
    </ScrollReveal>
  );
}

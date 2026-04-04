import { useLocale } from "@/hooks/useLocale";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function AffiliateDisclosurePage() {
  const { t } = useLocale();

  return (
    <ScrollReveal variant="fade-up" duration={700}>
    <div className="max-w-3xl mx-auto p-12 bg-gradient-to-br from-white to-gray-50 dark:from-[#0b1226] dark:via-[#071622] dark:to-[#0a172b] rounded-3xl shadow-lg dark:shadow-[#007EAD]/20 text-gray-900 dark:text-white font-sans leading-relaxed transition-colors duration-300">
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

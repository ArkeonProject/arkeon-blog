import { useLocale } from "../hooks/useLocale";

export default function CookiesPolicyPage() {
  const { t } = useLocale();

  return (
    <div className="max-w-3xl mx-auto p-8 bg-linear-to-br from-[#0b1226] via-[#071622] to-[#0a172b] rounded-3xl shadow-lg shadow-[#007EAD]/20 text-white font-sans leading-relaxed">
      <h1 className="text-4xl font-semibold mb-6 text-[#00aaff]">
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

      <p className="text-sm text-white/60 mt-8">
        {t("cookies_last_updated")} 06/11/2025
      </p>
    </div>
  );
}

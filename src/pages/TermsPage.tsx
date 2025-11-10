import { useLocale } from "../hooks/useLocale";

export default function TermsPage() {
  const { t } = useLocale();

  return (
    <div className="max-w-3xl mx-auto p-8 bg-linear-to-br from-[#0b1226] via-[#071622] to-[#0a172b] rounded-3xl shadow-lg shadow-[#007EAD]/20 text-white font-sans leading-relaxed">
      <h1 className="text-4xl font-semibold mb-6 text-[#00aaff]">
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
  );
}

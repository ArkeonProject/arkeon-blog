import { useLocale } from "../context/LocaleContext";

export default function PrivacyPolicyPage() {
  const { t } = useLocale();

  return (
    <div className="max-w-3xl mx-auto p-8 bg-linear-to-br from-[#0b1226] via-[#071622] to-[#0a172b] rounded-3xl shadow-lg shadow-[#007EAD]/20 text-white font-sans leading-relaxed">
      <h1 className="text-4xl font-semibold mb-6 text-[#00aaff]">
        {t("privacy_title")}
      </h1>

      <p className="mb-4">{t("privacy_intro")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#007EAD]">{t("privacy_data_collection_title")}</h2>
      <p className="mb-4">{t("privacy_data_collection_text")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#007EAD]">{t("privacy_third_parties_title")}</h2>
      <p className="mb-4">{t("privacy_third_parties_text")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#007EAD]">{t("privacy_rights_title")}</h2>
      <p className="mb-4">{t("privacy_rights_text")}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#007EAD]">{t("privacy_contact_title")}</h2>
      <p>{t("privacy_contact_text")}</p>
    </div>
  );
}
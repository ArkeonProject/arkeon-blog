import { useLocale } from "../context/LocaleContext";

const AboutPage = () => {
  const { t } = useLocale();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-linear-to-r from-gray-900 to-gray-800 rounded-lg shadow-lg shadow-blue-500/50">
      <h1 className="text-4xl font-bold text-white mb-6">{t("about_title")}</h1>
      <p className="text-lg text-gray-300 mb-4">{t("about_intro")}</p>
      <p className="text-lg text-gray-300">{t("about_mission")}</p>
    </div>
  );
};

export default AboutPage;

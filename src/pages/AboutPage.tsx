import { useLocale } from "../hooks/useLocale";

const AboutPage = () => {
  const { t } = useLocale();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg shadow-gray-200 dark:shadow-blue-500/50 transition-colors duration-300">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">{t("about_title")}</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">{t("about_intro")}</p>
      <p className="text-lg text-gray-700 dark:text-gray-300">{t("about_mission")}</p>
    </div>
  );
};

export default AboutPage;

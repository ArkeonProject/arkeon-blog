import { Helmet } from "react-helmet-async";
import { useLocale } from "../hooks/useLocale";

const AboutPage = () => {
  const { t } = useLocale();

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-white to-gray-50 dark:from-[#0b1226] dark:via-[#071622] dark:to-[#0a172b] rounded-3xl shadow-lg dark:shadow-[#007EAD]/20 transition-colors duration-300">
      <Helmet>
        <title>{t("about_title")} | Arkeon Blog</title>
        <meta name="description" content={t("about_meta_description")} />
        <link rel="canonical" href="https://www.arkeontech.es/about" />
      </Helmet>

      {/* Hero Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#007EAD] via-[#00aaff] to-[#007EAD] bg-clip-text text-transparent mb-4">
          {t("about_title")}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#007EAD] to-transparent mx-auto rounded-full"></div>
      </header>

      {/* Main Introduction */}
      <section className="mb-10">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          {t("about_intro")}
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          {t("about_mission")}
        </p>
      </section>

      {/* What We Cover */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-[#007EAD] dark:text-[#00aaff] mb-4">
          {t("about_topics_title")}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📱 {t("about_topic_products")}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{t("about_topic_products_desc")}</p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📰 {t("about_topic_news")}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{t("about_topic_news_desc")}</p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">💡 {t("about_topic_guides")}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{t("about_topic_guides_desc")}</p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🔍 {t("about_topic_reviews")}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{t("about_topic_reviews_desc")}</p>
          </div>
        </div>
      </section>

      {/* About the Creator */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-[#007EAD] dark:text-[#00aaff] mb-4">
          {t("about_creator_title")}
        </h2>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1">
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {t("about_creator_intro")}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t("about_creator_experience")}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-[#007EAD] dark:text-[#00aaff] mb-4">
          {t("about_values_title")}
        </h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-[#007EAD] text-xl">✓</span>
            <span className="text-gray-700 dark:text-gray-300">{t("about_value_quality")}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#007EAD] text-xl">✓</span>
            <span className="text-gray-700 dark:text-gray-300">{t("about_value_honesty")}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#007EAD] text-xl">✓</span>
            <span className="text-gray-700 dark:text-gray-300">{t("about_value_updated")}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#007EAD] text-xl">✓</span>
            <span className="text-gray-700 dark:text-gray-300">{t("about_value_community")}</span>
          </li>
        </ul>
      </section>

      {/* Contact CTA */}
      <section className="text-center p-6 bg-gradient-to-r from-[#007EAD]/10 to-[#00aaff]/10 rounded-2xl">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          {t("about_contact_cta")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t("about_contact_cta_desc")}
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-3 bg-[#007EAD] hover:bg-[#00aaff] text-white font-semibold rounded-xl transition-colors duration-300"
        >
          {t("about_contact_button")}
        </a>
      </section>
    </div>
  );
};

export default AboutPage;

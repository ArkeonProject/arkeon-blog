import { Helmet } from "react-helmet-async";
import type { MetaFunction } from "react-router";

// eslint-disable-next-line react-refresh/only-export-components
export const meta: MetaFunction = () => [
  { title: "Sobre Nosotros | Arkeonix Labs" },
  { name: "description", content: "Conoce al equipo de Arkeonix Labs y nuestra misión de precisión técnica en análisis de tecnología." },
  { tagName: "link", rel: "canonical", href: "https://arkeonixlabs.com/about" },
  { property: "og:title", content: "Sobre Nosotros | Arkeonix Labs" },
  { property: "og:description", content: "Conoce al equipo de Arkeonix Labs y nuestra misión de precisión técnica en análisis de tecnología." },
  { property: "og:image", content: "https://arkeonixlabs.com/arkeonix-logo.png" },
  { property: "og:url", content: "https://arkeonixlabs.com/about" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Sobre Nosotros | Arkeonix Labs" },
  { name: "twitter:description", content: "Conoce al equipo de Arkeonix Labs y nuestra misión de precisión técnica en análisis de tecnología." },
  { name: "twitter:image", content: "https://arkeonixlabs.com/arkeonix-logo.png" },
];
import { useLocale } from "@/hooks/useLocale";
import ScrollReveal from "@/components/ui/ScrollReveal";

const AboutPage = () => {
  const { t } = useLocale();

  return (
    <div className="max-w-4xl mx-auto p-12 bg-gradient-to-br from-white to-gray-50 dark:from-[#0b1226] dark:via-[#071622] dark:to-[#0a172b] rounded-3xl shadow-lg dark:shadow-[#007EAD]/20 transition-colors duration-300">
      <Helmet>
        <title>{t("about_title")} | Arkeonix Labs</title>
        <meta name="description" content={t("about_meta_description")} />
        <link rel="canonical" href="https://www.arkeonixlabs.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${t("about_title")} | Arkeonix Labs`} />
        <meta property="og:description" content={t("about_meta_description")} />
        <meta property="og:url" content="https://www.arkeonixlabs.com/about" />
        <meta property="og:site_name" content="Arkeonix Labs" />
        <meta property="og:image" content="https://www.arkeonixlabs.com/arkeonix-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t("about_title")} | Arkeonix Labs`} />
        <meta name="twitter:description" content={t("about_meta_description")} />
        <meta name="twitter:image" content="https://www.arkeonixlabs.com/arkeonix-logo.png" />
      </Helmet>

      {/* Hero Section */}
      <ScrollReveal variant="blur" duration={800}>
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#007EAD] via-[#00aaff] to-[#007EAD] bg-clip-text text-transparent mb-4">
          {t("about_title")}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#007EAD] to-transparent mx-auto rounded-full"></div>
      </header>
      </ScrollReveal>

      {/* Main Introduction */}
      <ScrollReveal variant="fade-up">
      <section className="mb-10">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          {t("about_intro")}
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          {t("about_mission")}
        </p>
      </section>
      </ScrollReveal>

      {/* What We Cover */}
      <section className="mb-10">
        <ScrollReveal variant="fade-left">
        <h2 className="text-2xl font-semibold text-[#007EAD] dark:text-[#00aaff] mb-4">
          {t("about_topics_title")}
        </h2>
        </ScrollReveal>
        <ScrollReveal variant="fade-up" delay={100}>
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
        </ScrollReveal>
      </section>

      {/* About the Creator */}
      <ScrollReveal variant="fade-right" duration={800}>
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
      </ScrollReveal>

      {/* Values */}
      <ScrollReveal variant="fade-up">
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
      </ScrollReveal>

      {/* Contact CTA */}
      <ScrollReveal variant="zoom-in" duration={800}>
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
      </ScrollReveal>
    </div>
  );
};

export default AboutPage;

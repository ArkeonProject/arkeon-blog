import { Helmet } from "react-helmet-async";
import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { FiArrowRight, FiTool } from "react-icons/fi";
import PageHero from "@/components/ui/PageHero";
import Card from "@/components/ui/Card";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useLocale } from "@/hooks/useLocale";

// eslint-disable-next-line react-refresh/only-export-components
export const meta: MetaFunction = () => [
  { title: "Herramientas para developers | Arkeonix Labs" },
  {
    name: "description",
    content: "Utilidades prácticas para tomar mejores decisiones técnicas y profesionales.",
  },
  { tagName: "link", rel: "canonical", href: "https://arkeonixlabs.com/herramientas" },
  { property: "og:title", content: "Herramientas para developers | Arkeonix Labs" },
  { property: "og:description", content: "Utilidades prácticas para tomar mejores decisiones técnicas y profesionales." },
  { property: "og:image", content: "https://arkeonixlabs.com/arkeonix-logo.png" },
  { property: "og:url", content: "https://arkeonixlabs.com/herramientas" },
  { property: "og:site_name", content: "Arkeonix Labs" },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Herramientas para developers | Arkeonix Labs" },
  { name: "twitter:description", content: "Utilidades prácticas para tomar mejores decisiones técnicas y profesionales." },
  { name: "twitter:image", content: "https://arkeonixlabs.com/arkeonix-logo.png" },
];

export default function HerramientasPage() {
  const { t } = useLocale();
  const faqs = [
    { question: t("tools_faq_q1"), answer: t("tools_faq_a1") },
    { question: t("tools_faq_q2"), answer: t("tools_faq_a2") },
    { question: t("tools_faq_q3"), answer: t("tools_faq_a3") },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12">
      <Helmet>
        <title>{t("tools_title")} | Arkeonix Labs</title>
        <meta name="description" content={t("tools_description")} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: t("tools_title"),
            description: t("tools_description"),
            itemListElement: [
              { "@type": "ListItem", position: 1, name: t("tools_salary_title"), description: t("tools_salary_description"), url: "https://arkeonixlabs.com/herramientas/calculadora-salario" },
              { "@type": "ListItem", position: 2, name: t("role_quiz_card_title"), description: t("role_quiz_card_description"), url: "https://arkeonixlabs.com/herramientas/test-rol-tech" },
              { "@type": "ListItem", position: 3, name: t("portfolio_checklist_card_title"), description: t("portfolio_checklist_card_description"), url: "https://arkeonixlabs.com/herramientas/checklist-portfolio-junior" },
            ],
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          })}
        </script>
      </Helmet>

      <PageHero
        badge={t("nav_tools")}
        title={t("tools_title_part1")}
        titleHighlight={t("tools_title_part2")}
        description={t("tools_description")}
        badgeColor="amber"
      />

      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#007EAD] dark:text-[#00aaff] mb-6 text-center">
          {t("tools_catalog_title")}
        </h2>

        <ScrollReveal variant="fade-up" duration={800}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-6 border border-border hover:border-primary/30 transition-colors">
              <div className="flex h-full flex-col gap-4">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-primary"><FiTool /> {t("tools_salary_badge")}</p>
                  <h3 className="mt-2 font-display text-xl text-foreground">{t("tools_salary_title")}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t("tools_salary_description")}</p>
                </div>
                <div className="mt-auto">
                  <Link
                    to="/herramientas/calculadora-salario"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    {t("tools_salary_cta")}
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border hover:border-primary/30 transition-colors">
              <div className="flex h-full flex-col gap-4">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-primary"><FiTool /> {t("role_quiz_badge")}</p>
                  <h3 className="mt-2 font-display text-xl text-foreground">{t("role_quiz_card_title")}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t("role_quiz_card_description")}</p>
                </div>
                <div className="mt-auto">
                  <Link
                    to="/herramientas/test-rol-tech"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    {t("role_quiz_card_cta")}
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border hover:border-primary/30 transition-colors">
              <div className="flex h-full flex-col gap-4">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-primary"><FiTool /> {t("portfolio_checklist_badge")}</p>
                  <h3 className="mt-2 font-display text-xl text-foreground">{t("portfolio_checklist_card_title")}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t("portfolio_checklist_card_description")}</p>
                </div>
                <div className="mt-auto">
                  <Link
                    to="/herramientas/checklist-portfolio-junior"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    {t("portfolio_checklist_card_cta")}
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </ScrollReveal>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#007EAD] dark:text-[#00aaff] mb-6 text-center">
          {t("tools_faq_title")}
        </h2>
        <div className="grid gap-4">
          {faqs.map((faq) => (
            <Card key={faq.question} className="p-5 border border-border">
              <h3 className="font-display text-lg text-foreground">{faq.question}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

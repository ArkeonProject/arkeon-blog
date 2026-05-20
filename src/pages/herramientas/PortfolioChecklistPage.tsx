import { Helmet } from "react-helmet-async";
import type { MetaFunction } from "react-router";
import PageHero from "@/components/ui/PageHero";
import PortfolioChecklist from "@/components/herramientas/PortfolioChecklist";
import { useLocale } from "@/hooks/useLocale";

// eslint-disable-next-line react-refresh/only-export-components
export const meta: MetaFunction = () => [
  { title: "Checklist de Portfolio Junior — Evalúa tu perfil | Arkeonix Labs" },
  {
    name: "description",
    content:
      "Evalúa tu portfolio junior en 10 categorías: GitHub, README, testing, CI/CD, LinkedIn, CV y más. Obtén una puntuación y 3 mejoras prioritarias.",
  },
  { tagName: "link", rel: "canonical", href: "https://arkeonixlabs.com/herramientas/checklist-portfolio-junior" },
  { property: "og:title", content: "Checklist de Portfolio Junior — Evalúa tu perfil | Arkeonix Labs" },
  { property: "og:description", content: "Evalúa tu portfolio junior en 10 categorías: GitHub, README, testing, CI/CD, LinkedIn, CV y más. Obtén una puntuación y 3 mejoras prioritarias." },
  { property: "og:image", content: "https://arkeonixlabs.com/arkeonix-logo.png" },
  { property: "og:url", content: "https://arkeonixlabs.com/herramientas/checklist-portfolio-junior" },
  { property: "og:site_name", content: "Arkeonix Labs" },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Checklist de Portfolio Junior — Evalúa tu perfil | Arkeonix Labs" },
  { name: "twitter:description", content: "Evalúa tu portfolio junior en 10 categorías: GitHub, README, testing, CI/CD, LinkedIn, CV y más. Obtén una puntuación y 3 mejoras prioritarias." },
  { name: "twitter:image", content: "https://arkeonixlabs.com/arkeonix-logo.png" },
];

export default function PortfolioChecklistPage() {
  const { t } = useLocale();

  return (
    <div className="space-y-12">
      <Helmet>
        <title>{t("portfolio_checklist_page_title")} | Arkeonix Labs</title>
        <meta name="description" content={t("portfolio_checklist_page_description")} />
      </Helmet>

      <PageHero
        badge={t("portfolio_checklist_badge")}
        title={t("portfolio_checklist_page_title_part1")}
        titleHighlight={t("portfolio_checklist_page_title_part2")}
        description={t("portfolio_checklist_page_description")}
        badgeColor="primary"
      />

      <section className="max-w-4xl mx-auto px-4">
        <PortfolioChecklist />
      </section>
    </div>
  );
}

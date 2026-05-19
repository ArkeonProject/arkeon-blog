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

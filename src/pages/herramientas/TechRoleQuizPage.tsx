import { Helmet } from "react-helmet-async";
import type { MetaFunction } from "react-router";
import PageHero from "@/components/ui/PageHero";
import TechRoleQuiz from "@/components/herramientas/TechRoleQuiz";
import { useLocale } from "@/hooks/useLocale";

// eslint-disable-next-line react-refresh/only-export-components
export const meta: MetaFunction = () => [
  { title: "Test de Rol Tech — ¿Qué perfil encaja contigo? | Arkeonix Labs" },
  {
    name: "description",
    content:
      "Descubre si tu perfil se ajusta más a Frontend, Backend, QA, DevOps, Data, Cybersecurity o Product. Test gratuito basado en preferencias reales.",
  },
  { tagName: "link", rel: "canonical", href: "https://arkeonixlabs.com/herramientas/test-rol-tech" },
  { property: "og:title", content: "Test de Rol Tech — ¿Qué perfil encaja contigo? | Arkeonix Labs" },
  { property: "og:description", content: "Descubre si tu perfil se ajusta más a Frontend, Backend, QA, DevOps, Data, Cybersecurity o Product. Test gratuito basado en preferencias reales." },
  { property: "og:image", content: "https://arkeonixlabs.com/arkeonix-logo.png" },
  { property: "og:url", content: "https://arkeonixlabs.com/herramientas/test-rol-tech" },
  { property: "og:site_name", content: "Arkeonix Labs" },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Test de Rol Tech — ¿Qué perfil encaja contigo? | Arkeonix Labs" },
  { name: "twitter:description", content: "Descubre si tu perfil se ajusta más a Frontend, Backend, QA, DevOps, Data, Cybersecurity o Product. Test gratuito basado en preferencias reales." },
  { name: "twitter:image", content: "https://arkeonixlabs.com/arkeonix-logo.png" },
];

export default function TechRoleQuizPage() {
  const { t } = useLocale();

  return (
    <div className="space-y-12">
      <Helmet>
        <title>{t("role_quiz_page_title")} | Arkeonix Labs</title>
        <meta name="description" content={t("role_quiz_page_description")} />
      </Helmet>

      <PageHero
        badge={t("role_quiz_badge")}
        title={t("role_quiz_page_title_part1")}
        titleHighlight={t("role_quiz_page_title_part2")}
        description={t("role_quiz_page_description")}
        badgeColor="primary"
      />

      <section className="max-w-4xl mx-auto px-4">
        <TechRoleQuiz />
      </section>
    </div>
  );
}

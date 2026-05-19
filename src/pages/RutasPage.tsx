import { Helmet } from "react-helmet-async";
import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { FiArrowRight, FiMap, FiLayers } from "react-icons/fi";
import PageHero from "@/components/ui/PageHero";
import Card from "@/components/ui/Card";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { rutas } from "@/data/rutas";
import { useLocale } from "@/hooks/useLocale";

// eslint-disable-next-line react-refresh/only-export-components
export const meta: MetaFunction = () => [
  { title: "Rutas de aprendizaje tech | Arkeonix Labs" },
  {
    name: "description",
    content:
      "Caminos ordenados para aprender desarrollo, QA automation, DevOps y crear productos tech desde cero.",
  },
  { tagName: "link", rel: "canonical", href: "https://arkeonixlabs.com/rutas" },
];

export default function RutasPage() {
  const { t } = useLocale();

  return (
    <div className="max-w-4xl mx-auto py-12">
      <Helmet>
        <title>{t("rutas_title")} | Arkeonix Labs</title>
        <meta name="description" content={t("rutas_description")} />
      </Helmet>

      <PageHero
        badge={t("nav_rutas")}
        title={t("rutas_title_part1")}
        titleHighlight={t("rutas_title_part2")}
        description={t("rutas_description")}
        badgeColor="emerald"
        badgeIcon={<FiMap />}
      />

      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
          {t("rutas_catalog_title")}
        </h2>

        <ScrollReveal variant="fade-up" duration={800}>
          <div className="grid md:grid-cols-2 gap-4">
            {rutas.map((ruta) => (
              <Card
                key={ruta.slug}
                className="p-6 border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex h-full flex-col gap-4">
                  <div>
                    <p className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-primary">
                      <FiLayers /> {t("rutas_badge")} · {ruta.sections.length} {t("rutas_sections")}
                    </p>
                    <h3 className="mt-2 font-display text-xl text-foreground">
                      {t(ruta.titleKey)}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t(ruta.descKey)}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <Link
                      to={`/rutas/${ruta.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >
                      {t("rutas_cta")}
                      <FiArrowRight />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

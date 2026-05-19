import { Helmet } from "react-helmet-async";
import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { FiArrowRight, FiBookOpen, FiPackage } from "react-icons/fi";
import PageHero from "@/components/ui/PageHero";
import Card from "@/components/ui/Card";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useLocale } from "@/hooks/useLocale";

// eslint-disable-next-line react-refresh/only-export-components
export const meta: MetaFunction = () => [
  { title: "Recursos para developers | Arkeonix Labs" },
  {
    name: "description",
    content: "Guía Junior y SaaS Boilerplate para acelerar tu crecimiento técnico y profesional.",
  },
  { tagName: "link", rel: "canonical", href: "https://arkeonixlabs.com/recursos" },
  { property: "og:title", content: "Recursos para developers | Arkeonix Labs" },
  { property: "og:description", content: "Guía Junior y SaaS Boilerplate para acelerar tu crecimiento técnico y profesional." },
  { property: "og:image", content: "https://arkeonixlabs.com/arkeonix-logo.png" },
  { property: "og:url", content: "https://arkeonixlabs.com/recursos" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Recursos para developers | Arkeonix Labs" },
  { name: "twitter:description", content: "Guía Junior y SaaS Boilerplate para acelerar tu crecimiento técnico y profesional." },
  { name: "twitter:image", content: "https://arkeonixlabs.com/arkeonix-logo.png" },
];

export default function RecursosPage() {
  const { t } = useLocale();

  return (
    <div className="max-w-4xl mx-auto py-12">
      <Helmet>
        <title>{t("resources_title")} | Arkeonix Labs</title>
        <meta name="description" content={t("resources_description")} />
      </Helmet>

      <PageHero
        badge={t("nav_recursos")}
        title={t("resources_title_part1")}
        titleHighlight={t("resources_title_part2")}
        description={t("resources_description")}
        badgeColor="emerald"
      />

      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#007EAD] dark:text-[#00aaff] mb-6 text-center">
          {t("resources_catalog_title")}
        </h2>

        <ScrollReveal variant="fade-up" duration={800}>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6 border border-border hover:border-primary/30 transition-colors">
              <div className="flex h-full flex-col gap-4">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-primary">
                    <FiBookOpen /> {t("resources_guide_badge")}
                  </p>
                  <h3 className="mt-2 font-display text-xl text-foreground">{t("resources_guide_title")}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t("resources_guide_description")}</p>
                </div>
                <div className="mt-auto">
                  <Link
                    to="/recursos/guia-junior"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    {t("resources_guide_cta")}
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border hover:border-primary/30 transition-colors">
              <div className="flex h-full flex-col gap-4">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-primary">
                    <FiPackage /> {t("resources_saas_badge")}
                  </p>
                  <h3 className="mt-2 font-display text-xl text-foreground">{t("resources_saas_title")}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t("resources_saas_description")}</p>
                </div>
                <div className="mt-auto">
                  <Link
                    to="/recursos/saas-boilerplate"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    {t("resources_saas_cta")}
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

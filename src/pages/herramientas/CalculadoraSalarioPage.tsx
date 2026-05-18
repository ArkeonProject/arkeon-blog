import { Helmet } from "react-helmet-async";
import type { MetaFunction } from "react-router";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Card from "@/components/ui/Card";
import SalaryCalculator from "@/components/herramientas/SalaryCalculator";
import { useLocale } from "@/hooks/useLocale";

// eslint-disable-next-line react-refresh/only-export-components
export const meta: MetaFunction = () => [
  { title: "Calculadora Salario España 2026 | Arkeonix Labs" },
  {
    name: "description",
    content:
      "Calcula salario neto en España 2026 por comunidad, IRPF, Seguridad Social, hijos, edad y número de pagas.",
  },
  { tagName: "link", rel: "canonical", href: "https://arkeonixlabs.com/herramientas/calculadora-salario" },
];

export default function CalculadoraSalarioPage() {
  const { t } = useLocale();

  return (
    <div className="space-y-16">
      <Helmet>
        <title>{t("salary_calc_title")} | Arkeonix Labs</title>
        <meta name="description" content={t("salary_calc_description")} />
      </Helmet>

      <PageHero
        badge={t("tools_salary_badge")}
        title={t("salary_calc_title_part1")}
        titleHighlight={t("salary_calc_title_part2")}
        description={t("salary_calc_description")}
        badgeColor="emerald"
      />

      <ScrollReveal variant="fade-up" duration={900}>
        <SalaryCalculator />
      </ScrollReveal>

      <section className="grid gap-4 max-w-4xl mx-auto">
        <Card className="p-5 text-sm leading-relaxed text-muted-foreground border-l-4 border-l-primary text-center">
          <p className="font-semibold text-foreground">{t("salary_calc_note_fiscal_title")}</p>
          <p className="mt-2">{t("salary_calc_note_fiscal_body")}</p>
          <p className="mt-3 text-xs text-muted-foreground/80">{t("salary_calc_note_fiscal_review")}</p>
        </Card>
        <Card className="p-5 text-sm leading-relaxed text-muted-foreground border-l-4 border-l-amber-500 text-center">
          <p className="font-semibold text-foreground">{t("salary_calc_note_disclaimer_title")}</p>
          <p className="mt-2">{t("salary_calc_note_disclaimer_body")}</p>
        </Card>
      </section>
    </div>
  );
}

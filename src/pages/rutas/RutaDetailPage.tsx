import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import type { MetaFunction } from "react-router";
import { Helmet } from "react-helmet-async";
import { FiArrowLeft, FiArrowRight, FiExternalLink } from "react-icons/fi";
import PageHero from "@/components/ui/PageHero";
import TableOfContents from "@/components/rutas/TableOfContents";
import { getRutaBySlug, getAdjacentRutas } from "@/data/rutas";
import type { RutaSection } from "@/types/ruta";
import { useLocale } from "@/hooks/useLocale";

function MobileToc({ sections, t }: { sections: RutaSection[]; t: (key: string) => string }) {
  return (
    <details className="lg:hidden mb-8 border border-border rounded-xl bg-surface/50">
      <summary className="px-4 py-3 text-sm font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
        <span>{t("rutas_toc_heading")}</span>
        <span className="text-muted-foreground text-xs">{sections.length} {t("rutas_sections")}</span>
      </summary>
      <ul className="px-4 pb-4 space-y-1">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="block text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
            >
              {t(section.titleKey)}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const meta: MetaFunction = ({ params }) => {
  const slug = params.slug ?? "";
  const ruta = getRutaBySlug(slug);
  if (!ruta) {
    return [
      { title: "Ruta no encontrada | Arkeonix Labs" },
      { name: "description", content: "Ruta de aprendizaje no encontrada." },
      { tagName: "link", rel: "canonical", href: `https://arkeonixlabs.com/rutas/${slug}` },
    ];
  }
  return [
    { title: "Ruta de aprendizaje | Arkeonix Labs" },
    { tagName: "link", rel: "canonical", href: `https://arkeonixlabs.com/rutas/${slug}` },
  ];
};

export default function RutaDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLocale();
  const [activeId, setActiveId] = useState("");

  const ruta = slug ? getRutaBySlug(slug) : undefined;
  const adjacent = slug ? getAdjacentRutas(slug) : { prev: null, next: null };

  useEffect(() => {
    if (!ruta) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (intersecting.length > 0) {
          setActiveId(intersecting[0].target.id);
        }
      },
      { rootMargin: "-10% 0px -70% 0px" }
    );

    for (const section of ruta.sections) {
      const el = document.getElementById(section.id);
      if (el) {
        observer.observe(el);
      }
    }

    return () => observer.disconnect();
  }, [ruta]);

  if (!ruta) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">{t("ruta_not_found")}</h1>
        <Link to="/rutas" className="text-primary hover:underline inline-flex items-center gap-2">
          <FiArrowLeft /> {t("rutas_back_to_list")}
        </Link>
      </div>
    );
  }

  const title = t(ruta.titleKey);

  return (
    <div className="max-w-6xl mx-auto py-12">
      <Helmet>
        <title>{title} | Arkeonix Labs</title>
        <meta name="description" content={t(ruta.descKey)} />
      </Helmet>

      <PageHero
        badge={t("rutas_badge")}
        title={t("rutas_detail_title_prefix")}
        titleHighlight={title}
        description={t(ruta.descKey)}
        badgeColor="emerald"
      />

      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
        {/* Sidebar ToC */}
        <TableOfContents sections={ruta.sections} activeId={activeId} t={t} />

        {/* Main Content */}
        <article className="max-w-3xl">
          {/* Mobile ToC */}
          <MobileToc sections={ruta.sections} t={t} />

          {ruta.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="mb-16 scroll-mt-28"
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                {t(section.titleKey)}
              </h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                {t(section.contentKey)
                  .split("\n\n")
                  .map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
              </div>

              {section.links && section.links.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-semibold text-foreground mb-3">
                    {t("rutas_linked_tools")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {section.links.map((link) => (
                      <Link
                        key={link.url}
                        to={link.url}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1.5 text-sm font-medium hover:bg-primary/20 transition-colors"
                      >
                        {t(link.labelKey)}
                        {link.external && <FiExternalLink className="w-3 h-3" />}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          ))}
        </article>
      </div>

      {/* Prev / Next navigation */}
      <div className="mt-20 pt-10 border-t border-border max-w-3xl lg:ml-[268px]">
        <div className="grid md:grid-cols-2 gap-4">
          {adjacent.prev ? (
            <Link
              to={`/rutas/${adjacent.prev.slug}`}
              className="group flex items-start gap-3 p-5 rounded-xl border border-border hover:border-primary/30 bg-surface/50 transition-colors"
            >
              <FiArrowLeft className="mt-1 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  {t("ruta_prev")}
                </p>
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {t(adjacent.prev.titleKey)}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {adjacent.next ? (
            <Link
              to={`/rutas/${adjacent.next.slug}`}
              className="group flex items-start gap-3 p-5 rounded-xl border border-border hover:border-primary/30 bg-surface/50 transition-colors md:text-right md:flex-row-reverse"
            >
              <FiArrowRight className="mt-1 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  {t("ruta_next")}
                </p>
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {t(adjacent.next.titleKey)}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}

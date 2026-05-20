import type { RutaSection } from "@/types/ruta";

interface TableOfContentsProps {
  sections: RutaSection[];
  activeId: string;
  t: (key: string) => string;
}

export default function TableOfContents({ sections, activeId, t }: TableOfContentsProps) {
  return (
    <nav
      aria-label={t("rutas_toc_label")}
      className="hidden lg:block"
    >
      <div className="sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          {t("rutas_toc_heading")}
        </p>
        <ul className="space-y-1 border-l border-border pl-3">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`block text-sm leading-snug py-1.5 transition-colors ${
                  activeId === section.id
                    ? "text-primary font-semibold border-l-2 border-primary -ml-3.5 pl-3"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(section.titleKey)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

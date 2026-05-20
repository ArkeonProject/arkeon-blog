import type { ReactNode } from "react";

interface PageHeroProps {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  badgeColor?: "primary" | "emerald" | "amber" | "rose";
  badgeIcon?: ReactNode;
  children?: ReactNode;
}

const BADGE_STYLES: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  emerald: "bg-emerald-500/10 text-emerald-500",
  amber: "bg-amber-500/10 text-amber-500",
  rose: "bg-rose-500/10 text-rose-500",
};

export default function PageHero({
  badge,
  title,
  titleHighlight,
  description,
  badgeColor = "primary",
  badgeIcon,
  children,
}: PageHeroProps) {
  const badgeClass = BADGE_STYLES[badgeColor] ?? BADGE_STYLES.primary;

  return (
    <header className="text-center mb-16">
      <span
        className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full mb-4 ${badgeClass}`}
      >
        {badgeIcon}
        {badge}
      </span>
      <h1 className="text-4xl md:text-5xl font-bold font-display leading-[1.05] tracking-tight mb-6">
        {title && <span className="text-foreground">{title}</span>}
        {title && titleHighlight && " "}
        {titleHighlight && (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            {titleHighlight}
          </span>
        )}
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
      {children}
    </header>
  );
}

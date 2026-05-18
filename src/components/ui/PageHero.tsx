import type { ReactNode } from "react";

interface PageHeroProps {
  badge: string;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}

export default function PageHero({
  badge,
  title,
  description,
  children,
  className = "",
}: PageHeroProps) {
  return (
    <header className={`text-center mb-16 ${className}`}>
      <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-4">
        {badge}
      </span>
      <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-[#007EAD] via-[#00aaff] to-[#007EAD] bg-clip-text text-transparent mb-6 leading-tight">
        {title}
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
      {children}
    </header>
  );
}

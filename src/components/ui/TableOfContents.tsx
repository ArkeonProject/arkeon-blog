import { useState, useEffect } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0% -80% 0%" }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-4 hidden lg:block scrollbar-hide">
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mb-6 flex items-center gap-2">
          <span className="w-4 h-[1px] bg-primary/40 block" />
          Contenidos
        </h3>
        <ul className="space-y-3 border-l border-border/40 ml-2">
          {items.map((item) => (
            <li
              key={item.id}
              className={`transition-all duration-300 ${
                item.level === 3 ? "pl-6" : "pl-4"
              } -ml-[1px] border-l-2 ${
                activeId === item.id
                  ? "border-[#00aaff] text-[#00aaff] font-bold"
                  : "border-transparent text-muted-foreground/60 hover:text-foreground hover:border-border/60"
              }`}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="text-sm block py-0.5"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Decorative tech gradient */}
      <div className="mt-12 p-6 rounded-2xl bg-surface/40 border border-border/40 backdrop-blur-md relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent transition-opacity opacity-0 group-hover:opacity-100" />
        <p className="text-[10px] font-mono text-muted-foreground/40 leading-relaxed uppercase tracking-wider relative z-10">
          Protocol: Read // Integrity: Verified // Arkeonix Standard
        </p>
      </div>
    </nav>
  );
}

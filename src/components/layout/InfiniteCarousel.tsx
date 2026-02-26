import { useLocale } from "../../hooks/useLocale";

export default function InfiniteCarousel() {
  const { t } = useLocale();
  const message = t("carousel_message");

  const items = Array.from({ length: 6 }, (_, i) => ({
    id: `ticker-${i}`,
    text: message,
  }));

  return (
    <div className="relative w-full overflow-hidden py-3 border-y border-border/30 bg-surface/50">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex whitespace-nowrap animate-scroll">
        {[...items, ...items].map(({ id, text }, i) => (
          <span
            key={`${id}-${i}`}
            className="text-muted-foreground text-xs font-medium shrink-0 mx-8 uppercase tracking-[0.15em]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {text}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          animation: scroll 60s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  );
}

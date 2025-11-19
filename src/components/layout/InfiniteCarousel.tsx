import { useLocale } from "../../hooks/useLocale";

export default function InfiniteCarousel() {
  const { t } = useLocale();
  const message = t("carousel_message");

  const repeatedMessages = Array.from({ length: 8 }, (_, index) => ({
    id: `carousel-message-${index}`,
    text: message,
  }));

  return (
    <div className="relative mx-auto w-full max-w-[92%] md:max-w-[95%] 
    xl:max-w-[1000px] overflow-hidden py-5 border border-gray-300 dark:border-[#007EAD]/30 
    rounded-3xl backdrop-blur-sm bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-[#007EAD]/20 dark:via-[#007EAD]/15 dark:to-[#007EAD]/20 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(0,126,173,0.3)] transition-colors duration-300">
      <div className="absolute left-0 top-0 pointer-events-none w-40 h-full bg-gradient-to-r from-white dark:from-[#0a1628] via-white/70 dark:via-[#0a1628]/70 to-transparent" />
      <div className="absolute right-0 top-0 pointer-events-none w-40 h-full bg-gradient-to-l from-white dark:from-[#0a1628] via-white/70 dark:via-[#0a1628]/70 to-transparent" />

      <div className="flex whitespace-nowrap animate-scroll px-8">
        {repeatedMessages.map(({ id, text }) => (
          <span
            key={id}
            className="text-gray-900 dark:text-white font-semibold text-base md:text-lg shrink-0 mr-8 drop-shadow-[0_2px_4px_rgba(0,126,173,0.5)]"
          >
            {text}
          </span>
        ))}
        {repeatedMessages.map(({ id, text }) => (
          <span
            key={`${id}-clone`}
            className="text-gray-900 dark:text-white font-semibold text-base md:text-lg shrink-0 mr-8 drop-shadow-[0_2px_4px_rgba(0,126,173,0.5)]"
          >
            {text}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          display: flex;
          animation: scroll 80s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  );
}

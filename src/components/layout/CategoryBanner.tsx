import { Link, useLocation } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale";

const CATEGORY_LINKS = [
  {
    path: "/news",
    key: "news",
  },
  {
    path: "/products",
    key: "products",
  },
];

export default function CategoryBanner() {
  const { t } = useLocale();
  const location = useLocation();

  return (
    <div className="bg-[#0f1f38]/90 border-b border-[#007EAD]/20 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col gap-3 items-stretch md:flex-row md:items-center md:justify-center">
        {CATEGORY_LINKS.map(({ path, key }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`px-5 py-2 rounded-xl border transition-all duration-300 font-semibold text-center ${isActive
                ? "bg-[#007EAD] border-[#00aaff] text-white shadow-lg shadow-[#007EAD]/40"
                : "border-white/10 text-white/80 hover:text-white hover:border-[#00aaff]/60 hover:shadow-lg hover:shadow-[#007EAD]/20 bg-transparent"
                }`}
            >
              {t(`category_${key}`)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

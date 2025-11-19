import { Link, useLocation } from "react-router-dom";
import { FiHome, FiChevronRight } from "react-icons/fi";
import { useLocale } from "../../hooks/useLocale";

interface BreadcrumbItem {
  label: string;
  path: string;
}

export default function Breadcrumbs() {
  const location = useLocation();
  const { t } = useLocale();

  const pathnames = location.pathname.split("/").filter((x) => x);

  // No mostrar breadcrumbs en la home
  if (pathnames.length === 0) return null;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t("breadcrumb_home") || "Inicio", path: "/" },
  ];

  pathnames.forEach((value, index) => {
    const path = `/${pathnames.slice(0, index + 1).join("/")}`;

    // Traducir rutas comunes
    let label = value;
    if (value === "blog") label = t("breadcrumb_blog") || "Blog";
    else if (value === "post") return; // Skip the "post" segment
    else label = decodeURIComponent(value).replace(/-/g, " ");

    breadcrumbs.push({ label, path });
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm flex-wrap">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {index === 0 ? (
                <Link
                  to={crumb.path}
                  className="flex items-center gap-1 text-[#00aaff] hover:text-[#00bbee] transition-colors duration-300"
                >
                  <FiHome className="w-4 h-4" />
                  <span>{crumb.label}</span>
                </Link>
              ) : (
                <>
                  <FiChevronRight className="w-4 h-4 text-gray-400 dark:text-white/40" />
                  {isLast ? (
                    <span className="text-gray-900 dark:text-white/90 font-medium capitalize">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      to={crumb.path}
                      className="text-[#00aaff] hover:text-[#00bbee] transition-colors duration-300 capitalize"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

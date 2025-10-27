import { Link } from "react-router-dom";
import { useLocale } from "../context/LocaleContext";

export default function Header() {
  const { locale, setLocale, t } = useLocale();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-indigo-600">
          <Link to="/">{t("brand")}</Link>
        </h1>

        <nav className="flex items-center gap-6 text-gray-700 font-medium">
          <ul className="flex space-x-6">
            <li>
              <Link to="/blog" className="hover:text-indigo-600 transition">
                {t("nav_posts")}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-indigo-600 transition">
                {t("nav_contact")}
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-3">
            {/* Selector de idioma */}
            <label className="text-sm sr-only" htmlFor="locale-select">{t("language")}</label>
            <select
              id="locale-select"
              value={locale}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => setLocale(e.target.value as any)}
              className="border border-gray-300 bg-white text-sm rounded px-2 py-1"
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
          </div>
        </nav>
      </div>
    </header>
  );
}

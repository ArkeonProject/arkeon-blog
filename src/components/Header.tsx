import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-indigo-600">
          <Link to="/">Arkeon Blog</Link>
        </h1>

        <nav>
          <ul className="flex space-x-6 text-gray-700 font-medium">
            <li>
              <Link to="/blog" className="hover:text-indigo-600 transition">
                Publicaciones
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-indigo-600 transition">
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
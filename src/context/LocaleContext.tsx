import { createContext, useContext, useMemo, useState } from "react";

type Locale = "es" | "en";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LOCALE_KEY = "locale";

const MESSAGES: Record<Locale, Record<string, string>> = {
  es: {
    brand: "Arkeon Blog",
    nav_posts: "Publicaciones",
    nav_contact: "Contacto",
    language: "Idioma",
  },
  en: {
    brand: "Arkeon Blog",
    nav_posts: "Posts",
    nav_contact: "Contact",
    language: "Language",
  },
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem(LOCALE_KEY) as Locale | null;
    return saved ?? "es";
  });

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(LOCALE_KEY, l);
  };

  const t = useMemo(() => {
    const dict = MESSAGES[locale];
    return (key: string) => dict[key] ?? key;
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale debe usarse dentro de LocaleProvider");
  return ctx;
}

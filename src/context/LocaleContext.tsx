import { useEffect, useMemo, useState, type ReactNode } from "react";
import esMessages from "../locales/es.json";
import enMessages from "../locales/en.json";
import { LocaleContext } from "./LocaleContextObject";

export type Locale = "es" | "en";

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LOCALE_KEY = "locale";

const MESSAGES: Record<Locale, Record<string, string>> = {
  es: esMessages,
  en: enMessages,
};

interface LocaleProviderProps {
  readonly children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem(LOCALE_KEY) as Locale | null;
    return saved ?? "es";
  });

  useEffect(() => {
    localStorage.setItem(LOCALE_KEY, locale);
  }, [locale]);

  const t = useMemo(() => {
    const dict = MESSAGES[locale];
    return (key: string) => dict[key] ?? key;
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

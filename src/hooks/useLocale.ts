import { useContext } from "react";
import { LocaleContext } from "../context/LocaleContextObject";

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale debe usarse dentro de LocaleProvider");
  return ctx;
}

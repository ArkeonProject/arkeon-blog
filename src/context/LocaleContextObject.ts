import { createContext } from "react";
import type { LocaleContextValue } from "./LocaleContext";

export const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

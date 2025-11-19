import { FiGlobe as Globe } from "react-icons/fi";
import { useLocale } from "../../hooks/useLocale";
import type { Locale } from "../../context/LocaleContext";

export default function LanguageBanner() {
    const { locale, setLocale } = useLocale();

    return (
        <div className="bg-gray-200 dark:bg-[#0a1628]/80 border-b border-gray-300 dark:border-[#007EAD]/20 transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-6 py-2 flex justify-end items-center">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#0f1f38]/50 rounded-lg border border-gray-300 dark:border-[#007EAD]/30">
                    <Globe className="w-4 h-4 text-[#007EAD]" />
                    <select
                        value={locale}
                        onChange={(e) => setLocale(e.target.value as Locale)}
                        className="bg-transparent border-none text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-0 cursor-pointer"
                    >
                        <option value="es" className="bg-white dark:bg-[#0f1f38] text-gray-900 dark:text-white">Español</option>
                        <option value="en" className="bg-white dark:bg-[#0f1f38] text-gray-900 dark:text-white">English</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

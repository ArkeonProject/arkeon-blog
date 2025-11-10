import { useLocale } from "../hooks/useLocale";

export default function ContactPage() {
  const { t } = useLocale();
  return (
    <div className="max-w-3xl mx-auto p-8 bg-linear-to-br from-[#0b1226] via-[#071622] to-[#0a172b] rounded-3xl shadow-lg shadow-[#007EAD]/20">
      <h1 className="text-4xl font-semibold mb-6 text-white font-sans">{t("contact_title")}</h1>
      <p className="text-white text-lg mb-6 font-sans">
        {`${t("contact_description")} `}
        <a
          className="text-[#007EAD] underline hover:text-[#00aaff] transition-colors duration-300"
          href="mailto:davidlopez00@proton.me"
        >
          davidlopez00@proton.me
        </a>
        {'.'}
      </p>
      <p className="text-white text-base font-sans">
        {t("contact_form_coming")}
      </p>
    </div>
  );
}

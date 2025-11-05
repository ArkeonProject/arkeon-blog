import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useLocale } from "../context/LocaleContext";

export default function NewsletterForm() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isValidEmail = (val: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(val);

  const subscribe = async () => {
    setErrorMsg(null);
    if (!email.trim() || !isValidEmail(email)) {
      setErrorMsg(t("newsletter_error_invalid"));
      return;
    }
    setSending(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email }]);
    if (error) {
      console.error(error);
      if (typeof error.message === "string" && error.message.toLowerCase().includes("duplicate")) {
        setErrorMsg(t("newsletter_error_duplicate"));
      } else {
        setErrorMsg(t("newsletter_error_generic"));
      }
    } else {
      setSuccess(true);
    }
    setSending(false);
  };

  let buttonText;
  if (sending) {
    buttonText = t("newsletter_subscribing");
  } else if (success) {
    buttonText = t("newsletter_subscribed");
  } else {
    buttonText = t("newsletter_subscribe");
  }

  return (
    <div className="bg-linear-to-br from-[#0a1628] to-[#0f1f38] p-6 rounded-2xl text-center shadow-md shadow-[#007EAD]/20 border border-[#007EAD]/30 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,126,173,0.5)]">
      <h2 className="text-2xl font-bold mb-2 text-white">
        💌 <span className="text-[#007EAD]">{t("newsletter_title")}</span>
      </h2>
      <p className="text-white/90 mb-4">
        {t("newsletter_description")}
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-2">
        <input
          type="email"
          placeholder={t("newsletter_placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-700 bg-gray-900/50 text-white placeholder-white/50 p-3 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#007EAD]/60 focus:border-[#007EAD] backdrop-blur-sm transition-all duration-300"
          disabled={sending || success}
        />
        <button
          onClick={subscribe}
          className="bg-linear-to-r from-[#007EAD] to-[#005f7a] text-white px-6 py-3 rounded-lg shadow-md shadow-[#007EAD]/50 hover:shadow-lg hover:shadow-[#007EAD]/70 hover:scale-105 transition-transform duration-300 disabled:opacity-60 disabled:cursor-not-allowed font-medium"
          disabled={sending || success}
        >
          {buttonText}
        </button>
      </div>
      {errorMsg && <p className="text-red-400 mt-3">{errorMsg}</p>}
      {success && (
        <p className="text-[#007EAD] mt-3 font-medium">
          {t("newsletter_success")}
        </p>
      )}
    </div>
  );
}
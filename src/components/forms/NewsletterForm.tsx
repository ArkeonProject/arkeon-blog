import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useLocale } from "../../hooks/useLocale";
import Button from "../ui/Button";
import Card from "../ui/Card";

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

  const buttonLabel = success ? t("newsletter_subscribed") : t("newsletter_subscribe");

  return (
    <Card className="p-6 text-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,126,173,0.5)]">
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        💌 <span className="text-[#007EAD]">{t("newsletter_title")}</span>
      </h2>
      <p className="text-gray-700 dark:text-white/90 mb-4">
        {t("newsletter_description")}
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-2">
        <input
          type="email"
          placeholder={t("newsletter_placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 p-3 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#007EAD]/60 focus:border-[#007EAD] backdrop-blur-sm transition-all duration-300"
          disabled={sending || success}
        />
        <Button
          onClick={subscribe}
          loading={sending}
          loadingText={t("newsletter_subscribing")}
          disabled={success}
          className="w-full sm:w-auto"
        >
          {buttonLabel}
        </Button>
      </div>
      {errorMsg && <p className="text-red-400 mt-3">{errorMsg}</p>}
      {success && (
        <p className="text-[#007EAD] mt-3 font-medium">
          {t("newsletter_success")}
        </p>
      )}
    </Card>
  );
}

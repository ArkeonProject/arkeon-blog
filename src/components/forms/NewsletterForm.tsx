import { useState } from "react";
import { useLocale } from "@/hooks/useLocale";

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
    try {
      const res = await fetch("/api/newsletter-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) {
        if (data.error === "duplicate_email") {
          setErrorMsg(t("newsletter_error_duplicate"));
        } else {
          setErrorMsg(t("newsletter_error_generic"));
        }
      } else {
        setSuccess(true);
      }
    } catch {
      setErrorMsg(t("newsletter_error_generic"));
    }
    setSending(false);
  };

  return (
    <div className="w-full">
      <form
        className="flex flex-col sm:flex-row gap-3"
        onSubmit={(e) => { e.preventDefault(); void subscribe(); }}
      >
        <input
          type="email"
          placeholder={t("newsletter_placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-background border border-border/60 rounded-xl px-4 py-3 text-foreground text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/40"
          style={{ fontFamily: "var(--font-body)" }}
          disabled={sending || success}
        />
        <button
          type="submit"
          disabled={sending || success}
          className="bg-primary hover:brightness-110 text-primary-foreground font-bold py-3 px-8 rounded-xl whitespace-nowrap transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-widest"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {success ? "✓" : sending ? "..." : t("newsletter_subscribe")}
        </button>
      </form>
      {errorMsg && <p className="text-red-400 mt-3 text-sm">{errorMsg}</p>}
      {success && (
        <p className="text-primary mt-3 text-sm font-medium">
          {t("newsletter_success")}
        </p>
      )}
    </div>
  );
}

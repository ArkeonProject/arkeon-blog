import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLocale } from "../../hooks/useLocale";

type ConfirmStatus = "loading" | "success" | "error";

export default function ConfirmPage() {
  const { search } = useLocation();
  const { t } = useLocale();
  const token = useMemo(() => new URLSearchParams(search).get("token"), [search]);
  const hasToken = Boolean(token);
  const [status, setStatus] = useState<ConfirmStatus>(hasToken ? "loading" : "error");
  const [messageKey, setMessageKey] = useState<string>(
    hasToken ? "newsletter_confirm_loading" : "newsletter_confirm_missing"
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessageKey("newsletter_confirm_missing");
      return;
    }

    let cancelled = false;

    const confirmToken = async () => {
      setStatus("loading");
      setMessageKey("newsletter_confirm_loading");

      try {
        const endpoint = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/confirm-newsletter`;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ token }),
        });

        if (cancelled) return;

        if (response.ok) {
          setStatus("success");
          setMessageKey("newsletter_confirm_success_message");
        } else {
          setStatus("error");
          setMessageKey("newsletter_confirm_error_message");
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        if (cancelled) return;
        setStatus("error");
        setMessageKey("newsletter_confirm_error_message");
      }
    };

    confirmToken();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const renderHeading = () => {
    if (status === "success") return t("newsletter_confirm_success_title");
    if (status === "error") return t("newsletter_confirm_error_title");
    return t("newsletter_confirm_loading");
  };

  const renderActions = () => {
    if (status === "success") {
      return (
        <Link
          to="/blog"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#007EAD] text-white font-semibold shadow-lg shadow-[#007EAD]/30 hover:bg-[#009cd3] transition-colors"
        >
          {t("newsletter_confirm_back")}
        </Link>
      );
    }
    if (status === "error") {
      return (
        <Link
          to="/contact"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#007EAD] text-white font-semibold shadow-lg shadow-[#007EAD]/30 hover:bg-[#009cd3] transition-colors"
        >
          {t("newsletter_confirm_contact")}
        </Link>
      );
    }
    return null;
  };

  return (
    <div className="max-w-3xl mx-auto p-8 md:p-12 bg-linear-to-br from-[#0b1226] via-[#071622] to-[#0a172b] rounded-3xl shadow-lg shadow-[#007EAD]/20 text-white">
      <Helmet>
        <title>{t("newsletter_confirm_success_title")} | Arkeon</title>
        <meta name="description" content={t("newsletter_confirm_success_message")} />
      </Helmet>
      <div className="text-center space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/50 mb-4">{t("newsletter_title")}</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{renderHeading()}</h1>
          {status !== "loading" && <p className="text-white/80 text-lg">{t(messageKey)}</p>}
        </div>
        {status === "loading" ? (
          <p className="text-white/70 text-base animate-pulse">{t("newsletter_confirm_loading")}</p>
        ) : (
          <div>{renderActions()}</div>
        )}
      </div>
    </div>
  );
}
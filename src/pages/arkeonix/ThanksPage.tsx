import { Link } from "react-router";
import { FiCheckCircle, FiGithub, FiMail } from "react-icons/fi";
import { useLocale } from "@/hooks/useLocale";

export default function ArkeonixThanksPage() {
  const { t } = useLocale();

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <FiCheckCircle className="text-primary text-3xl" />
          </div>
        </div>

        <h1 className="text-3xl font-display font-bold text-foreground mb-4">
          {t("arkeonix_thanks_title")}
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {t("arkeonix_thanks_message")}
        </p>

        <div className="glass-card rounded-2xl p-6 mb-8 text-left space-y-4">
          <h2 className="font-semibold text-sm font-mono uppercase tracking-wider text-primary">
            {t("arkeonix_thanks_next_steps_title")}
          </h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span>{t("arkeonix_thanks_step1")}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>{t("arkeonix_thanks_step2")}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>{t("arkeonix_thanks_step3")}</span>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://github.com/ArkeonProject"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/25"
          >
            <FiGithub />
            {t("arkeonix_thanks_cta_github")}
          </a>
          <a
            href="mailto:davidlopez00@proton.me"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-surface hover:bg-surface-hover font-semibold transition-all"
          >
            <FiMail />
            {t("arkeonix_thanks_cta_support")}
          </a>
        </div>

        <p className="text-xs text-muted-foreground mt-8 font-mono">
          <Link to="/arkeonix" className="hover:text-primary transition-colors">
            ← {t("arkeonix_thanks_back")}
          </Link>
        </p>
      </div>
    </div>
  );
}

import { useState, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { useLocale } from "@/hooks/useLocale";
import {
  FiShield,
  FiCreditCard,
  FiUsers,
  FiKey,
  FiMail,
  FiBarChart2,
  FiGlobe,
  FiMoon,
  FiGitlab,
  FiZap,
  FiAlertCircle,
  FiLock,
  FiCheckCircle,
  FiSend,
  FiUser,
  FiMessageSquare,
  FiPackage,
  FiGithub,
  FiLinkedin,
  FiExternalLink,
  FiMonitor,
} from "react-icons/fi";
import ScrollReveal from "@/components/ui/ScrollReveal";

// ─── Data ───────────────────────────────────────────────────────────────────

const STACK = [
  "Next.js 15",
  "React 19",
  "TypeScript",
  "Tailwind CSS v4",
  "Prisma 5",
  "PostgreSQL",
  "Auth.js v5",
  "Stripe 17",
  "Resend",
  "Upstash Redis",
  "Sentry",
  "Docker",
  "GitHub Actions",
  "Vitest",
  "Playwright",
];

const FEATURES = [
  {
    icon: FiShield,
    key: "feature_auth",
  },
  {
    icon: FiLock,
    key: "feature_rbac",
  },
  {
    icon: FiCreditCard,
    key: "feature_billing",
  },
  {
    icon: FiUsers,
    key: "feature_teams",
  },
  {
    icon: FiKey,
    key: "feature_apikeys",
  },
  {
    icon: FiMail,
    key: "feature_email",
  },
  {
    icon: FiBarChart2,
    key: "feature_admin",
  },
  {
    icon: FiGlobe,
    key: "feature_i18n",
  },
  {
    icon: FiMoon,
    key: "feature_darkmode",
  },
  {
    icon: FiGitlab,
    key: "feature_cicd",
  },
  {
    icon: FiZap,
    key: "feature_ratelimit",
  },
  {
    icon: FiAlertCircle,
    key: "feature_audit",
  },
];

const INCLUDED = [
  "included_nextjs",
  "included_auth",
  "included_stripe",
  "included_multitenant",
  "included_limits",
  "included_admin",
  "included_emails",
  "included_ratelimit",
  "included_i18n",
  "included_darkmode",
  "included_sentry",
  "included_tests",
  "included_cicd",
  "included_docker",
  "included_audit",
  "included_typescript",
  "included_license",
  "included_updates",
];

const PLANS = [
  {
    key: "plan_starter",
    price: "€149",
    popular: false,
    features: ["plan_starter_f1", "plan_starter_f2", "plan_starter_f3", "plan_starter_f4", "plan_starter_f5"],
    ctaKey: "plan_cta_starter",
  },
  {
    key: "plan_pro",
    price: "€299",
    popular: true,
    features: ["plan_pro_f1", "plan_pro_f2", "plan_pro_f3", "plan_pro_f4", "plan_pro_f5", "plan_pro_f6"],
    ctaKey: "plan_cta_pro",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ArkeonixPage() {
  const { t } = useLocale();
  const [form, setForm] = useState({ name: "", email: "", plan: "Starter", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [demoTab, setDemoTab] = useState<"landing" | "dashboard">("landing");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const subject = `[Arkeonix SaaS] ${t("arkeonix_contact_subject_prefix")} – ${form.plan}`;
    const body = `${t("arkeonix_contact_body_name")}: ${form.name}\n${t("arkeonix_contact_body_email")}: ${form.email}\n${t("arkeonix_contact_body_plan")}: ${form.plan}\n\n${form.message}`;
    window.location.href = `mailto:davidlopez00@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <div className="relative max-w-6xl mx-auto">
      <Helmet>
        <title>Arkeonix SaaS — {t("arkeonix_meta_title")}</title>
        <meta name="description" content={t("arkeonix_meta_description")} />
        <link rel="canonical" href="https://www.arkeonixlabs.com/arkeonix" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Arkeonix SaaS — Arkeonix Labs" />
        <meta property="og:description" content={t("arkeonix_meta_description")} />
        <meta property="og:url" content="https://www.arkeonixlabs.com/arkeonix" />
        <meta property="og:site_name" content="Arkeonix Labs" />
        <meta property="og:image" content="https://www.arkeonixlabs.com/arkeonix-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Arkeonix SaaS — Arkeonix Labs" />
        <meta name="twitter:description" content={t("arkeonix_meta_description")} />
        <meta name="twitter:image" content="https://www.arkeonixlabs.com/arkeonix-logo.png" />
      </Helmet>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-24 text-center overflow-hidden">
        {/* Background glow blobs */}
        <div className="glow-spot w-[600px] h-[600px] top-[-200px] left-1/2 -translate-x-1/2 opacity-20" />
        <div className="dot-grid" />

        <div className="relative z-10 animate-[reveal_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold mb-8 font-display">
            <FiPackage className="text-xs" />
            {t("arkeonix_badge")}
          </span>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.05] tracking-tight mb-6">
            {t("arkeonix_hero_headline_1")}{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {t("arkeonix_hero_headline_highlight")}
            </span>
            <br />
            {t("arkeonix_hero_headline_2")}
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-body">
            {t("arkeonix_hero_subheading")}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all duration-200 shadow-lg shadow-primary/25"
            >
              {t("arkeonix_cta_primary")} →
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border bg-surface hover:bg-surface-hover font-semibold transition-all duration-200"
            >
              {t("arkeonix_cta_secondary")}
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-semibold transition-all duration-200"
            >
              <FiMonitor className="text-sm" />
              Live Demo
            </a>
          </div>

          {/* Social proof pills */}
          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground font-mono">
            {["Auth", "Payments", "Multi-tenancy", "API Keys", "i18n", "Dark Mode", "CI/CD"].map((pill) => (
              <span key={pill} className="px-3 py-1 rounded-full bg-muted border border-border/60">
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stack ──────────────────────────────────────────────────────── */}
      <section className="pb-20">
        <ScrollReveal variant="blur" duration={800}>
          <p className="text-center text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6">
            {t("arkeonix_stack_label")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {STACK.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-lg border border-border/60 bg-surface text-sm font-mono text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section id="features" className="pb-24">
        <ScrollReveal variant="fade-left" duration={800}>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t("arkeonix_features_title")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("arkeonix_features_subtitle")}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, key }, idx) => (
            <ScrollReveal key={key} variant="fade-up" delay={idx * 80} duration={700}>
              <div className="tech-card card-accent-border rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="text-primary text-xl" />
                </div>
                <h3 className="font-display font-semibold text-base mb-2">
                  {t(`arkeonix_${key}_title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`arkeonix_${key}_desc`)}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Live Demo ────────────────────────────────────────────────── */}
      <section id="demo" className="pb-24">
        <ScrollReveal variant="blur" duration={900}>
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold mb-6 font-display">
              <FiMonitor className="text-xs" />
              Live Demo
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t("arkeonix_demo_title")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("arkeonix_demo_subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {/* Screenshot tabs */}
        <div className="flex justify-center gap-2 mb-6">
          {(["landing", "dashboard"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setDemoTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                demoTab === tab
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
              }`}
            >
              {t(`arkeonix_demo_tab_${tab}`)}
            </button>
          ))}
        </div>

        {/* Browser chrome */}
        <ScrollReveal variant="flip-up" duration={900}>
          <a
            href="https://saas.arkeonixlabs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block group rounded-2xl border border-border/60 overflow-hidden shadow-2xl shadow-black/20 bg-surface transition-all duration-300 hover:border-primary/40 hover:shadow-primary/10"
          >
            {/* Title bar */}
            <div className="flex items-center gap-3 px-4 py-3 bg-muted border-b border-border/60">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <span className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/60 border border-border/40 text-xs font-mono text-muted-foreground">
                <FiLock className="text-green-500 shrink-0" />
                saas.arkeonixlabs.com
              </div>
              <FiExternalLink className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>

            {/* Screenshot */}
            <div className="relative overflow-hidden">
              <img
                src={demoTab === "landing" ? "/saas-landing.png" : "/saas-dashboard.png"}
                alt={`Arkeonix SaaS — ${demoTab}`}
                className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 flex items-center justify-center">
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <FiExternalLink className="text-sm" />
                  {t("arkeonix_demo_fullscreen")}
                </span>
              </div>
            </div>
          </a>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal variant="fade-up" delay={200}>
          <div className="text-center mt-8">
            <a
              href="https://saas.arkeonixlabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all duration-200 shadow-lg shadow-primary/25"
            >
              <FiExternalLink className="text-sm" />
              {t("arkeonix_demo_fullscreen")}
            </a>
          </div>
        </ScrollReveal>
      </section>

      {/* ── What's included ────────────────────────────────────────────── */}
      <section className="pb-24">
        <ScrollReveal variant="scale" duration={800}>
          <div className="glass-card rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  {t("arkeonix_included_title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {t("arkeonix_included_subtitle")}
                </p>
                <p className="text-sm font-mono text-primary font-semibold">
                  {t("arkeonix_included_note")}
                </p>
              </div>
              <ul className="space-y-3">
                {INCLUDED.map((key) => (
                  <li key={key} className="flex items-start gap-3 text-sm">
                    <FiCheckCircle className="text-primary mt-0.5 shrink-0 text-base" />
                    <span className="text-foreground/80">{t(`arkeonix_${key}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Pricing ────────────────────────────────────────────────────── */}
      <section id="pricing" className="pb-24">
        <ScrollReveal variant="fade-up">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t("arkeonix_pricing_title")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("arkeonix_pricing_subtitle")}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PLANS.map((plan) => (
            <ScrollReveal key={plan.key} variant={plan.popular ? "zoom-in" : "fade-up"} delay={plan.popular ? 150 : 0} duration={800}>
              <div
                className={`glass-card rounded-2xl p-7 flex flex-col ${
                  plan.popular
                    ? "border-primary/50 shadow-[0_0_40px_-10px] shadow-primary/20 ring-1 ring-primary/30"
                    : ""
                }`}
              >
                {plan.popular && (
                  <span className="self-start mb-4 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold font-mono">
                    {t("arkeonix_plan_popular")}
                  </span>
                )}
                <h3 className="font-display font-bold text-xl mb-1">{t(`arkeonix_${plan.key}`)}</h3>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-display font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm mb-1">{t("arkeonix_plan_period")}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{t(`arkeonix_${plan.key}_desc`)}</p>
                <ul className="space-y-2.5 mb-8 grow">
                  {plan.features.map((fk) => (
                    <li key={fk} className="flex items-start gap-2.5 text-sm">
                      <FiCheckCircle className="text-primary mt-0.5 shrink-0" />
                      <span>{t(`arkeonix_${fk}`)}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`block text-center px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25"
                      : "border border-border bg-surface hover:bg-surface-hover"
                  }`}
                >
                  {t(`arkeonix_${plan.ctaKey}`)}
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8 font-mono">
          {t("arkeonix_pricing_note")}
        </p>
      </section>

      {/* ── Who am I ───────────────────────────────────────────────────── */}
      <section className="pb-24">
        <ScrollReveal variant="fade-right" duration={900}>
          <div className="glass-card card-accent-border rounded-3xl p-8 md:p-12 overflow-hidden">
            <div className="flex flex-col md:flex-row items-start gap-10">
              {/* Photo */}
              <div className="flex-shrink-0 flex flex-col items-center gap-4">
                <img
                  src="/whoiam.jpg"
                  alt="David López"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-2 border-primary/20 shadow-lg shadow-primary/10"
                />
                <div className="flex gap-2">
                  <a
                    href="https://github.com/ArkeonProject"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted border border-border text-xs font-semibold hover:border-primary/40 hover:text-primary transition-all"
                  >
                    <FiGithub className="text-sm" /> {t("arkeonix_author_github")}
                  </a>
                  <a
                    href="https://www.linkedin.com/in/david-l%C3%B3pez-santamar%C3%ADa-946965260/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted border border-border text-xs font-semibold hover:border-primary/40 hover:text-primary transition-all"
                  >
                    <FiLinkedin className="text-sm" /> {t("arkeonix_author_linkedin")}
                  </a>
                </div>
              </div>

              {/* Bio */}
              <div className="flex-1 space-y-4">
                <span
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold text-primary"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {t("arkeonix_author_badge")}
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight">
                  {t("arkeonix_author_title")}
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {t("arkeonix_author_bio1")}
                </p>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {t("arkeonix_author_bio2")}
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Architecture Screenshot ─────────────────────────────────────── */}
      <section className="pb-24">
        <ScrollReveal variant="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              {t("arkeonix_arch_title")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              {t("arkeonix_arch_subtitle")}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Imagen */}
          <ScrollReveal variant="slide-rotate-left" duration={900}>
            <div className="relative rounded-2xl overflow-hidden border border-border/40 shadow-2xl shadow-black/30 max-h-[600px]">
              <img src="/code.png" alt="Arkeonix SaaS structure" className="w-full h-auto block" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                style={{ background: "linear-gradient(to top, var(--color-background) 0%, color-mix(in oklch, var(--color-background) 60%, transparent) 60%, transparent 100%)" }} />
              <div className="absolute inset-y-0 left-0 w-6 pointer-events-none"
                style={{ background: "linear-gradient(to right, color-mix(in oklch, var(--color-background) 60%, transparent), transparent)" }} />
              <div className="absolute inset-y-0 right-0 w-6 pointer-events-none"
                style={{ background: "linear-gradient(to left, color-mix(in oklch, var(--color-background) 60%, transparent), transparent)" }} />
            </div>
          </ScrollReveal>

          {/* Descripción estructural — columna central */}
          <ScrollReveal variant="fade-right" delay={200} duration={800}>
            <div className="space-y-6 pt-2">
              <div>
                <span
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold text-primary mb-3"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {t("arkeonix_arch_label")}
                </span>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t("arkeonix_arch_desc")}
                </p>
              </div>

              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <FiCheckCircle className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold font-mono mb-0.5">
                        {t(`arkeonix_arch_item${i}_title`)}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t(`arkeonix_arch_item${i}_desc`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ── Reviews ─────────────────────────────────────────────────────── */}
      <section className="pb-24">
        <ScrollReveal variant="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              {t("arkeonix_reviews_title")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              {t("arkeonix_reviews_subtitle")}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <ScrollReveal key={i} variant="fade-up" delay={i * 150} duration={800}>
              <div className="glass-card rounded-2xl p-7 flex flex-col gap-5">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className="text-yellow-400 text-base">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                  "{t(`arkeonix_review${i}_text`)}"
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                  <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm font-mono">
                    {t(`arkeonix_review${i}_name`).charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t(`arkeonix_review${i}_name`)}</p>
                    <p className="text-xs text-muted-foreground">{t(`arkeonix_review${i}_role`)}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Contact / Purchase Form ─────────────────────────────────────── */}
      <section id="contact" className="pb-24">
        <ScrollReveal variant="zoom-in" duration={900}>
        <div className="glass-card card-accent-border rounded-3xl p-8 md:p-12 max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold mb-3">
              {t("arkeonix_contact_title")}
            </h2>
            <p className="text-muted-foreground">
              {t("arkeonix_contact_subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                {t("contact_name_label")}
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary/60 outline-none transition-all text-sm"
                  placeholder={t("contact_name_placeholder")}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                {t("contact_email_label")}
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary/60 outline-none transition-all text-sm"
                  placeholder={t("contact_email_placeholder")}
                />
              </div>
            </div>

            {/* Plan selector */}
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                {t("arkeonix_contact_plan_label")}
              </label>
              <div className="relative">
                <FiPackage className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                <select
                  value={form.plan}
                  onChange={(e) => setForm({ ...form, plan: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary/60 outline-none transition-all text-sm appearance-none"
                >
                  <option value="Starter">Starter — €149 pago único</option>
                  <option value="Pro">Pro — €299 pago único</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                {t("contact_message_label")}
              </label>
              <div className="relative">
                <FiMessageSquare className="absolute left-3 top-3 text-muted-foreground text-sm" />
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary/60 outline-none transition-all text-sm resize-none"
                  placeholder={t("arkeonix_contact_message_placeholder")}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/25"
            >
              <FiSend className="text-sm" />
              {status === "sending"
                ? t("contact_sending")
                : status === "sent"
                ? t("contact_sent")
                : t("arkeonix_contact_submit")}
            </button>
          </form>
        </div>
        </ScrollReveal>
      </section>

      {/* ── Footer CTA ─────────────────────────────────────────────────── */}
      <section className="pb-16 text-center">
        <ScrollReveal variant="scale" duration={800}>
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 via-surface to-accent/5 px-8 py-16">
            <div className="glow-spot w-[400px] h-[400px] -top-20 left-1/2 -translate-x-1/2 opacity-10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                {t("arkeonix_footer_cta_title")}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {t("arkeonix_footer_cta_subtitle")}
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/25"
              >
                {t("arkeonix_cta_primary")} →
              </a>
              <p className="text-xs text-muted-foreground mt-6 font-mono">
                {t("arkeonix_footer_note")}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

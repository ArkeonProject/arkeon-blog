import { useCallback, useMemo, useState } from "react";
import { FiArrowRight, FiCheck, FiDownload, FiMap, FiRefreshCw } from "react-icons/fi";
import { Link } from "react-router";
import Card from "@/components/ui/Card";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useLocale } from "@/hooks/useLocale";
import {
  calculateScore,
  categories,
  downloadChecklist,
  getAllItemKeys,
  getCategoryScore,
  maxScore,
} from "@/utils/portfolioChecklist";

const CATEGORY_ICONS: Record<string, string> = {
  portfolio_cat_github: "🐙",
  portfolio_cat_readme: "📄",
  portfolio_cat_deployed: "🚀",
  portfolio_cat_testing: "🧪",
  portfolio_cat_cicd: "⚙️",
  portfolio_cat_design: "🎨",
  portfolio_cat_docs: "📚",
  portfolio_cat_linkedin: "💼",
  portfolio_cat_cv: "📋",
  portfolio_cat_demo: "🎬",
};

export default function PortfolioChecklist() {
  const { t } = useLocale();
  const [phase, setPhase] = useState<"checklist" | "result">("checklist");
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const result = useMemo(() => {
    if (phase !== "result") return null;
    return calculateScore(checkedItems);
  }, [phase, checkedItems]);

  const currentScore = useMemo(() => {
    return categories.reduce(
      (total, cat) => total + getCategoryScore(cat, checkedItems),
      0
    );
  }, [checkedItems]);

  const progress = (currentScore / maxScore) * 100;

  const handleToggle = useCallback((itemKey: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) {
        next.delete(itemKey);
      } else {
        next.add(itemKey);
      }
      return next;
    });
  }, []);

  const handleCalculate = useCallback(() => {
    setPhase("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleRetry = useCallback(() => {
    setPhase("checklist");
    setCheckedItems(new Set());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDownload = useCallback(() => {
    if (!result) return;
    downloadChecklist(checkedItems, result, t);
  }, [checkedItems, result, t]);

  const allItemKeys = useMemo(() => getAllItemKeys(), []);

  const handleCheckAll = useCallback(() => {
    setCheckedItems(new Set(allItemKeys));
  }, [allItemKeys]);

  const handleUncheckAll = useCallback(() => {
    setCheckedItems(new Set());
  }, []);

  // Checklist phase
  if (phase === "checklist") {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Progress bar */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-4 border-b border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span className="font-medium text-foreground">
              {currentScore} / {maxScore} {t("portfolio_checklist_points")}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div
            className="h-2.5 rounded-full bg-muted overflow-hidden"
            role="progressbar"
            aria-valuenow={currentScore}
            aria-valuemin={0}
            aria-valuemax={maxScore}
            aria-label={t("portfolio_checklist_result_label")}
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={handleCheckAll}
              className="text-xs text-primary hover:underline"
            >
              {t("portfolio_checklist_select_all")}
            </button>
            <span className="text-xs text-muted-foreground">·</span>
            <button
              type="button"
              onClick={handleUncheckAll}
              className="text-xs text-primary hover:underline"
            >
              {t("portfolio_checklist_clear_all")}
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-6 pb-4">
          {categories.map((cat, catIdx) => {
            const catScore = getCategoryScore(cat, checkedItems);
            const catMax = cat.items.reduce((sum, item) => sum + item.points, 0);
            const isComplete = catScore === catMax;

            return (
              <ScrollReveal key={cat.key} variant="fade-up" delay={catIdx * 50} duration={500}>
                <Card className="p-5 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{CATEGORY_ICONS[cat.key] ?? "📌"}</span>
                      <div>
                        <h3 className="font-display font-semibold text-foreground text-lg">
                          {t(cat.key)}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {catScore}/{catMax} {t("portfolio_checklist_points")}
                          {isComplete && (
                            <span className="ml-1.5 inline-flex items-center gap-1 text-emerald-600 font-medium">
                              <FiCheck size={12} /> {t("portfolio_checklist_complete")}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    {isComplete && (
                      <span className="hidden sm:inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                        <FiCheck size={14} />
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {cat.items.map((item) => {
                      const isChecked = checkedItems.has(item.key);
                      return (
                        <label
                          key={item.key}
                          className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all duration-200 ${
                            isChecked
                              ? "border-primary bg-primary/5"
                              : "border-border bg-background hover:border-primary/30 hover:bg-muted/30"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggle(item.key)}
                            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                          />
                          <div className="flex-1">
                            <span className={`text-sm ${isChecked ? "text-foreground" : "text-muted-foreground"}`}>
                              {t(item.key)}
                            </span>
                            <span className="ml-2 text-xs text-muted-foreground/70 font-medium">
                              +{item.points} pts
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Calculate button */}
        <div className="sticky bottom-4 z-10">
          <button
            type="button"
            onClick={handleCalculate}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
          >
            {t("portfolio_checklist_calculate")}
            <FiArrowRight />
          </button>
          <p className="text-center text-xs text-muted-foreground mt-2">
            {currentScore}/{maxScore} {t("portfolio_checklist_points_selected")}
          </p>
        </div>
      </div>
    );
  }

  // Result phase
  if (!result) return null;

  return (
    <ScrollReveal variant="fade-up" duration={600}>
      <div className="max-w-3xl mx-auto space-y-10 py-4">
        {/* Score Header */}
        <div className="text-center space-y-5">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl text-5xl border-2 bg-primary/10 border-primary/30 text-primary">
            📊
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {t("portfolio_checklist_result_label")}
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              {result.score}/{result.maxScore}
            </h2>
            <p className="text-lg text-muted-foreground">
              {result.percentage}%
            </p>
          </div>

          {/* Level badge */}
          <div className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold ${result.level.colorClass}`}>
            {t(result.level.levelKey)}
          </div>
          <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {t(result.level.descriptionKey)}
          </p>
        </div>

        {/* Improvements */}
        {result.improvements.length > 0 && (
          <Card className="p-6 md:p-8 space-y-5 border-amber-500/20">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span>🎯</span> {t("portfolio_checklist_improvements_title")}
            </h3>
            <div className="space-y-4">
              {result.improvements.map((imp, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white text-sm font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t(imp.itemKey)}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {t(imp.categoryKey)} — +{imp.points} pts
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Summary by category */}
        <Card className="p-6 md:p-8 space-y-5">
          <h3 className="text-lg font-semibold text-foreground">
            {t("portfolio_checklist_summary_title")}
          </h3>
          <div className="space-y-3">
            {categories.map((cat) => {
              const catScore = getCategoryScore(cat, checkedItems);
              const catMax = cat.items.reduce((sum, item) => sum + item.points, 0);
              const catPct = (catScore / catMax) * 100;
              return (
                <div key={cat.key}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-foreground">{t(cat.key)}</span>
                    <span className="text-muted-foreground font-medium">
                      {catScore}/{catMax}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${catPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Download & CTAs */}
        <div className="space-y-4 pt-4">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <FiDownload />
            {t("portfolio_checklist_download")}
          </button>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/recursos/guia-junior"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <FiMap />
              {t("portfolio_checklist_cta_guide")}
            </Link>
            <Link
              to="/recursos/guia-junior"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <FiMap />
              {t("portfolio_checklist_cta_roadmap")}
            </Link>
          </div>

          <button
            type="button"
            onClick={handleRetry}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <FiRefreshCw />
            {t("portfolio_checklist_retry")}
          </button>
        </div>
      </div>
    </ScrollReveal>
  );
}

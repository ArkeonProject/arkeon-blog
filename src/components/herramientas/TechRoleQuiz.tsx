import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiArrowRight, FiCheck, FiDownload, FiExternalLink, FiMap, FiRefreshCw } from "react-icons/fi";
import { Link } from "react-router";
import Card from "@/components/ui/Card";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useLocale } from "@/hooks/useLocale";
import {
  type TechRole,
  calculateRole,
  questions,
  roleResults,
} from "@/utils/techRoleQuiz";

const ROLE_ICONS: Record<TechRole, string> = {
  frontend: "🎨",
  backend: "⚙️",
  qa_manual: "🔍",
  qa_automation: "🤖",
  devops: "🚀",
  data_analyst: "📊",
  cybersecurity: "🛡️",
  product: "📋",
};

const ROLE_COLORS: Record<TechRole, string> = {
  frontend: "bg-sky-500/10 border-sky-500/30 text-sky-600",
  backend: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600",
  qa_manual: "bg-amber-500/10 border-amber-500/30 text-amber-600",
  qa_automation: "bg-violet-500/10 border-violet-500/30 text-violet-600",
  devops: "bg-rose-500/10 border-rose-500/30 text-rose-600",
  data_analyst: "bg-cyan-500/10 border-cyan-500/30 text-cyan-600",
  cybersecurity: "bg-red-500/10 border-red-500/30 text-red-600",
  product: "bg-orange-500/10 border-orange-500/30 text-orange-600",
};

export default function TechRoleQuiz() {
  const { t } = useLocale();
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const resultRole = useMemo(() => {
    if (answers.length < questions.length) return null;
    return calculateRole(answers);
  }, [answers]);

  const resultData = resultRole ? roleResults[resultRole] : null;

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleStart = useCallback(() => {
    setPhase("quiz");
    setCurrentQ(0);
    setAnswers([]);
  }, []);

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      setDirection("next");
      setAnswers((prev) => {
        const next = [...prev];
        next[currentQ] = answerIndex;
        return next;
      });

      if (currentQ < questions.length - 1) {
        timeoutRef.current = window.setTimeout(() => setCurrentQ((q) => q + 1), 250);
      } else {
        timeoutRef.current = window.setTimeout(() => setPhase("result"), 300);
      }
    },
    [currentQ]
  );

  const handleBack = useCallback(() => {
    if (currentQ > 0) {
      setDirection("prev");
      setCurrentQ((q) => q - 1);
    }
  }, [currentQ]);

  const handleRestart = useCallback(() => {
    setPhase("intro");
    setCurrentQ(0);
    setAnswers([]);
  }, []);

  const progress = ((currentQ + (answers[currentQ] !== undefined ? 1 : 0)) / questions.length) * 100;

  if (phase === "intro") {
    return (
      <ScrollReveal variant="fade-up" duration={800}>
        <div className="max-w-2xl mx-auto text-center space-y-8 py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary text-4xl">
            🎯
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              {t("role_quiz_title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              {t("role_quiz_subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted">
              <span>⏱️</span> {t("role_quiz_duration")}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted">
              <span>❓</span> {questions.length} {t("role_quiz_questions_label")}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted">
              <span>🆓</span> {t("role_quiz_free")}
            </span>
          </div>
          <button
            type="button"
            onClick={handleStart}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-lg font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            {t("role_quiz_start")}
            <FiArrowRight />
          </button>
        </div>
      </ScrollReveal>
    );
  }

  if (phase === "quiz") {
    const question = questions[currentQ];
    const selectedAnswer = answers[currentQ];

    return (
      <div className="max-w-2xl mx-auto py-4">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>
              {t("role_quiz_step")} {currentQ + 1} / {questions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <ScrollReveal
          key={currentQ}
          variant={direction === "next" ? "fade-up" : "fade-down"}
          duration={400}
        >
          <div className="space-y-6">
            <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground leading-snug">
              {t(question.key)}
            </h3>

            <div className="grid gap-3">
              {question.answers.map((answer, idx) => {
                const isSelected = selectedAnswer === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAnswer(idx)}
                    className={`text-left w-full rounded-xl border px-5 py-4 text-base transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary/20"
                        : "border-border bg-background hover:border-primary/30 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border"
                        }`}
                      >
                        {isSelected ? <FiCheck size={12} /> : String.fromCharCode(65 + idx)}
                      </span>
                      <span>{t(answer.key)}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {currentQ > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← {t("role_quiz_back")}
              </button>
            )}
          </div>
        </ScrollReveal>
      </div>
    );
  }

  // Result phase
  if (!resultRole || !resultData) return null;

  const roleColor = ROLE_COLORS[resultRole];

  return (
    <ScrollReveal variant="fade-up" duration={600}>
      <div className="max-w-3xl mx-auto space-y-10 py-4">
        {/* Role Header */}
        <div className="text-center space-y-4">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl text-5xl border-2 ${roleColor}`}>
            {ROLE_ICONS[resultRole]}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {t("role_quiz_result_label")}
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              {t(resultData.roleKey)}
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t(resultData.descriptionKey)}
          </p>
        </div>

        {/* Skills */}
        <Card className="p-6 md:p-8 space-y-5">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span>🛠️</span> {t("role_quiz_skills_title")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {resultData.skillsKeys.map((key, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full bg-primary/10 px-3.5 py-1.5 text-sm font-medium text-primary"
              >
                {t(key)}
              </span>
            ))}
          </div>
        </Card>

        {/* 30-day Roadmap */}
        <Card className="p-6 md:p-8 space-y-5">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span>📅</span> {t("role_quiz_roadmap_title")}
          </h3>
          <div className="space-y-4">
            {resultData.roadmap.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {i + 1}
                </div>
                <div>
                  <p className="font-medium text-foreground">{t(step.titleKey)}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{t(step.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Mistakes */}
        <Card className="p-6 md:p-8 space-y-5 border-amber-500/20">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span>⚠️</span> {t("role_quiz_mistakes_title")}
          </h3>
          <ul className="space-y-3">
            {resultData.mistakesKeys.map((key, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5 text-amber-500">•</span>
                {t(key)}
              </li>
            ))}
          </ul>
        </Card>

        {/* Resources */}
        <Card className="p-6 md:p-8 space-y-5">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span>📚</span> {t("role_quiz_resources_title")}
          </h3>
          <div className="grid gap-3">
            {resultData.resources.map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-xl border border-border bg-background p-4 hover:border-primary/30 hover:bg-muted/30 transition-colors"
              >
                <FiExternalLink className="mt-0.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {t(res.titleKey)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">{t(res.descKey)}</p>
                </div>
              </a>
            ))}
          </div>
        </Card>

        {/* CTAs */}
        <div className="space-y-4 pt-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Link
              to="/recursos/guia-junior"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <FiMap />
              {t("role_quiz_cta_guide")}
            </Link>
            <Link
              to="/recursos/guia-junior"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <FiDownload />
              {t("role_quiz_cta_checklist")}
            </Link>
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <FiRefreshCw />
              {t("role_quiz_cta_retry")}
            </button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

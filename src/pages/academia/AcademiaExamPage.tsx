import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/context/AuthContext';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/lib/supabase';
import type { AcademiaExam, AcademiaQuestion } from '@/types/academia';

type ExamPhase = 'loading' | 'intro' | 'in_progress' | 'completed' | 'paywall' | 'error';

interface ExamWithCategory extends AcademiaExam {
  academia_categories: { slug: string; title: string; icon: string };
}

const PASS_THRESHOLD = 65;

export default function AcademiaExamPage() {
  const { t } = useLocale();
  const { category: categorySlug, slug: examSlug } = useParams<{ category: string; slug: string }>();
  const { user, hasAccess } = useAuth();

  const [phase, setPhase] = useState<ExamPhase>('loading');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const startedAt = useRef<string>('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const examFetcher = useCallback(async () => {
    const { data, error } = await supabase
      .from('academia_exams')
      .select('*, academia_categories(slug, title, icon)')
      .eq('slug', examSlug ?? '')
      .single();
    return { data: data as ExamWithCategory | null, error: error as Error | null };
  }, [examSlug]);

  const { data: exam } = useSupabaseQuery(examFetcher);

  const questionsFetcher = useCallback(async () => {
    if (!exam) return { data: null, error: null };
    const { data, error } = await supabase
      .from('academia_questions')
      .select('*')
      .eq('exam_id', exam.id)
      .order('order', { ascending: true });
    return { data: data as AcademiaQuestion[] | null, error: error as Error | null };
  }, [exam]);

  const { data: questions } = useSupabaseQuery(questionsFetcher);

  // Determine phase once exam + questions are loaded
  useEffect(() => {
    if (!exam || !questions) return;
    if (exam.is_premium && (!user || !hasAccess('academia'))) {
      setPhase('paywall');
      return;
    }
    setTimeLeft(exam.time_limit_minutes * 60);
    setPhase('intro');
  }, [exam, questions, user, hasAccess]);

  // Timer
  useEffect(() => {
    if (phase !== 'in_progress') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const startExam = () => {
    startedAt.current = new Date().toISOString();
    setPhase('in_progress');
  };

  const handleAnswer = (questionId: number, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = useCallback(async () => {
    if (!exam || !questions) return;
    clearInterval(timerRef.current!);

    const totalQuestions = questions.length;
    const correct = questions.filter((q) => answers[q.id] === q.correct_answer).length;
    const finalScore = Math.round((correct / totalQuestions) * 100);
    const timeSpent = exam.time_limit_minutes * 60 - timeLeft;

    setScore(finalScore);
    setPhase('completed');

    if (user) {
      await supabase.from('academia_attempts').insert({
        user_id: user.id,
        exam_id: exam.id,
        started_at: startedAt.current,
        completed_at: new Date().toISOString(),
        score: finalScore,
        answers,
        time_spent_seconds: timeSpent,
      });
    }
  }, [exam, questions, answers, timeLeft, user]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (phase === 'loading') {
    return (
      <div className="max-w-5xl mx-auto py-12">
        <div className="h-8 w-64 rounded bg-surface animate-pulse mb-4" />
        <div className="h-48 rounded-xl bg-surface animate-pulse" />
      </div>
    );
  }

  if (phase === 'error' || !exam || !questions) {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center">
        <p className="text-muted-foreground">{t('academia_exam_not_found')}</p>
        <Link to={`/academia/${categorySlug}`} className="mt-4 inline-block text-primary hover:underline">
          ← {t('academia_back')}
        </Link>
      </div>
    );
  }

  if (phase === 'paywall') {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <span className="text-5xl mb-6 block">🔒</span>
        <h1 className="text-2xl font-bold text-foreground mb-3">{t('academia_paywall_title')}</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t('academia_paywall_desc')}</p>
        <Link
          to="/academia"
          className="inline-block px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          {t('academia_cta_buy')}
        </Link>
        <div className="mt-4">
          <Link to={`/academia/${categorySlug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← {t('academia_back')}
          </Link>
        </div>
      </div>
    );
  }

  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <Link to={`/academia/${categorySlug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors mb-8 inline-block">
          ← {t('academia_back')}
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-3">{exam.title}</h1>
        <p className="text-muted-foreground mb-8">{exam.description}</p>
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
          <div className="p-4 rounded-xl bg-surface border border-border text-center">
            <p className="text-2xl font-bold text-foreground">{questions.length}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('academia_intro_questions')}</p>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border text-center">
            <p className="text-2xl font-bold text-foreground">{exam.time_limit_minutes}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('academia_intro_minutes')}</p>
          </div>
        </div>
        <button
          onClick={startExam}
          className="px-10 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-lg"
        >
          {t('academia_exam_start')}
        </button>
        <p className="mt-4 text-xs text-muted-foreground">{t('academia_intro_warning')}</p>
      </div>
    );
  }

  if (phase === 'completed' && score !== null) {
    const passed = score >= PASS_THRESHOLD;
    const correct = questions.filter((q) => answers[q.id] === q.correct_answer).length;

    return (
      <div className="max-w-3xl mx-auto py-12">
        {/* Result header */}
        <div className={`p-8 rounded-2xl text-center mb-10 border-2 ${
          passed ? 'border-green-500 bg-green-500/5' : 'border-red-500 bg-red-500/5'
        }`}>
          <p className="text-5xl mb-4">{passed ? '🎉' : '📚'}</p>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {passed ? t('academia_result_pass') : t('academia_result_fail')}
          </h1>
          <p className="text-5xl font-bold text-foreground my-4">{score}%</p>
          <p className="text-muted-foreground">
            {correct} / {questions.length} {t('academia_result_correct')}
          </p>
        </div>

        {/* Question review */}
        <h2 className="text-xl font-semibold text-foreground mb-6">{t('academia_result_review')}</h2>
        <div className="space-y-6">
          {questions.map((q, i) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correct_answer;
            return (
              <div key={q.id} className={`p-6 rounded-xl border ${
                isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'
              }`}>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  {t('academia_question')} {i + 1}
                </p>
                <p className="font-medium text-foreground mb-4">{q.question}</p>
                <div className="space-y-2 mb-4">
                  {q.options.map((opt) => {
                    const isSelected = userAnswer === opt.id;
                    const isRight = opt.id === q.correct_answer;
                    return (
                      <div key={opt.id} className={`px-4 py-2.5 rounded-lg text-sm font-medium border ${
                        isRight
                          ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400'
                          : isSelected
                            ? 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400'
                            : 'border-border text-muted-foreground'
                      }`}>
                        <span className="font-bold mr-2">{opt.id.toUpperCase()}.</span>
                        {opt.text}
                        {isRight && <span className="ml-2">✓</span>}
                        {isSelected && !isRight && <span className="ml-2">✗</span>}
                      </div>
                    );
                  })}
                </div>
                {q.explanation && (
                  <div className="mt-3 p-3 rounded-lg bg-surface border border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                      {t('academia_explanation')}
                    </p>
                    <p className="text-sm text-foreground">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button
            onClick={() => {
              setAnswers({});
              setCurrentIndex(0);
              setScore(null);
              setTimeLeft(exam.time_limit_minutes * 60);
              setPhase('intro');
            }}
            className="flex-1 px-6 py-3 border border-border rounded-xl font-semibold text-foreground hover:bg-surface-hover transition-colors"
          >
            {t('academia_exam_retry')}
          </button>
          <Link
            to={`/academia/${categorySlug}`}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-center"
          >
            {t('academia_back_category')}
          </Link>
        </div>
      </div>
    );
  }

  // in_progress
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQuestions;
  const timerWarning = timeLeft <= 60;

  return (
    <div className="max-w-5xl mx-auto py-6">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-surface border border-border">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground hidden sm:block">{exam.title}</span>
          <span className="text-sm text-muted-foreground">
            {answeredCount}/{totalQuestions} {t('academia_answered')}
          </span>
        </div>
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono font-bold text-sm ${
          timerWarning ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-surface-hover text-foreground'
        }`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Question panel — desktop sidebar */}
        <aside className="hidden md:block w-40 shrink-0">
          <div className="sticky top-28 p-3 rounded-xl bg-surface border border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-3 text-center">
              {t('academia_panel_title')}
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {questions.map((q, i) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = i === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-full aspect-square rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : isAnswered
                          ? 'bg-green-500/20 text-green-600 hover:bg-green-500/30'
                          : 'bg-surface-hover text-muted-foreground hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main question area */}
        <div className="flex-1 min-w-0">
          {/* Mobile question strip */}
          <div className="md:hidden flex gap-1.5 overflow-x-auto pb-2 mb-4">
            {questions.map((q, i) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = i === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`shrink-0 w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : isAnswered
                        ? 'bg-green-500/20 text-green-600'
                        : 'bg-surface-hover text-muted-foreground'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <div className="p-6 rounded-xl bg-surface border border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-4">
              {t('academia_question')} {currentIndex + 1} {t('academia_of')} {totalQuestions}
            </p>
            <p className="text-lg font-medium text-foreground mb-6">{currentQuestion.question}</p>

            <div className="space-y-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswer(currentQuestion.id, opt.id)}
                    className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm font-medium transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-surface-hover hover:border-primary/30 hover:bg-primary/5 text-foreground'
                    }`}
                  >
                    <span className="font-bold mr-3">{opt.id.toUpperCase()}.</span>
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-border hover:bg-surface-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← {t('academia_prev')}
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {t('academia_next')} →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {allAnswered ? t('academia_submit') : `${t('academia_submit_pending')} (${totalQuestions - answeredCount})`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

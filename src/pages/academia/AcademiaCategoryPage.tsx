import { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/context/AuthContext';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/lib/supabase';
import type { AcademiaCategory, AcademiaExam, AcademiaAttempt } from '@/types/academia';

export default function AcademiaCategoryPage() {
  const { t } = useLocale();
  const { category: categorySlug } = useParams<{ category: string }>();
  const { user, hasAccess } = useAuth();

  const hasAcademiaAccess = user && hasAccess('academia');

  const categoryFetcher = useCallback(async () => {
    const { data, error } = await supabase
      .from('academia_categories')
      .select('*')
      .eq('slug', categorySlug ?? '')
      .single();
    return { data: data as AcademiaCategory | null, error: error as Error | null };
  }, [categorySlug]);

  const { data: category, loading: categoryLoading } = useSupabaseQuery(categoryFetcher);

  const examsFetcher = useCallback(async () => {
    if (!category?.id) return { data: null, error: null };
    const { data, error } = await supabase
      .from('academia_exams')
      .select('*')
      .eq('category_id', category.id)
      .order('id', { ascending: true });
    return { data: data as AcademiaExam[] | null, error: error as Error | null };
  }, [category?.id]);

  const { data: exams } = useSupabaseQuery(examsFetcher);

  const attemptsFetcher = useCallback(async () => {
    if (!user || !exams?.length) return { data: null, error: null };
    const examIds = exams.map((e) => e.id);
    const { data, error } = await supabase
      .from('academia_attempts')
      .select('id, exam_id, score, completed_at')
      .eq('user_id', user.id)
      .in('exam_id', examIds)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false });
    return { data: data as Pick<AcademiaAttempt, 'id' | 'exam_id' | 'score' | 'completed_at'>[] | null, error: error as Error | null };
  }, [user, exams]);

  const { data: attempts } = useSupabaseQuery(attemptsFetcher);

  const bestScoreForExam = (examId: number): number | null => {
    const examAttempts = attempts?.filter((a) => a.exam_id === examId && a.score !== null) ?? [];
    if (!examAttempts.length) return null;
    return Math.max(...examAttempts.map((a) => a.score!));
  };

  if (categoryLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="h-8 w-48 rounded bg-surface animate-pulse mb-4" />
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-36 rounded-xl bg-surface animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <p className="text-muted-foreground">{t('academia_category_not_found')}</p>
        <Link to="/academia" className="mt-4 inline-block text-primary hover:underline">
          {t('academia_back')}
        </Link>
      </div>
    );
  }

  const freeExams = exams?.filter((e) => !e.is_premium) ?? [];
  const premiumExams = exams?.filter((e) => e.is_premium) ?? [];

  return (
    <div className="max-w-4xl mx-auto py-12">
      <Helmet>
        <title>{category.title} | Academia Arkeonix</title>
      </Helmet>

      <Link to="/academia" className="text-sm text-muted-foreground hover:text-primary transition-colors mb-6 inline-block">
        ← {t('academia_back')}
      </Link>

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{category.icon}</span>
          <h1 className="text-3xl font-bold text-foreground">{category.title}</h1>
        </div>
        <p className="text-muted-foreground">{category.description}</p>
      </header>

      {/* Free exams */}
      {freeExams.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-bold uppercase bg-green-500/10 text-green-600 rounded-full">
              {t('academia_free')}
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {freeExams.map((exam) => {
              const best = bestScoreForExam(exam.id);
              return (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  categorySlug={category.slug}
                  bestScore={best}
                  locked={false}
                  t={t}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Premium exams */}
      {premiumExams.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-bold uppercase bg-primary/10 text-primary rounded-full">
              {t('academia_premium')}
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {premiumExams.map((exam) => {
              const best = bestScoreForExam(exam.id);
              return (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  categorySlug={category.slug}
                  bestScore={best}
                  locked={!hasAcademiaAccess}
                  t={t}
                />
              );
            })}
          </div>
          {!hasAcademiaAccess && (
            <div className="mt-6 p-5 rounded-xl border border-primary/30 bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">{t('academia_paywall_inline')}</p>
              <Link
                to="/academia"
                className="shrink-0 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                {t('academia_cta_buy')}
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

interface ExamCardProps {
  exam: AcademiaExam;
  categorySlug: string;
  bestScore: number | null;
  locked: boolean;
  t: (key: string) => string;
}

function ExamCard({ exam, categorySlug, bestScore, locked, t }: ExamCardProps) {
  const content = (
    <div className={`p-6 rounded-xl border transition-all duration-200 ${
      locked
        ? 'border-border bg-surface opacity-60 cursor-not-allowed'
        : 'border-border bg-surface hover:bg-surface-hover hover:border-primary/30 cursor-pointer'
    }`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-foreground">{exam.title}</h3>
        {locked && <span className="text-lg">🔒</span>}
      </div>
      <p className="text-sm text-muted-foreground mb-4">{exam.description}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>⏱ {exam.time_limit_minutes} min</span>
        {bestScore !== null ? (
          <span className="font-semibold text-green-600">
            {t('academia_best_score')}: {bestScore}%
          </span>
        ) : (
          <span>{t('academia_not_attempted')}</span>
        )}
      </div>
    </div>
  );

  if (locked) return content;

  return (
    <Link to={`/academia/${categorySlug}/${exam.slug}`}>
      {content}
    </Link>
  );
}

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
  const { user } = useAuth();

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

      <section>
        <div className="grid md:grid-cols-2 gap-4">
          {(exams ?? []).map((exam) => {
            const best = bestScoreForExam(exam.id);
            return (
              <ExamCard
                key={exam.id}
                exam={exam}
                categorySlug={category.slug}
                bestScore={best}
                t={t}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

interface ExamCardProps {
  exam: AcademiaExam;
  categorySlug: string;
  bestScore: number | null;
  t: (key: string) => string;
}

function ExamCard({ exam, categorySlug, bestScore, t }: ExamCardProps) {
  return (
    <Link to={`/academia/${categorySlug}/${exam.slug}`} className="h-full">
      <div className="flex flex-col h-full p-6 rounded-xl border transition-all duration-200 border-border bg-surface hover:bg-surface-hover hover:border-primary/30 cursor-pointer">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-foreground">{exam.title}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4 flex-1">{exam.description}</p>
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
    </Link>
  );
}

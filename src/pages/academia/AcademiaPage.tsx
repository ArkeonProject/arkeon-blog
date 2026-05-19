import { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { useLocale } from '@/hooks/useLocale';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/ui/PageHero';
import type { AcademiaCategory } from '@/types/academia';
import { OPEN_SOURCE_MODE } from '@/config/monetization';

type CategoryWithCount = AcademiaCategory & {
  exams: { count: number }[];
};

export default function AcademiaPage() {
  const { t } = useLocale();

  const fetcher = useCallback(async () => {
    const { data, error } = await supabase
      .from('academia_categories')
      .select('*, exams:academia_exams(count)')
      .order('order', { ascending: true });
    return { data: data as CategoryWithCount[] | null, error: error as Error | null };
  }, []);

  const { data: categories, loading } = useSupabaseQuery(fetcher);

  return (
    <div className="max-w-4xl mx-auto py-12">
      <Helmet>
        <title>{t('academia_meta_title')} | Arkeonix Labs</title>
        <meta name="description" content={t('academia_meta_desc')} />
        <link rel="canonical" href="https://www.arkeonixlabs.com/academia" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${t('academia_meta_title')} | Arkeonix Labs`} />
        <meta property="og:description" content={t('academia_meta_desc')} />
        <meta property="og:url" content="https://www.arkeonixlabs.com/academia" />
        <meta property="og:image" content="https://www.arkeonixlabs.com/arkeonix-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('academia_meta_title')} | Arkeonix Labs`} />
        <meta name="twitter:description" content={t('academia_meta_desc')} />
        <meta name="twitter:image" content="https://www.arkeonixlabs.com/arkeonix-logo.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": t('academia_meta_title'),
            "description": t('academia_meta_desc'),
            "brand": { "@type": "Brand", "name": "Arkeonix Labs" },
            "url": "https://www.arkeonixlabs.com/academia",
            "image": "https://www.arkeonixlabs.com/arkeonix-logo.png",
            ...(OPEN_SOURCE_MODE
              ? {}
              : {
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "5",
                  "reviewCount": "3"
                },
                "review": [
                  { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5" }, "author": { "@type": "Person", "name": "Miguel A." } },
                  { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5" }, "author": { "@type": "Person", "name": "Lucía V." } },
                  { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5" }, "author": { "@type": "Person", "name": "Pablo R." } }
                ]
              })
          })}
        </script>
      </Helmet>

      {/* Hero */}
      <PageHero
        badge={t('academia_badge')}
        title={t('academia_title_part1')}
        titleHighlight={t('academia_title_part2')}
        description={t('academia_subtitle')}
      />

      {/* Categories */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#007EAD] dark:text-[#00aaff] mb-6 text-center">
          {t('academia_categories_title')}
        </h2>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-surface animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {categories?.map((cat) => {
              const examCount = cat.exams?.[0]?.count ?? 0;
              return (
                <Link
                  key={cat.slug}
                  to={`/academia/${cat.slug}`}
                  className="group p-6 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-primary/30 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        {examCount > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {examCount} {t('academia_exams_label')}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-muted-foreground group-hover:text-primary transition-colors text-lg shrink-0">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA Guía Junior */}
      <section className="mb-16 p-6 rounded-xl border border-border bg-surface flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="font-semibold text-foreground">{t('cta_guia_from_academia_title')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('cta_guia_from_academia_desc')}</p>
        </div>
        <Link
          to="/recursos/guia-junior"
          className="shrink-0 px-5 py-2.5 border border-border bg-surface hover:bg-surface-hover text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
        >
          {t('cta_guia_from_academia_btn')}
        </Link>
      </section>

      {/* Reviews */}
      {!OPEN_SOURCE_MODE && (
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#007EAD] dark:text-[#00aaff] mb-8 text-center">
          {t('academia_reviews_title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {([1, 2, 3] as const).map((i) => (
            <div key={i} className="p-6 rounded-xl border border-border bg-surface flex flex-col gap-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <span key={s} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                "{t(`academia_review${i}_text`)}"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-border/40">
                <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center font-bold text-primary text-xs font-mono shrink-0">
                  {t(`academia_review${i}_name`).charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t(`academia_review${i}_name`)}</p>
                  <p className="text-xs text-muted-foreground">{t(`academia_review${i}_role`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

    </div>
  );
}

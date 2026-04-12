import { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/context/AuthContext';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/lib/supabase';
import type { AcademiaCategory } from '@/types/academia';

type CategoryWithCount = AcademiaCategory & {
  exams: { count: number }[];
};

const PRICE_ACADEMIA_LIFETIME = import.meta.env.VITE_STRIPE_PRICE_ACADEMIA_LIFETIME;

export default function AcademiaPage() {
  const { t } = useLocale();
  const { user, hasAccess } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const hasAcademiaAccess = user && hasAccess('academia');

  const fetcher = useCallback(async () => {
    const { data, error } = await supabase
      .from('academia_categories')
      .select('*, exams:academia_exams(count)')
      .order('order', { ascending: true });
    return { data: data as CategoryWithCount[] | null, error: error as Error | null };
  }, []);

  const { data: categories, loading } = useSupabaseQuery(fetcher);

  const handleCheckout = async () => {
    if (!PRICE_ACADEMIA_LIFETIME) {
      setCheckoutError(t('academia_checkout_error_config'));
      return;
    }
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const res = await fetch('/api/academia-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: PRICE_ACADEMIA_LIFETIME,
          ...(user ? { userId: user.id, email: user.email } : {}),
        }),
      });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setCheckoutError(t('academia_checkout_error'));
    } finally {
      setCheckoutLoading(false);
    }
  };

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
            "offers": {
              "@type": "Offer",
              "price": "19",
              "priceCurrency": "EUR",
              "availability": "https://schema.org/InStock",
              "url": "https://www.arkeonixlabs.com/academia"
            },
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
          })}
        </script>
      </Helmet>

      {/* Hero */}
      <header className="text-center mb-16">
        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-4">
          {t('academia_badge')}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-[#007EAD] via-[#00aaff] to-[#007EAD] bg-clip-text text-transparent mb-6 leading-tight">
          {t('academia_title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {t('academia_subtitle')}
        </p>
        {hasAcademiaAccess && (
          <span className="inline-block mt-6 px-4 py-1.5 text-sm font-semibold text-green-600 bg-green-500/10 rounded-full border border-green-500/20">
            {t('academia_access_active')}
          </span>
        )}
      </header>

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
                        <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full font-medium">
                          {t('academia_free_preview')}
                        </span>
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
          to="/guia-junior"
          className="shrink-0 px-5 py-2.5 border border-border bg-surface hover:bg-surface-hover text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
        >
          {t('cta_guia_from_academia_btn')}
        </Link>
      </section>

      {/* Reviews */}
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

      {/* Pricing — solo si no tiene acceso */}
      {!hasAcademiaAccess && (
        <section className="p-8 rounded-2xl border-2 border-primary bg-primary/5 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {t('academia_pricing_title')}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            {t('academia_pricing_desc')}
          </p>
          <p className="text-4xl font-bold text-foreground mb-1">
            {t('academia_pricing_price')}
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            {t('academia_pricing_period')}
          </p>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {checkoutLoading ? '...' : t('academia_cta_buy')}
          </button>
          {checkoutError && (
            <p className="mt-4 text-sm text-red-500">{checkoutError}</p>
          )}
          <p className="mt-4 text-xs text-muted-foreground">{t('academia_pricing_note')}</p>
        </section>
      )}
    </div>
  );
}

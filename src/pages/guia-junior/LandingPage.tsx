import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/context/AuthContext';
import { chapters } from '@/data/guia/chapters';
import ScrollReveal from '@/components/ui/ScrollReveal';

const PRICE_LIFETIME = import.meta.env.VITE_STRIPE_PRICE_GUIA_LIFETIME;
const PRICE_B2B_LIFETIME = import.meta.env.VITE_STRIPE_PRICE_GUIA_B2B_LIFETIME;

export default function GuiaLandingPage() {
  const { t } = useLocale();
  const { user, hasAccess } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const alreadyHasAccess = user && hasAccess('guia_junior');

  const handleCheckout = async (priceId: string, plan: string) => {
    if (!priceId) {
      setCheckoutError('Error de configuración: priceId no definido. Contacta con soporte.');
      return;
    }

    setCheckoutLoading(plan);
    setCheckoutError(null);
    try {
      const res = await fetch('/api/guia-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          ...(user ? { userId: user.id, email: user.email } : {}),
        }),
      });

      console.log('Checkout response status:', res.status);

      if (!res.ok) {
        const errBody = await res.text();
        console.error('Checkout failed:', errBody);
        throw new Error(`Checkout failed (${res.status}): ${errBody}`);
      }

      const { url } = await res.json();
      console.log('Checkout URL:', url);
      if (url) window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError(err instanceof Error ? err.message : t('guia_landing_checkout_error'));
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <Helmet>
        <title>{t('guia_landing_meta_title')} | Arkeonix Labs</title>
        <meta name="description" content={t('guia_landing_meta_desc')} />
        <link rel="canonical" href="https://www.arkeonixlabs.com/guia-junior" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${t('guia_landing_meta_title')} | Arkeonix Labs`} />
        <meta property="og:description" content={t('guia_landing_meta_desc')} />
        <meta property="og:url" content="https://www.arkeonixlabs.com/guia-junior" />
        <meta property="og:site_name" content="Arkeonix Labs" />
        <meta property="og:image" content="https://www.arkeonixlabs.com/arkeonix-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('guia_landing_meta_title')} | Arkeonix Labs`} />
        <meta name="twitter:description" content={t('guia_landing_meta_desc')} />
        <meta name="twitter:image" content="https://www.arkeonixlabs.com/arkeonix-logo.png" />
      </Helmet>

      {/* Hero */}
      <ScrollReveal variant="blur" duration={800}>
        <header className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-4">
            {t('guia_landing_badge')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-[#007EAD] via-[#00aaff] to-[#007EAD] bg-clip-text text-transparent mb-6 leading-tight">
            {t('guia_landing_title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('guia_landing_subtitle')}
          </p>
          {alreadyHasAccess ? (
            <Link
              to="/guia-junior/dashboard"
              className="inline-block px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-lg"
            >
              {t('guia_landing_cta_dashboard')}
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/guia-junior/capitulo/antes-de-empezar"
                className="inline-block px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-lg"
              >
                {t('guia_landing_cta_free')}
              </Link>
              {user ? (
                <Link
                  to="/guia-junior/dashboard"
                  className="inline-block px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-lg"
                >
                  {t('guia_landing_cta_access')}
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="inline-block px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-lg"
                >
                  {t('guia_landing_cta_register')}
                </Link>
              )}
            </div>
          )}
        </header>
      </ScrollReveal>

      {/* Who is this for */}
      <ScrollReveal variant="fade-up">
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[#007EAD] dark:text-[#00aaff] mb-6 text-center">
            {t('guia_landing_who_title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {(['student', 'graduate', 'career_change', 'early_junior'] as const).map((key) => (
              <div key={key} className="p-5 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
                <p className="text-gray-700 dark:text-gray-300">
                  {t(`guia_landing_who_${key}`)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* What's inside */}
      <ScrollReveal variant="fade-up" delay={100}>
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[#007EAD] dark:text-[#00aaff] mb-6 text-center">
            {t('guia_landing_content_title')}
          </h2>
          <div className="space-y-3">
            {chapters.map((ch) => (
              <div
                key={ch.slug}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-surface"
              >
                <span className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                  {ch.index}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{t(ch.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(ch.descKey)}</p>
                </div>
                {ch.free && (
                  <span className="shrink-0 text-xs font-semibold text-primary uppercase">
                    {t('guia_dashboard_free')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* What makes this different */}
      <ScrollReveal variant="fade-up" delay={150}>
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[#007EAD] dark:text-[#00aaff] mb-6 text-center">
            {t('guia_landing_diff_title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {(['real_data', 'no_smoke', 'spain_focus'] as const).map((key) => (
              <div key={key} className="text-center p-6 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
                <h3 className="font-semibold text-foreground mb-2">
                  {t(`guia_landing_diff_${key}_title`)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t(`guia_landing_diff_${key}_desc`)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Pricing */}
      <ScrollReveal variant="zoom-in" duration={800}>
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[#007EAD] dark:text-[#00aaff] mb-6 text-center">
            {t('guia_landing_pricing_title')}
          </h2>
          <div className="flex justify-center">
            <div className="w-full max-w-sm p-6 rounded-xl border-2 border-primary bg-primary/5 text-center relative flex flex-col">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-semibold uppercase bg-primary text-primary-foreground rounded-full">
                {t('guia_landing_plan_popular')}
              </span>
              <h3 className="font-semibold text-foreground mb-1">{t('guia_landing_plan_lifetime')}</h3>
              <p className="text-3xl font-bold text-foreground mb-1">19&euro;</p>
              <p className="text-xs font-semibold text-amber-500 dark:text-amber-400 mb-1">{t('guia_landing_plan_lifetime_launch_badge')}</p>
              <p className="text-sm text-muted-foreground mb-4">{t('guia_landing_plan_lifetime_period')}</p>
              <p className="text-sm text-muted-foreground mb-6">{t('guia_landing_plan_lifetime_desc')}</p>
              <button
                onClick={() => handleCheckout(PRICE_LIFETIME, 'lifetime')}
                disabled={checkoutLoading !== null}
                className="mt-auto w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading === 'lifetime'
                  ? '...'
                  : alreadyHasAccess
                    ? t('guia_landing_cta_dashboard')
                    : t('guia_landing_plan_cta')}
              </button>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('guia_landing_pricing_note')}
          </p>
          {checkoutError && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm text-center">
              {checkoutError}
            </div>
          )}
        </section>
      </ScrollReveal>

      {/* B2B Pricing */}
      <ScrollReveal variant="zoom-in" duration={800}>
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[#007EAD] dark:text-[#00aaff] mb-3 text-center">
            {t('guia_landing_b2b_title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto mb-8">
            {t('guia_landing_b2b_subtitle')}
          </p>
          <div className="flex justify-center">
            <div className="w-full max-w-sm p-6 rounded-xl border-2 border-primary bg-primary/5 text-center relative flex flex-col">
              <h3 className="font-semibold text-foreground mb-1">{t('guia_landing_b2b_plan_lifetime')}</h3>
              <p className="text-3xl font-bold text-foreground mb-1">299&euro;</p>
              <p className="text-sm text-muted-foreground mb-4">{t('guia_landing_b2b_plan_lifetime_period')}</p>
              <p className="text-sm text-muted-foreground mb-6">{t('guia_landing_b2b_plan_lifetime_desc')}</p>
              <button
                onClick={() => handleCheckout(PRICE_B2B_LIFETIME, 'b2b_lifetime')}
                disabled={checkoutLoading !== null}
                className="mt-auto w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading === 'b2b_lifetime'
                  ? '...'
                  : t('guia_landing_b2b_cta')}
              </button>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* B2B How it works */}
      <ScrollReveal variant="fade-up" delay={100}>
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[#007EAD] dark:text-[#00aaff] mb-6 text-center">
            {t('guia_landing_b2b_how_title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {(['1', '2', '3'] as const).map((step) => (
              <div key={step} className="text-center p-6 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t(`guia_landing_b2b_how_${step}_title`)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t(`guia_landing_b2b_how_${step}_desc`)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Bottom CTA */}
      <ScrollReveal variant="fade-up">
        <section className="text-center p-8 bg-linear-to-r from-[#007EAD]/10 to-[#00aaff]/10 rounded-2xl">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {t('guia_landing_bottom_cta_title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-lg mx-auto">
            {t('guia_landing_bottom_cta_desc')}
          </p>
          <Link
            to={alreadyHasAccess ? '/guia-junior/dashboard' : '/guia-junior/capitulo/antes-de-empezar'}
            className="inline-block px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-lg"
          >
            {alreadyHasAccess ? t('guia_landing_cta_dashboard') : t('guia_landing_cta_free')}
          </Link>
        </section>
      </ScrollReveal>
    </div>
  );
}

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/hooks/useLocale';
import { Link } from 'react-router';
import { chapters } from '@/data/guia/chapters';

export default function GuiaDashboardPage() {
  const { user, access } = useAuth();
  const { t } = useLocale();
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  const isSubscriber = access.some(
    (a) => a.product_id === 'guia_junior' && (a.plan === 'monthly' || a.plan === 'annual')
  );

  const handleManageSubscription = async () => {
    if (!user) return;
    setPortalLoading(true);
    setPortalError(null);
    try {
      const res = await fetch('/api/customer-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setPortalError(t('guia_dashboard_manage_sub_error'));
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-display font-bold text-foreground mb-2">
        {t('guia_dashboard_title')}
      </h1>
      <p className="text-muted-foreground mb-8">
        {t('guia_dashboard_welcome')}, {user?.email}. {t('guia_dashboard_select_chapter')}.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {chapters.map((ch) => (
          <Link
            key={ch.slug}
            to={`/guia-junior/capitulo/${ch.slug}`}
            className="block p-6 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors"
          >
            <span className="text-xs font-semibold text-primary uppercase">
              {ch.free ? t('guia_dashboard_free') : t('guia_dashboard_premium')}
            </span>
            <h3 className="text-lg font-semibold text-foreground mt-1">
              {t(ch.titleKey)}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {t(ch.descKey)}
            </p>
          </Link>
        ))}
      </div>

      {isSubscriber && (
        <div className="mt-10 p-5 rounded-xl border border-border bg-surface flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-semibold text-foreground">{t('guia_dashboard_manage_sub')}</p>
            <p className="text-sm text-muted-foreground">{t('guia_dashboard_manage_sub_desc')}</p>
            {portalError && (
              <p className="text-sm text-red-500 mt-1">{portalError}</p>
            )}
          </div>
          <button
            onClick={handleManageSubscription}
            disabled={portalLoading}
            className="shrink-0 px-5 py-2.5 text-sm font-semibold rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {portalLoading ? t('guia_dashboard_manage_sub_loading') : t('guia_dashboard_manage_sub')}
          </button>
        </div>
      )}
    </div>
  );
}

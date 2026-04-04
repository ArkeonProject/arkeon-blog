import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/hooks/useLocale';
import { Link } from 'react-router-dom';
import { chapters } from '@/data/guia/chapters';

export default function GuiaDashboardPage() {
  const { user } = useAuth();
  const { t } = useLocale();

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
    </div>
  );
}

import { Link } from 'react-router';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/context/AuthContext';

export default function AcademiaThanksPage() {
  const { t } = useLocale();
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">
          {t('guia_thanks_title')}
        </h1>
        {user ? (
          <>
            <p className="text-muted-foreground mb-6">
              {t('academia_thanks_message')}
            </p>
            <Link
              to="/academia"
              className="inline-block py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              {t('academia_thanks_cta')}
            </Link>
          </>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              {t('guia_thanks_guest_message')}
            </p>
            <Link
              to="/register"
              className="inline-block py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              {t('guia_thanks_guest_cta')}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

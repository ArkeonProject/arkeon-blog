import { useLocale } from '@/hooks/useLocale';

export default function GuiaThanksPage() {
  const { t } = useLocale();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">
          {t('guia_thanks_title')}
        </h1>
        <p className="text-muted-foreground mb-6">
          {t('guia_thanks_message')}
        </p>
        <a
          href="/guia-junior/dashboard"
          className="inline-block py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          {t('guia_thanks_cta')}
        </a>
      </div>
    </div>
  );
}
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useLocale } from '@/hooks/useLocale';

export default function ResetPasswordPage() {
  const { t } = useLocale();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] py-12">
        <div className="w-full max-w-md text-center">
          <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20">
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              {t('auth_reset_success_title')}
            </h2>
            <p className="text-muted-foreground">
              {t('auth_reset_success_message')}
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
            >
              {t('auth_reset_success_link')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">
            {t('auth_reset_title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('auth_reset_subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              {t('auth_login_email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder={t('auth_login_email_placeholder')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? t('auth_reset_submitting') : t('auth_reset_submit')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/login" className="text-primary font-semibold hover:underline">
            {t('auth_reset_back')}
          </Link>
        </div>
      </div>
    </div>
  );
}
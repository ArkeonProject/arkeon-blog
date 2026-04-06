import { useParams, Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { getChapterBySlug, getAdjacentChapters } from '@/data/guia/chapters';
import Chapter0 from '@/data/guia/chapter-0';
import ChapterContentRenderer from '@/components/guia/ChapterContentRenderer';

interface ChapterData {
  slug: string;
  title: string;
  content: Record<string, unknown>;
  is_free: boolean;
  order: number;
}

const FREE_CHAPTERS = ['antes-de-empezar'];

export default function GuiaChapterPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLocale();
  const { user, hasAccess } = useAuth();
  const navigate = useNavigate();
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chapter = slug ? getChapterBySlug(slug) : undefined;
  const { prev, next } = slug ? getAdjacentChapters(slug) : { prev: null, next: null };

  const isFree = slug ? FREE_CHAPTERS.includes(slug) : false;

  useEffect(() => {
    if (!slug) return;

    if (isFree) {
      setChapterData(null);
      setLoading(false);
      return;
    }

    if (!user || !hasAccess('guia_junior')) {
      navigate('/guia-junior');
      return;
    }

    let cancelled = false;

    async function fetchChapter() {
      setLoading(true);
      setError(null);

      const { data, error: dbError } = await supabase
        .from('guia_chapters')
        .select('slug, title, content, is_free, order')
        .eq('slug', slug)
        .single();

      if (cancelled) return;

      if (dbError) {
        if (dbError.code === 'PGRST116') {
          setError('not_found');
        } else if (dbError.code === '42501') {
          setError('access_denied');
        } else {
          setError('generic');
        }
        setLoading(false);
        return;
      }

      setChapterData(data as ChapterData);
      setLoading(false);
    }

    fetchChapter();

    return () => { cancelled = true; };
  }, [slug, isFree, user, navigate, hasAccess]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error === 'not_found' || !chapter) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">
            {t('guia_chapter_not_found_title')}
          </h1>
          <Link to="/guia-junior/dashboard" className="text-primary hover:underline">
            {t('guia_chapter_back_index')}
          </Link>
        </div>
      </div>
    );
  }

  if (error === 'access_denied') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">
            Contenido premium
          </h1>
          <p className="text-muted-foreground mb-6">
            Necesitas acceso activo a la Guia Junior para leer este capitulo.
          </p>
          <Link
            to="/guia-junior"
            className="inline-block py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Ver planes →
          </Link>
        </div>
      </div>
    );
  }

  const chapterTitle = chapterData?.title || (chapter ? t(chapter.titleKey) : '');
  const chapterDesc = isFree
    ? 'Capítulo gratuito de la Guía para Juniors: qué hacer después de tu curso de programación en España.'
    : `Capítulo ${chapter?.index || ''} de la Guía para Juniors.`;
  const canonicalUrl = `https://www.arkeonixlabs.com/guia-junior/capitulo/${slug}`;

  return (
    <div className="py-10 max-w-4xl mx-auto px-4">
      <Helmet>
        <title>{chapterTitle ? `${chapterTitle} | Guía Junior | Arkeonix Labs` : 'Guía Junior | Arkeonix Labs'}</title>
        <meta name="description" content={chapterDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={chapterTitle || 'Guía Junior | Arkeonix Labs'} />
        <meta property="og:description" content={chapterDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Arkeonix Labs" />
        <meta property="og:image" content="https://www.arkeonixlabs.com/arkeonix-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={chapterTitle || 'Guía Junior | Arkeonix Labs'} />
        <meta name="twitter:description" content={chapterDesc} />
        <meta name="twitter:image" content="https://www.arkeonixlabs.com/arkeonix-logo.png" />
      </Helmet>
      <div className="mb-10">
        <Link to="/guia-junior/dashboard" className="text-base text-muted-foreground hover:text-primary transition-colors">
          {t('guia_chapter_back_index')}
        </Link>
        <h1 className="text-4xl font-display font-bold text-foreground mt-4 leading-tight">
          {chapterData?.title || t(chapter.titleKey)}
        </h1>
        {!isFree && chapterData?.is_free === false && (
          <span className="inline-block mt-3 text-sm font-bold text-accent uppercase tracking-wider">Premium</span>
        )}
      </div>

      <div className="text-base leading-relaxed">
        {isFree && <Chapter0 />}

        {chapterData && chapterData.is_free === false && chapterData.content && (
          <ChapterContentRenderer content={chapterData.content as unknown as { sections: Array<{ type: string; [key: string]: unknown }> }} />
        )}
      </div>

      <div className="mt-12 flex justify-between border-t border-border pt-6">
        {prev ? (
          <Link
            to={`/guia-junior/capitulo/${prev.slug}`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {t('guia_chapter_prev')}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/guia-junior/capitulo/${next.slug}`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {t('guia_chapter_next')}
          </Link>
        ) : (
          <Link
            to="/guia-junior/dashboard"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {t('guia_chapter_back_index')}
          </Link>
        )}
      </div>
    </div>
  );
}

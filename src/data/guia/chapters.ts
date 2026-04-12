import type { ComponentType } from 'react';

export interface ChapterMeta {
  slug: string;
  index: number;
  titleKey: string;
  descKey: string;
  free: boolean;
}

export const chapters: ChapterMeta[] = [
  { slug: 'antes-de-empezar', index: 0, titleKey: 'guia_chapter_0_title', descKey: 'guia_chapter_0_desc', free: true },
  { slug: 'puestos-existentes', index: 1, titleKey: 'guia_chapter_1_title', descKey: 'guia_chapter_1_desc', free: false },
  { slug: 'salarios', index: 2, titleKey: 'guia_chapter_2_title', descKey: 'guia_chapter_2_desc', free: false },
  { slug: 'practicas-cv-portfolio', index: 3, titleKey: 'guia_chapter_3_title', descKey: 'guia_chapter_3_desc', free: false },
  { slug: 'que-aprender', index: 4, titleKey: 'guia_chapter_4_title', descKey: 'guia_chapter_4_desc', free: false },
  { slug: 'buenas-practicas', index: 5, titleKey: 'guia_chapter_5_title', descKey: 'guia_chapter_5_desc', free: false },
  { slug: 'primer-empleo', index: 6, titleKey: 'guia_chapter_6_title', descKey: 'guia_chapter_6_desc', free: false },
];

export function getChapterBySlug(slug: string): ChapterMeta | undefined {
  return chapters.find((c) => c.slug === slug);
}

export function getAdjacentChapters(slug: string) {
  const index = chapters.findIndex((c) => c.slug === slug);
  return {
    prev: index > 0 ? chapters[index - 1] : null,
    next: index < chapters.length - 1 ? chapters[index + 1] : null,
  };
}

// Only chapter-0 is loaded locally (free content)
// Premium chapters (1-6) are fetched from Supabase via RLS
export const chapterImports: Record<string, () => Promise<{ default: ComponentType }>> = {
  'antes-de-empezar': () => import('./chapter-0'),
};

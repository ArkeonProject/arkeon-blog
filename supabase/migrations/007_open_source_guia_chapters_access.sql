-- Open-source temporary access for Guia Junior chapters 1-6
--
-- FUTURE ANNOTATION:
-- When monetization is reactivated, rollback with:
--   drop policy if exists "open source can read guia junior chapters 1-6" on public.guia_chapters;

create policy "open source can read guia junior chapters 1-6"
  on public.guia_chapters
  for select
  to anon, authenticated
  using (
    slug in (
      'puestos-existentes',
      'salarios',
      'practicas-cv-portfolio',
      'que-aprender',
      'buenas-practicas',
      'primer-empleo'
    )
  );

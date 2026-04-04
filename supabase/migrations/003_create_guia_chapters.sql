-- ============================================
-- Guía Junior Developer - Chapters Table
-- ============================================

-- Tabla de capítulos con contenido
create table if not exists guia_chapters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content jsonb not null,  -- contenido estructurado como JSON
  is_free boolean not null default false,
  "order" integer not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: cualquiera puede leer capítulos free
-- Solo quien tiene acceso en user_access puede leer capítulos premium
alter table guia_chapters enable row level security;

-- Política: capítulos free son públicos
create policy "anyone can read free chapters"
  on guia_chapters for select
  using (is_free = true);

-- Política: capítulos premium solo para quien tiene acceso (individual o B2B domain)
create policy "paid users can read premium chapters"
  on guia_chapters for select
  using (
    is_free = false
    and (
      exists (
        select 1 from user_access
        where user_access.user_id = auth.uid()
          and (user_access.product_id = 'guia_junior' or user_access.product_id = 'guia_junior_b2b')
          and user_access.status = 'active'
      )
      or has_b2b_domain_access(auth.email())
    )
  );

-- Índice por slug para búsqueda rápida
create index if not exists idx_guia_chapters_slug on guia_chapters(slug);

-- Índice por orden
create index if not exists idx_guia_chapters_order on guia_chapters("order");

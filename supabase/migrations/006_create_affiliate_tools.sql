-- ============================================
-- Affiliate Tools - Supabase Migration
-- ============================================

create table if not exists affiliate_tools (
  id serial primary key,
  name text not null,
  platform text not null,             -- 'Udemy', 'DigitalOcean', etc.
  category text not null,             -- 'learning' | 'testing' | 'hosting' | 'databases' | 'devtools'
  description_es text not null default '',
  description_en text not null default '',
  url text not null,                  -- affiliate link
  accent_color text not null default '#00aaff',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Habilitar Row Level Security
alter table affiliate_tools enable row level security;

-- Política: lectura pública (la página /recursos es pública)
create policy "public read active affiliate tools"
  on affiliate_tools for select
  using (active = true);

-- Política: solo usuarios autenticados (admin) pueden insertar, actualizar, eliminar
create policy "authenticated users can manage affiliate tools"
  on affiliate_tools for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Índice para filtrar por categoría
create index if not exists idx_affiliate_tools_category on affiliate_tools(category);

-- Índice para ordenar
create index if not exists idx_affiliate_tools_sort on affiliate_tools(sort_order, id);

-- Trigger para updated_at automático
create or replace function update_affiliate_tools_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger affiliate_tools_updated_at
  before update on affiliate_tools
  for each row execute function update_affiliate_tools_updated_at();

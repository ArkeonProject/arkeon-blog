-- ============================================
-- Guía Junior Developer - B2B Domains Table
-- ============================================

-- Tabla de dominios B2B autorizados
create table if not exists b2b_domains (
  id uuid primary key default gen_random_uuid(),
  domain text not null unique,
  institution_name text not null,
  product_id text not null default 'guia_junior',
  plan text not null default 'b2b_domain',
  status text not null default 'active',  -- active, expired, cancelled
  expires_at timestamptz,
  seats_limit integer,  -- null = ilimitado
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: solo service role puede gestionar dominios
alter table b2b_domains enable row level security;

-- Política: cualquiera puede leer dominios activos (para verificación)
create policy "anyone can read active domains"
  on b2b_domains for select
  using (status = 'active');

-- Índice por dominio para búsqueda rápida
create index if not exists idx_b2b_domains_domain on b2b_domains(domain);

-- Función para verificar si un email tiene acceso por dominio
create or replace function has_b2b_domain_access(email text)
returns boolean as $$
  select exists (
    select 1 from b2b_domains
    where status = 'active'
      and (expires_at is null or expires_at > now())
      and email like '%@' || domain
  );
$$ language sql security definer;

-- Insertar ejemplo: MEDAC
-- INSERT INTO b2b_domains (domain, institution_name, expires_at) 
-- VALUES ('alu.medac.es', 'MEDAC - Escuela de Artes Digitales', '2027-12-31');

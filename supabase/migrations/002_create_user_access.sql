-- ============================================
-- Guía Junior Developer - Supabase Migration
-- ============================================

-- Tabla de acceso de usuarios a productos
create table if not exists user_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id text not null,          -- 'guia_junior'
  plan text not null,                -- 'lifetime' | 'monthly' | 'annual'
  status text not null default 'active', -- 'active' | 'expired' | 'canceled'
  stripe_customer_id text,
  stripe_subscription_id text,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- Habilitar Row Level Security
alter table user_access enable row level security;

-- Política: cada usuario solo ve su propio acceso
create policy "users see own access"
  on user_access for select
  using (auth.uid() = user_id);

-- Política: solo service role puede insertar (webhook de Stripe)
-- Esto se maneja con la service role key desde el servidor
-- No necesitamos una política explícita de insert para auth users

-- Índice para búsqueda rápida por user_id
create index if not exists idx_user_access_user_id on user_access(user_id);

-- Índice para búsqueda por product_id + status
create index if not exists idx_user_access_product_status on user_access(product_id, status);

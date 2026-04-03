# Guía Junior Developer - Testing Prompt

Copia y pega este prompt en tu nueva configuración de IA para continuar el desarrollo:

---

## Contexto del Proyecto

Tengo un blog Vite SPA (`arkeon-blog`) con una guía premium para developers junior implementada. Necesito que continúes el desarrollo y testing.

### Stack Técnico
- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Auth**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Pagos**: Stripe (checkout + webhooks)
- **Deploy**: Vercel
- **Path aliases**: `@/` configurado en `tsconfig.app.json` y `vite.config.ts`

### Estructura de archivos clave
```
src/
├── context/AuthContext.tsx          # Auth global + verificación acceso
├── components/
│   ├── auth/ProtectedRoute.tsx      # Wrapper rutas protegidas
│   └── guia/ChapterContentRenderer.tsx  # Renderer JSONB → JSX
├── pages/guia-junior/
│   ├── ChapterPage.tsx              # Fetch desde Supabase
│   ├── DashboardPage.tsx            # Índice capítulos
│   ├── LandingPage.tsx              # Página ventas
│   └── ThanksPage.tsx               # Post-compra
├── data/guia/
│   ├── chapter-0.tsx                # Contenido free (local)
│   └── chapters.ts                  # Metadata capítulos
api/
├── guia-checkout.ts                 # Stripe Checkout
├── guia-webhook.ts                  # Webhook → Supabase
└── guia-chapter.ts                  # API contenido (protegida)
supabase/migrations/
├── 002_create_user_access.sql       # Tabla accesos usuarios
├── 003_create_guia_chapters.sql     # Tabla capítulos + RLS
├── 004_seed_guia_chapters.sql       # Contenido 6 capítulos
└── 005_create_b2b_domains.sql       # Dominios B2B
```

### Estado actual
- ✅ Build funciona: `pnpm run build` → exit code 0
- ✅ 6 capítulos premium en Supabase (verificados)
- ✅ Chapter-0 (free) como TSX local
- ✅ ChapterContentRenderer con 20+ tipos de sección
- ✅ AuthContext con `hasAccess()` y `checkB2BDomainAccess()`
- ✅ RLS configurado para capítulos free/paid/B2B domain
- ✅ API checkout y webhook con soporte B2B

### Variables de entorno (.env.local)
```
VITE_SUPABASE_URL=https://haadfdrfcvctrmzrovii.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_URL=https://haadfdrfcvctrmzrovii.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_GUIA_LIFETIME=price_...
STRIPE_PRICE_GUIA_LIFETIME_NORMAL=price_...
STRIPE_PRICE_GUIA_MONTHLY=price_...
STRIPE_PRICE_GUIA_ANNUAL=price_...
STRIPE_PRICE_GUIA_B2B_ANNUAL=price_...
STRIPE_PRICE_GUIA_B2B_LIFETIME=price_...
BASE_URL=http://localhost:5173
```

### Tareas pendientes

1. **Configurar Stripe**: Crear productos y precios en Stripe Dashboard
2. **Configurar Webhook**: Stripe Dashboard → Webhooks → `/api/guia-webhook`
3. **Testing local**: Ejecutar `pnpm dev` y probar flujo completo
4. **Testing B2B**: Añadir dominio de prueba y verificar acceso automático
5. **Landing page**: Mejorar `/guia-junior` con contenido de ventas completo
6. **Deploy**: Configurar variables en Vercel y desplegar

### Comandos útiles
```bash
pnpm dev           # Desarrollo local
pnpm build         # Build producción
pnpm run build     # Build completo (tsc + vite + sitemap)
```

### URLs de prueba
- `/guia-junior` — Landing de ventas (pública)
- `/guia-junior/capitulo/antes-de-empezar` — Capítulo free
- `/guia-junior/capitulo/puestos-existentes` — Capítulo premium (requiere auth + acceso)
- `/guia-junior/dashboard` — Índice de capítulos (requiere auth + acceso)
- `/login` — Login
- `/register` — Registro

### Notas importantes
- El contenido premium se carga desde Supabase vía RLS
- Los usuarios con dominio B2B (ej: `@alu.medac.es`) tienen acceso automático si el dominio está en `b2b_domains`
- Los usuarios individuales necesitan comprar acceso (Stripe checkout)
- El webhook de Stripe inserta en `user_access` automáticamente

---
# Guía Junior Developer - Plan de Implementación Técnica

## Resumen

Implementación de la guía interactiva de carrera para developers junior dentro de `arkeon-blog` (Vite SPA). Contenido free + premium protegido por Supabase Auth + Stripe.

---

## 1. Arquitectura de contenido Free vs Premium

### Contenido FREE (público)
- Rutas normales del router, sin protección
- SEO accesible (Google las indexa)
- Ejemplo: `/guia-junior` (landing), `/guia-junior/capitulo-0` (preview)

### Contenido PREMIUM (protegido)
- Requiere autenticación (Supabase Auth)
- Requiere acceso pagado (tabla `user_access`)
- El contenido se carga dinámicamente tras verificar permisos

---

## 2. Estructura de archivos a crear

```
src/
├── context/
│   └── AuthContext.tsx              # Estado global auth + acceso
├── components/
│   └── auth/
│       ├── ProtectedRoute.tsx       # Wrapper de rutas protegidas
│       ├── LoginForm.tsx            # Login con Supabase
│       └── RegisterForm.tsx         # Registro con Supabase
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ResetPasswordPage.tsx
│   └── guia-junior/
│       ├── LandingPage.tsx          # Página de ventas (pública)
│       ├── ThanksPage.tsx           # Post-compra (pública)
│       ├── DashboardPage.tsx        # Índice capítulos (protegida)
│       └── ChapterPage.tsx          # Lector de capítulos (protegida)
├── data/
│   └── guia/
│       ├── chapters.ts              # Contenido de capítulos
│       └── chapter-0.tsx            # Cap 0 (free preview)
├── lib/
│   └── stripe.ts                    # Helper de Stripe
└── hooks/
    └── useGuiaAccess.ts             # Hook para verificar acceso

api/
├── guia-checkout.ts                 # Crear sesión Stripe
├── guia-webhook.ts                  # Webhook Stripe → Supabase
└── guia-chapter.ts                  # Servir contenido capítulo (protegido)
```

---

## 3. Tabla SQL necesaria (Supabase)

```sql
-- Acceso de usuarios a productos
create table user_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id text not null,          -- 'guia_junior'
  plan text not null,                -- 'lifetime' | 'monthly' | 'annual'
  status text not null default 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- RLS: cada usuario solo ve su propio acceso
alter table user_access enable row level security;

create policy "users see own access"
  on user_access for select using (auth.uid() = user_id);

-- Solo service role puede insertar (webhook)
create policy "service role insert"
  on user_access for insert with check (true);
```

---

## 4. AuthContext.tsx

```tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface UserAccess {
  product_id: string;
  plan: string;
  status: string;
  expires_at: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  access: UserAccess[];
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  hasAccess: (productId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState<UserAccess[]>([]);

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchAccess(session.user.id);
      else setLoading(false);
    });

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) fetchAccess(session.user.id);
        else { setAccess([]); setLoading(false); }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function fetchAccess(userId: string) {
    const { data } = await supabase
      .from('user_access')
      .select('product_id, plan, status, expires_at')
      .eq('user_id', userId)
      .eq('status', 'active');
    
    setAccess(data ?? []);
    setLoading(false);
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }

  async function signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setAccess([]);
  }

  function hasAccess(productId: string): boolean {
    return access.some(a => a.product_id === productId && a.status === 'active');
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, access, signIn, signUp, signOut, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

---

## 5. ProtectedRoute.tsx

```tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredProduct?: string;
}

export function ProtectedRoute({ children, requiredProduct }: ProtectedRouteProps) {
  const { user, loading, hasAccess } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredProduct && !hasAccess(requiredProduct)) {
    return <Navigate to="/guia-junior" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

---

## 6. API Functions (Vercel Functions)

### api/guia-checkout.ts

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia' as any,
});

export async function POST(req: Request) {
  try {
    const { priceId, userId, email } = await req.json();

    if (!priceId || !userId || !email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.BASE_URL || 'http://localhost:5173'}/guia-junior/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL || 'http://localhost:5173'}/guia-junior`,
      customer_email: email,
      metadata: { userId, product: 'guia_junior' },
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
```

### api/guia-webhook.ts

```typescript
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia' as any,
});

// Service role key para poder insertar en user_access
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response('Webhook error', { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, product } = session.metadata as { userId: string; product: string };

      // Determinar plan según el price_id
      const priceId = session.line_items?.data[0]?.price?.id;
      let plan = 'lifetime';
      
      if (priceId === process.env.STRIPE_PRICE_GUIA_MONTHLY) plan = 'monthly';
      else if (priceId === process.env.STRIPE_PRICE_GUIA_ANNUAL) plan = 'annual';

      // Calcular expires_at para planes recurrentes
      let expiresAt: string | null = null;
      if (plan === 'monthly') {
        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      } else if (plan === 'annual') {
        expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      }

      const { error } = await supabaseAdmin.from('user_access').insert({
        user_id: userId,
        product_id: product,
        plan,
        status: 'active',
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string | null,
        expires_at: expiresAt,
      });

      if (error) {
        console.error('Error inserting user_access:', error);
        return new Response('Database error', { status: 500 });
      }
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
```

---

## 7. Variables de entorno

```env
# Supabase (ya las tienes)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Supabase Service Role (solo para API functions, sin VITE_)
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_GUIA_LIFETIME=
STRIPE_PRICE_GUIA_LIFETIME_NORMAL=
STRIPE_PRICE_GUIA_MONTHLY=
STRIPE_PRICE_GUIA_ANNUAL=

# Base URL
BASE_URL=https://arkeonixlabs.com
```

---

## 8. Rutas en AppRouter.tsx

```tsx
// Importar nuevas páginas
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import GuiaLandingPage from '@/pages/guia-junior/LandingPage';
import GuiaThanksPage from '@/pages/guia-junior/ThanksPage';
import GuiaDashboardPage from '@/pages/guia-junior/DashboardPage';
import GuiaChapterPage from '@/pages/guia-junior/ChapterPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthProvider } from '@/context/AuthContext';

// Dentro del BrowserRouter, envolver con AuthProvider
<AuthProvider>
  <Routes>
    <Route element={<Layout />}>
      {/* Rutas existentes... */}
      
      {/* Auth públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Guía Junior - públicas */}
      <Route path="/guia-junior" element={<GuiaLandingPage />} />
      <Route path="/guia-junior/gracias" element={<GuiaThanksPage />} />
      
      {/* Guía Junior - protegidas */}
      <Route path="/guia-junior/dashboard" element={
        <ProtectedRoute requiredProduct="guia_junior">
          <GuiaDashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/guia-junior/capitulo/:slug" element={
        <ProtectedRoute requiredProduct="guia_junior">
          <GuiaChapterPage />
        </ProtectedRoute>
      } />
    </Route>
  </Routes>
</AuthProvider>
```

---

## 9. Protección del contenido premium

### Lo que SÍ protege tu arquitectura

| Capa | Qué protege | Cómo |
|------|-------------|------|
| **Auth** | Solo usuarios logados ven contenido PRO | `ProtectedRoute` + Supabase Auth |
| **Acceso** | Solo quien pagó ve capítulos PRO | Consulta a `user_access` en Supabase |
| **Webhook** | Solo Stripe puede activar acceso | Firma verificada con `STRIPE_WEBHOOK_SECRET` |
| **Sesiones** | Control de sesiones activas | Supabase Auth gestiona tokens JWT |

### Lo que NO puedes proteger al 100%

- **Screenshots** — un usuario puede hacer captura de pantalla siempre
- **Copiar texto manualmente** — si lo ve en pantalla, puede copiarlo
- **Compartir credenciales** — un usuario puede dar su email/password a otro

### Medidas para mitigar distribución no autorizada

#### a) Detección de sesiones simultáneas
```typescript
// En AuthContext, verificar si hay otra sesión activa
// Supabase Auth permite ver sesiones activas por usuario
// Si detectas 2+ sesiones simultáneas → alertar o bloquear
```

#### b) Rate limiting en el contenido
```typescript
// En las Vercel Functions que sirven contenido
// Limitar peticiones por usuario/IP por minuto
// Evita scraping automatizado
```

#### c) Contenido dinámico, no estático
```tsx
// NO renderizar todo el capítulo en el HTML estático
// Cargar el contenido via API call tras verificar acceso
// Así no queda en el source code de la página
```

#### d) Marca de agua con email del usuario
```tsx
// En el contenido premium, mostrar sutilmente:
// "Accedido por: usuario@email.com"
// Si alguien comparte screenshots, queda identificado
```

#### e) PDF con marca de agua
```typescript
// Al generar el PDF descargable, incluir:
// - Email del usuario en el footer de cada página
// - Timestamp de descarga
// - ID único de transacción
```

---

## 10. Resumen de protección

| Amenaza | Solución | Eficacia |
|---------|----------|----------|
| Acceso sin pagar | ProtectedRoute + user_access | ✅ Total |
| Compartir cuenta | Detección sesiones simultáneas | ⚠️ Parcial |
| Screenshots | Marca de agua con email | ⚠️ Disuasorio |
| Scraping | Rate limiting + contenido dinámico | ✅ Alta |
| PDF compartido | Marca de agua + ID transacción | ⚠️ Disuasorio |
| Acceso directo a API | Verificación de sesión en cada endpoint | ✅ Total |

**La realidad:** ningún sistema protege al 100% contra un usuario determinado a compartir contenido. Lo que sí puedes hacer es:
1. **Hacerlo lo suficientemente difícil** para que no merezca la pena
2. **Hacerlo rastreable** para que puedas banear cuentas abusadoras
3. **Hacerlo legalmente protegido** (términos de uso que prohíben redistribución)

---

## 11. Orden de implementación (Fases)

### FASE 0 — Infraestructura base (~10-12 hrs, 2 semanas)
1. Crear tabla `user_access` en Supabase + RLS
2. Crear productos y precios en Stripe
3. Crear `AuthContext.tsx` + `ProtectedRoute.tsx`
4. Crear páginas de login/registro
5. Crear API functions de Stripe (checkout + webhook)
6. Configurar variables de entorno

**Stop point:** ¿Puedo registrarme, pagar 1€ de prueba y ver una página protegida?

### FASE 1 — Lead magnet y lista de espera (~4-6 hrs, 1 semana)
1. Landing `/guia-junior` con formulario de email
2. PDF gratuito (lead magnet)
3. Artículo SEO en el blog

**Stop point:** ¿50+ emails en 2 semanas?

### FASE 2 — Contenido MVP (~15-20 hrs, 4-6 semanas)
1. Sistema de capítulos (archivos TSX en `src/data/guia/`)
2. Escribir capítulos en orden de impacto
3. Lector de capítulos con navegación

**Stop point:** ¿1 usuario de pago leyendo los primeros 2 capítulos?

### FASE 3 — Features interactivas (post-lanzamiento)
- Test de perfil
- Tabla salarios interactiva
- Checklist 90 días con progreso guardado
- PDF descargable server-side

### FASE 4 — B2B academias (solo con B2C validado)
- Códigos de acceso bulk
- Dashboard coordinadores
- 149-299€/año

---

## 12. Modelo de precios

| Plan | Precio | Stripe Mode |
|------|--------|-------------|
| Lead magnet (PDF corto) | 0€ | N/A |
| Mensual | 2,99€/mes | subscription |
| Anual | 19€/año (~1,60€/mes) | subscription |
| Vitalicio lanzamiento | 9€ pago único | payment |
| Vitalicio normal | 24€ pago único | payment |
| B2B academias | 149-299€/año | payment (manual) |

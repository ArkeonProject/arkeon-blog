# AGENTS.md — Arkeonix Blog

Guía interna para Codex. Leer siempre antes de hacer cambios.

---

## Contexto del proyecto

- **Framework**: React 19 + Vite 7 + React Router v7 (SPA pura, sin SSR)
- **Estilos**: TailwindCSS v4 + design system propio en `src/styles/index.css`
- **Backend**: Supabase (PostgreSQL). Variables de entorno con prefijo `VITE_` en cliente
- **Funciones server-side**: Vercel Functions en `/api/*.ts` (Edge Runtime o Serverless)
- **Package manager**: **pnpm** — usar siempre `pnpm add`, `pnpm install`, `pnpm typecheck`
- **Despliegue**: Vercel. Config en `vercel.json`
- **i18n**: `src/locales/es.json` + `en.json`. Claves planas, hook `useLocale()` → `t(key)`
- **Tipos**: `src/types/post.ts` y `src/types/lab.ts` — consultar antes de trabajar con posts
- **Automatización de publicaciones**: existe un flujo en **n8n** que publica posts automáticamente en Supabase para las secciones de **Productos** y **Noticias**. El flujo insertan directamente en las tablas `posts` (y posiblemente `lab_posts`). Históricamente publicaba en **Markdown**; se está migrando a **HTML**. No tocar la estructura de las tablas sin considerar el impacto en n8n.
- **Formato de contenido**: el campo `content` en Supabase acepta tanto MD (posts viejos) como HTML (posts nuevos). La detección automática en PostPage/LabPostPage distingue por si el contenido empieza con `<tag`. El flujo n8n debe generar HTML puro (sin wrapper en MD) para que se renderice correctamente.

---

## Reglas del proyecto

1. **Siempre usar pnpm**, nunca npm ni yarn en este proyecto
2. **Verificar tipos** con `pnpm typecheck` antes de dar una tarea por terminada
3. **No usar npm para instalar** — fallará con error `EUNSUPPORTEDPROTOCOL workspace:*`
4. Las **Vercel Functions** en `/api/` usan env vars sin prefijo `VITE_` (server-side)
5. El cliente solo accede a env vars con prefijo `VITE_`
6. El **SPA fallback** en `vercel.json` excluye rutas `/api/`: `/((?!api/)(?!.*\\.).*)`
7. Las **traducciones** siempre se añaden en paralelo a `es.json` Y `en.json`
8. El contenido de los posts se guarda como **HTML** (TipTap WYSIWYG). Los posts viejos en Markdown siguen funcionando por detección automática en PostPage/LabPostPage
9. Para pausas comerciales temporales, no borrar Stripe/Supabase premium: usar flags en `src/config/monetization.ts` y desactivar checkout/portal/webhook de forma reversible

---

## Procedimiento reversible: modo open-source

Objetivo: pausar monetización sin eliminar infraestructura, y poder reactivar sin migraciones de emergencia.

### Flags de control

1. Editar `src/config/monetization.ts`:
   - `OPEN_SOURCE_MODE = true` abre experiencia premium en frontend
   - `PAYMENTS_ENABLED = !OPEN_SOURCE_MODE` apaga/enciende pagos de forma acoplada
2. Estados válidos:
   - Open-source: `OPEN_SOURCE_MODE=true` + `PAYMENTS_ENABLED=false`
   - Comercial: `OPEN_SOURCE_MODE=false` + `PAYMENTS_ENABLED=true`

### Endpoints de pago (comportamiento esperado)

- `POST /api/guia-checkout` → con pagos desactivados: `410` + `Payments are temporarily disabled`
- `POST /api/academia-checkout` → con pagos desactivados: `410` + `Payments are temporarily disabled`
- `POST /api/customer-portal` → con pagos desactivados: `410` + `Customer portal is temporarily disabled`
- `POST /api/guia-webhook` → con pagos desactivados: `200` + `Payments disabled` (ack para Stripe)

### Supabase RLS obligatorio (Guía/Academia)

- El modo open-source en UI **no** salta RLS: si no cambias políticas, seguirá habiendo `access_denied` en contenido premium.
- Guía (`guia_chapters`): política pública actual solo para `is_free=true`; en open-source añadir/ajustar SELECT para premium y revertir al volver a monetización.
- Academia (`academia_categories`, `academia_exams`, `academia_questions`): asegurar SELECT público temporal en open-source; al reactivar pagos, volver a gating por `user_access.product_id='academia'`.
- Mantener RLS habilitado siempre; no usar `disable row level security` como solución rápida.

### Checklist rápido de activación/reversión

1. Cambiar flags de `src/config/monetization.ts`
2. Validar respuestas HTTP en los 4 endpoints de pago
3. Aplicar/revertir políticas RLS de Guía y Academia
4. Probar rutas reales con usuario anónimo y logueado

---

## Errores aprendidos

### [2026-03-10] npm falla por workspace de pnpm
- **Qué pasé**: intenté instalar dependencias con `npm install` y falló
- **Por qué ocurrió**: el proyecto usa pnpm con `pnpm-lock.yaml`. npm no entiende el protocolo `workspace:*`
- **Solución aplicada**: usar `pnpm add <paquete>` desde el directorio `arkeon-blog/`
- **Regla derivada**: SIEMPRE usar pnpm en este proyecto. Nunca npm ni yarn.

### [2026-03-10] TextStyle de TipTap no tiene default export
- **Qué pasé**: `import TextStyle from "@tiptap/extension-text-style"` causó error TS2613
- **Por qué ocurrió**: la versión instalada solo exporta named export, no default
- **Solución aplicada**: `import { TextStyle } from "@tiptap/extension-text-style"`
- **Regla derivada**: al importar extensiones de TipTap, verificar si es default o named export antes de asumir. TextStyle específicamente es named export.

### [2026-03-10] editor.commands.setContent() con segundo argumento booleano
- **Qué pasé**: `editor.commands.setContent(value, false)` causó error TS2559 — el tipo `false` no es compatible con `SetContentOptions`
- **Por qué ocurrió**: la API de TipTap cambió; el segundo argumento ahora espera un objeto de opciones, no un booleano
- **Solución aplicada**: `editor.commands.setContent(value)` sin segundo argumento
- **Regla derivada**: no pasar booleano como segundo argumento a `setContent()`. Usar solo el primer argumento o un objeto `SetContentOptions`.

### [2026-03-10] vercel dev no carga .env.local en Edge Functions
- **Qué pasé**: `vercel dev` levanta el frontend pero las Vercel Edge Functions no reciben las vars de `.env.local` (ADMIN_TOKEN, SUPABASE_URL, etc.) → 401 unauthorized en `/api/admin-posts`
- **Por qué ocurrió**: `pnpm dev` (solo Vite) no sirve rutas `/api/`. `vercel dev` sí, pero no inyecta `.env.local` en el runtime Edge de forma automática
- **Solución aplicada**: pasar las vars explícitamente via shell antes de arrancar: `source .env.local && vercel dev --token $VERCEL_TOKEN --scope daviilpzdevs-projects`
- **Regla derivada**: para desarrollo local con Vercel Functions usar siempre `source .env.local && vercel dev ...`. Nunca `pnpm dev` si se necesitan las API routes.

### [2026-03-10] Vercel SPA fallback intercepta rutas /api/
- **Qué pasé**: el catch-all `/((?!.*\\.).*)`  en `vercel.json` redirigía `/api/og` a `/index.html`
- **Por qué ocurrió**: la regex captura cualquier ruta sin extensión, incluyendo `/api/*`
- **Solución aplicada**: modificar la regex a `/((?!api/)(?!.*\\.).*)`  para excluir `/api/`
- **Regla derivada**: al añadir Vercel Functions en `/api/`, verificar que el SPA fallback las excluya explícitamente.

### [2026-03-10] n8n updateNode con parameters parciales borra otros campos
- **Qué pasé**: al actualizar solo `responses` en un nodo OpenAI de n8n, se eliminó el campo `modelId`
- **Por qué ocurrió**: `updateNode` con `parameters: { responses: ... }` reemplaza el objeto `parameters` completo, no hace merge
- **Solución aplicada**: incluir SIEMPRE todos los campos del objeto `parameters` en la operación (modelId + responses juntos)
- **Regla derivada**: al usar `n8n_update_partial_workflow` con `updateNode`, el campo `parameters` se reemplaza entero — nunca enviar campos parciales, siempre incluir todos los parámetros del nodo.

### [2026-03-10] Vercel Functions necesitan env vars sin prefijo VITE_
- **Qué pasé**: las funciones en `/api/` usan `process.env.SUPABASE_URL` (sin VITE_), no `import.meta.env.VITE_SUPABASE_URL`
- **Por qué ocurrió**: las Vercel Functions corren en Node/Edge, no en el cliente Vite
- **Solución aplicada**: configurar env vars sin prefijo en Vercel dashboard para uso server-side
- **Regla derivada**: variables server-side → sin `VITE_`. Variables cliente → con `VITE_`. Nunca mezclar.

### [2026-05-18] Nunca devolver answerKey al cliente en endpoints de corrección
- **Qué pasé**: el endpoint `/api/academia-grade` devolvía `answerKey` (mapa de respuestas correctas) al frontend tras calificar un examen
- **Por qué ocurrió**: la review UI necesitaba saber qué respuestas eran correctas para colorearlas
- **Solución aplicada**: cambiar la respuesta del endpoint a `results: Record<number, boolean>` (solo indica si el usuario acertó o no). La UI sigue mostrando acierto/fallo por pregunta sin revelar cuál era la respuesta correcta
- **Regla derivada**: en endpoints de corrección/exámenes, nunca devolver las respuestas correctas al cliente. Usar booleanos de resultado o revelar solo tras múltiples capas de protección (rate limit, auth, payload validation)

### [2026-05-18] Webhook de Stripe no debe exponer detalles de Supabase
- **Qué pasé**: cuando fallaba un `insert` en `user_access` dentro del webhook de Stripe, la respuesta HTTP incluía `error.message`, `error.code` y `error.details` de Supabase
- **Por qué ocurrió**: Stripe registra las respuestas de webhook en sus logs; detalles de error de base de datos quedaban accesibles fuera de nuestra infraestructura
- **Solución aplicada**: loggear el error completo server-side (console.error) y retornar `"Internal server error"` genérico en la respuesta HTTP
- **Regla derivada**: en webhooks de terceros (Stripe, etc.), nunca retornar detalles de errores internos. Log local + mensaje genérico al caller.

### [2026-05-18] Checkout endpoints deben validar priceId server-side
- **Qué pasé**: los endpoints de checkout aceptaban cualquier `priceId` enviado por el cliente, permitiendo potencialmente crear sesiones de Stripe con precios no autorizados
- **Por qué ocurrió**: el `priceId` venía del body de la request sin validación contra una allowlist
- **Solución aplicada**: crear funciones `resolveGuiaPriceMetadata`, `getAllowedAcademiaPrices`, `getAllowedBoilerplatePrices` que validan el `priceId` contra variables de entorno conocidas antes de crear la sesión de Stripe
- **Regla derivada**: nunca confiar en `priceId` enviado por el cliente. Validar siempre contra una allowlist server-side. Derivar product/plan desde el priceId, no desde flags del cliente.

### [2026-05-18] Usar vista pública en vez de ocultar columnas en cliente
- **Qué pasé**: el cliente de Supabase podía leer `correct_answer` de `academia_questions` porque la tabla tenía SELECT público y solo el frontend filtraba la columna
- **Por qué ocurrió**: `select('id, exam_id, ...')` en el cliente no es una barrera de seguridad; cualquiera con la anon key puede hacer `select('*')`
- **Solución aplicada**: crear vista `academia_questions_public` que excluye `correct_answer`, revocar SELECT sobre la tabla base para `anon`/`authenticated`, y otorgar SELECT solo sobre la vista
- **Regla derivada**: para ocultar columnas sensibles de Supabase, usar vistas o RLS con funciones, nunca confiar en que el cliente pida solo ciertas columnas

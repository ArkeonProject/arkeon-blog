# 🧾 Changelog — Arkeonix Labs

> Registro de versiones del proyecto, sincronizado con los tags de GitHub.

---

## [Unreleased]

### Added

- **Calculadora de Salario España 2026** (`/herramientas/calculadora-salario`): simulador bruto → neto con tramos IRPF, contingencias comunes y retenciones.
- **Test de Rol Tech** (`/herramientas/test-rol-tech`): quiz que recomienda perfil profesional (Frontend, Backend, QA, DevOps, Data) según respuestas.
- **Checklist de Portfolio Junior** (`/herramientas/checklist-portfolio-junior`): 10 categorías, 29 ítems, scoring ponderado (100 pts), descarga `.md` y mejoras auto-calculadas.
- **Rutas de Aprendizaje Tech** (`/rutas`): 6 rutas — Primer Empleo Tech, QA Automation, Java + Selenium, Portfolio Junior, CI/CD Básico, Crear SaaS — con landing grid, página de detalle con ToC sticky y navegación prev/next.
- Dropdowns "Herramientas" y "Rutas" en la navegación principal con acceso directo a todas las sub-páginas.
- Componente **PageHero** unificado para headers con colores por sección (Blog, Lab, Herramientas, Rutas, Recursos, Academia) y gradientes.
- Metadata SEO completa en todas las páginas públicas: Open Graph, Twitter Cards y canonical único por ruta.
- JSON-LD estructurado en páginas clave: `Blog`, `AboutPage`, `ContactPage`, `ItemList`, `FAQPage`, `HowTo`, `Product`.
- Loaders de prerender para `/blog` y `/lab` con precarga de datos desde Supabase.
- Soporte para **Google Search Console** vía variable de entorno `VITE_GOOGLE_SITE_VERIFICATION`.
- Modo open-source reversible con flags en `src/config/monetization.ts` (pausar pagos sin eliminar infraestructura Stripe/Supabase RLS).

### Changed

- Se reactivó `/recursos` como hub con Guía Junior y SaaS Boilerplate bajo `/recursos/guia-junior` y `/recursos/saas-boilerplate`, con redirecciones legacy permanentes.
- Rediseño de homepage y blog page: nuevo layout, tarjetas de post rediseñadas, jerarquía visual mejorada.
- Dominio canónico estandarizado a **non-www** (`https://arkeonixlabs.com`) en sitemap, index.html, OG/Twitter, JSON-LD y canonical de todas las rutas.
- **Sitemap.xml** regenerado con 36 URLs incluyendo herramientas, rutas, academia y posts recientes.
- **BlogPage** y **LabPage** usan queries con columnas específicas sin `SELECT *` ni columna `content`; BlogPage evita fetch inicial duplicado cuando el loader ya precargó datos.
- `root.tsx`: eliminados OG, Twitter y canonical duplicados. Cada ruta emite su metadata via `MetaFunction` como fuente única.
- Metadata SEO de rutas extraída a utilidad testeable (`src/utils/rutaSeo.ts`) con soporte ES/EN.
- `robots.txt` ahora bloquea rutas internas: `/admin`, `/login`, `/register`, `/reset-password`, `/api/`.
- `AcademiaExamPage` usa `noindex, nofollow` — los exámenes no son contenido SEO-valioso.

### Fixed

- Contenido de post centrado correctamente cuando no hay tabla de contenidos lateral.
- Título de página Arkeonix acortado para evitar truncamiento en SERPs.
- Portfolio checklist: corregidos `aria-label` en controles de formulario y añadidos tests.
- Rutas de aprendizaje: eliminado código muerto, corregidos edge cases en ToC, filtrados párrafos vacíos.
- Endpoints de checkout: `priceId` validado contra allowlist server-side.
- Webhook de Stripe: logs de error sanitizados — sin detalles de Supabase en respuesta HTTP.
- Endpoint `/api/academia-grade`: eliminada fuga de `answerKey` — solo devuelve booleano de acierto/error.

### Security

- Validación server-side de `priceId` en todos los endpoints de checkout de Stripe.
- Sanitización de errores en respuestas de webhooks de Stripe (sin `error.message`, `error.code`, `error.details` de Supabase).
- Vista `academia_questions_public` en Supabase: excluye columna `correct_answer`, SELECT público solo sobre la vista.
- Endpoint `academia-grade` ya no devuelve `answerKey` al cliente (solo `results: Record<number, boolean>`).
- Endpoints de pago retornan `410 Gone` con mensaje genérico cuando los pagos están desactivados.

---

## [v2.12.2] - 2026-04-30

### Changed

- CI workflows migrados a organization-tools@v1 con self-hosted runners.

### Fixed

- Redirect `www` → non-www causaba loop infinito en Vercel.
- `packageManager` configurado como `pnpm@9` en `package.json` para compatibilidad con `pnpm/action-setup`.

## [v2.12.1] - 2026-04-19

### Changed

- CI/CD workflow `cd-node-vercel` actualizado a v1.1.6.

## [v2.12.0] - 2026-04-19

### Fixed

- Correcciones del audit SEO completo (meta tags, canonical, headings, alt texts).

## [v2.11.1] - 2026-04-12

### Changed

- Vercel Functions migradas a React Router resource routes para mejor integración con RRv7.

### Fixed

- Stripe y Supabase inicializados de forma lazy dentro de los handlers para evitar cold-start en rutas sin API.

## [v2.11.0] - 2026-04-12

### Added

- Schema.org `Product` en página de Academia.
- Testimonios en página de Academia.
- CTAs internos entre productos (cross-selling Guía Junior ↔ Academia ↔ SaaS Boilerplate).

### Changed

- Precio Academia ajustado a €19.

### Fixed

- Orden de capítulos de la Guía Junior corregido.

## [v2.10.2] - 2026-04-12

### Added

- Gestión de herramientas de afiliado desde `/admin`.

### Changed

- Catálogo de afiliados limitado a Udemy hasta tener enlaces reales aprobados.

## [v2.10.1] - 2026-04-12

### Fixed

- Meta tag de verificación Impact.com movido a `root.tsx` para renderizado SSR.

## [v2.10.0] - 2026-04-12

### Added

- Sección de herramientas de afiliado en `/recursos`.
- Verificación de Impact.com en meta tags.

## [v2.9.0] - 2026-04-09

### Added

- Guest checkout sin fricción en Academia y Guía Junior (compra sin registro previo).

### Changed

- Guía Junior pasa a precio lifetime único de €19 — eliminados planes mensual y anual.
- Formulario de contacto en `/arkeonix` reemplazado por checkout directo de Stripe.

## [v2.8.0] - 2026-04-08

### Added

- **Academia Tech** con motor de exámenes ISTQB, categorías y sistema de puntuación.
- Stripe Customer Portal para auto-gestión de suscripciones.

### Fixed

- Routing de Academia, query de exámenes y redirect tras login.

## [v2.7.0] - 2026-04-06

### Added

- Migración a **React Router v7**.
- Google Tag Manager (`GTM-MTHC7PSV`) para analytics.
- Mejoras de SEO y UI premium.

### Fixed

- Inicialización robusta de Supabase, errores de lint y configuración de directorio de salida en Vercel.

## [v2.6.2] - 2026-04-04

### Fixed

- Error de modo checkout de Stripe y tipos `Invoice` actualizados para SDK v21.

## [v2.6.1] - 2026-04-04

### Fixed

- CI/CD: `secrets: inherit` añadido para pasar credenciales Vercel al workflow reusable.

## [v2.6.0] - 2026-04-04

### Added

- Sistema premium **Guía Junior** con auth, Stripe Checkout y soporte B2B.
- Structured data SEO (JSON-LD), Open Graph tags y canonical URLs en páginas principales.
- ScrollReveal animations, CLI de lab posts y generador de sitemap.

### Fixed

- Errores de TypeScript en `ChapterContentRenderer` y ruta duplicada en AppRouter.
- Build de Vercel, runtime de API functions y webhook de Stripe v2 ping events.

---

## [v2.5.2] - 2026-03-30

### 🛠️ Dependencias — Dependabot Consolidation

- @eslint/js 9.38.0 → 9.39.2
- typescript-eslint 8.46.2 → 8.49.0
- eslint-plugin-react-refresh 0.4.24 → 0.4.25
- @changesets/cli 2.29.7 → 2.29.8
- autoprefixer 10.4.21 → 10.4.23

### 🔧 Workflows

- Actualizados a organization-tools v1.1.5 (ci.yml, hotfix.yml, release.yml)

### ⚙️ Config

- Dependabot target-branch cambiada de `main` → `develop`
- Tests deshabilitados en CI (sin script `test` configurado)

---

## [v2.4.3] - 2026-03-19

### 🐛 Corregido

- Logo cambiado de SVG (1.3MB) a PNG en header, footer, favicon, apple-touch-icon y OG/Twitter cards
- Eliminado `logo.svg` obsoleto
- Corregido modo HTML source del editor: el contenido del textarea ya no se sobreescribe al editar

# 🧾 Changelog — Arkeonix Labs

> Registro de versiones del proyecto, sincronizado con los tags de GitHub.

---

## [v2.3.0] - 2026-03-18

### 🚀 Añadido

#### Affiliate Disclosure Page
- Nueva página `/affiliate-disclosure` con 5 secciones: qué son los enlaces de afiliado, cómo funcionan, independencia editorial, coste para el usuario y contacto
- Traducciones completas en ES y EN (13 claves `affiliate_*` + `footer_affiliate`)
- Enlace añadido en el footer dentro de la sección Legal
- Ruta registrada en `AppRouter.tsx`

### 🤖 n8n — Mejoras de calidad editorial
- Modelo LLM actualizado de GPT-4o a GPT-4.1 en los 3 nodos principales (Análisis, Artículo EN, Polish)
- Voz editorial cambiada de "hands-on reviewer" a "hardware editor basado en specs y feedback de compradores"
- Limpieza programática post-LLM: reemplazo context-aware de person words + 30+ banned word swaps
- Nodo Polish con Fix 8 completo: cleanup de palabras prohibidas, patrones "making it [adj]", y meta descriptions

### 🧹 Limpieza
- `.n8n/` añadido a `.gitignore` (contiene API keys de SerpAPI/OpenAI)

---

## [v2.2.0] - 2026-03-10

### 🔐 Seguridad — Admin panel
- Reemplazado auth custom (contraseña en bundle JS) por **Supabase Auth** con `signInWithPassword`
- Eliminada `VITE_SUPABASE_SERVICE_ROLE_KEY` del cliente — escrituras protegidas por RLS de Supabase
- Eliminado intermediario Vercel Function para operaciones del admin — conexión directa a Supabase
- Sesión gestionada por JWT de Supabase: sign in / sign out real, no bypasseable desde consola
- Añadidas políticas RLS de INSERT/UPDATE/DELETE para role `authenticated` en `posts` y `lab_posts`
- Añadidas políticas RLS de SELECT para role `authenticated` (necesario cuando hay sesión activa)

### 🚀 Añadido

#### Admin Panel
- Paginación de 20 posts por página en el gestor de publicaciones
- Filtros por idioma (ES/EN) y por categoría en Blog Posts y Lab Posts
- Contador de resultados filtrados en tiempo real
- Formulario de login con email + contraseña (Supabase Auth)
- Botón "Sign out" que cierra sesión real en Supabase

#### ArkeonixPage — Landing SaaS
- Sección **"Quién soy"** con foto, bio personal y enlaces GitHub/LinkedIn
- Sección **Arquitectura del proyecto**: 2 columnas (imagen con fade premium + descripción técnica con 5 items)
- Sección **Reseñas**: 3 tarjetas de testimonios con 5 estrellas, cita, nombre y rol
- Pricing rediseñado: 2 planes de **pago único** (Starter €149 / Pro €299) en lugar de suscripción
- Formulario de contacto actualizado con los nuevos planes

#### Blog Homepage
- **Banner SaaS** destacado antes del featured post: diseño con glow, dot-grid y CTA animado
- **Header "Última Publicación"** con icono antes del featured post
- **Enlace dinámico** según categoría del featured post: "Ver últimas noticias", "Ver últimos productos" o "Ver todas las publicaciones"
- Scroll-to-top automático en cada cambio de ruta (`RouteScrollToTop` en AppRouter)

#### Header
- Nav centrado con `grid-cols-3` — el menú queda perfectamente centrado respecto al viewport

### 🤖 n8n — Migración a HTML
- Prompts de OpenAI actualizados en 8 nodos para generar HTML semántico en lugar de Markdown
- Nodos de código JS actualizados para extraer título de `<h1>` en lugar de `# `
- Backward compatible: posts viejos en Markdown siguen renderizando via `marked`
- Flujos afectados: `Publicaciones de productos Arkeon` y `Arkeon News`

### 🧹 Limpieza
- Eliminado `api/admin-posts.ts` (Vercel Function obsoleta, reemplazada por Supabase directo)

---

## [v2.1.0] - 2026-01-XX

### 🚀 Añadido
- **Arkeonix Labs Branding**: Nuevas referencias visuales y de identidad de marca
- Refinamiento de etiquetas de navegación
- Corrección de márgenes de layout
- Fix en el renderizado del botón de compra en la página principal

---

## [v2.0.0] - 2025-12-XX

### 🚀 Añadido
- **Sección Lab**: Nuevo apartado técnico con artículos de infraestructura, Docker y servidores
  - CLI de publicación (`lab:publish`, `lab:update`, `lab:list`) para gestión de posts desde terminal
  - Componente `LabPostCard` y página `LabPage` con filtros y paginación
  - Página de detalle `LabPostPage` con renderizado MD/HTML y DOMPurify
- **Rediseño premium**: Nuevas tarjetas de posts, paginación y estilos glassmorphism en todas las secciones
- **Internacionalización completa**: Hook `useLocale` y archivos `es.json` / `en.json` con todas las claves del proyecto
- **Integración con Stitch**: Patrones de diseño aplicados a cards y componentes de paginación

### 🧰 Modificado
- Layout del blog refinado: sección Lab integrada en la homepage
- Reorganización del pipeline CI/CD para usar `organization-tools` centralizado

### 🐛 Corregido
- Errores de linting en CI
- Supresión de warnings de CSS linter

---

## [v1.4.0] - 2025-12-XX

### 🚀 Añadido
- **Mejoras SEO para aprobación de AdSense**:
  - Sitemap generator automático con datos de Supabase
  - Metaetiquetas optimizadas en todas las páginas
  - Script robusto que gestiona credenciales Supabase ausentes

### 🧰 Modificado
- Pipeline CI/CD migrado a flujos centralizados de `organization-tools`
- Workflow de CD: eliminación de ENV_VARS manuales (gestionadas por Vercel)

---

## [v1.3.4] - 2025-12-XX

### 🐛 Corregido
- Sincronización del lockfile con dependencias de `package.json`
- Fix en pipeline de release automático

---

## [v1.3.3] - 2025-12-XX

### 🐛 Corregido
- Correcciones en el flujo de CI/CD tras migración

---

## [v1.3.2] - 2025-12-05
### 🛡️ Seguridad
- Actualización de `react` y `react-dom` a 19.1.2 para mitigar CVE-2025-55182 / CVE-2025-66478 en React Server Components.

---

## [v1.3.1] - 2025-11-22
### 🧰 Modificado
- Adaptación de imágenes de cards de posts para que se ajusten al tamaño predeterminado de cada imagen.

---

## [v1.3.0] - 2025-11-19
### 🚀 Añadido
- **Sistema de Categorías**: Implementación completa de categorías para posts y productos
  - Componente `CategoryBanner` para navegación entre secciones (Noticias/Productos)
  - Filtrado de contenido por categorías
  - Integración visual con el header principal
- **Componente ScrollToTop**: Botón flotante para volver al inicio de la página
  - Aparece automáticamente tras hacer scroll de 300px
  - Animaciones suaves de hover y click
  - Disponible globalmente en todas las páginas

### 🧰 Modificado
- **Rediseño del Header y Navegación**:
  - Logo perfectamente centrado con barras laterales de ancho fijo (200px cada una)
  - Controles reordenados: Selector de idioma → Toggle de tema
  - Colores unificados en tema oscuro para modo claro y oscuro
  - Menú móvil adaptado al tema oscuro del header
- **Integración del CategoryBanner**:
  - Colores coincidentes con el header en ambos modos
  - Estilos de botones actualizados para fondo oscuro
  - Transiciones suaves entre categorías
- **Rediseño del Header de BlogPage**:
  - Eliminado diseño tipo tarjeta para mejor integración
  - Eliminado gradiente de desvanecido en el fondo
  - Añadidos elementos decorativos animados (círculos pulsantes)
  - Margen negativo para conectar con CategoryBanner
  - Esquinas superiores redondeadas para cohesión visual
- **Mejoras en el Sistema de Temas**:
  - Configuración corregida de Tailwind CSS v4 con `@custom-variant`
  - Corregidos todos los `bg-linear-to-*` a `bg-gradient-to-*` (13 archivos)
  - Añadidas transiciones suaves (0.3s) para cambios de tema
- **Soporte de Modo Oscuro en Componentes**:
  - Refactorizados todos los componentes de layout, UI, posts y páginas
  - Estilos consistentes adaptados al tema en toda la aplicación

### 🐛 Corregido
- Problema de centrado del logo en el header
- Funcionalidad del toggle de tema con Tailwind v4
- Inconsistencias de color en el menú móvil
- Artefactos visuales en modo oscuro en varios componentes

---

## [v1.2.1] - 2025-11-15
### 🚀 Añadido
- Archivo `ads.txt` necesario para verificación de anuncios

---

## [v1.2.0] - 2025-11-15
### 🚀 Añadido
- Google AdSense integrado en la web

---

## [v1.1.0] - 2025-11-13
### 🚀 Añadido
- Modificaciones para renderizar el texto de los posts correctamente (soporte Markdown)

---

## [v1.0.0] - 2025-11-12
### 🚀 Añadido
- Sistema completo de newsletter con integración a Supabase y Resend
- Confirmación de suscripciones vía correo electrónico
- Seguridad avanzada con Row-Level Security (RLS) en la base de datos
- Implementación estable de todas las funcionalidades principales del blog
- Integración total con servicios externos para manejo de usuarios y envíos

### 🧰 Modificado
- Estructura del proyecto consolidada y estable
- Proceso de despliegue completo y optimizado en Vercel
- Pipeline de CI/CD configurado y funcionando de manera confiable
- Mejoras generales en rendimiento y mantenimiento del código

---

## [v0.4.1] - 2025-11-10
### 🐛 Corregido
- Correcciones en `vercel.json` en cuanto a enrutamiento

---

## [v0.4.0] - 2025-11-10
### 🧰 Modificado
- Referencias públicas actualizadas para apuntar a `www.arkeonixlabs.com` y al nuevo logo
- Refactorización de código

---

## [v0.3.0] - 2025-11-05
### 🚀 Añadido
- Página **About** con soporte multilenguaje
- Página **Contact** actualizada con traducciones y estilo coherente con el blog
- Página **Terms of Use** con estructura legal y soporte en inglés y español
- Página **Privacy Policy** con traducciones y formato profesional
- Página **Cookies Policy** con integración de `react-cookie-consent` y traducción multilenguaje
- Componente global de **Cookie Banner** añadido a `App.tsx`
- Integración de **react-icons** reemplazando `lucide-react`
- Reestructuración del **Header** con diseño minimalista, soporte responsive y selector de idioma
- Mejoras visuales en **Footer** y coherencia cromática con el tema oscuro
- Mejoras visuales en **PostPage**
- Incorporación del sistema de traducción `useLocale` en todas las páginas estáticas
- Mejoras en el **InfiniteCarousel** con bordes redondeados, difuminado lateral y alineación visual

### 🧰 Modificado
- Eliminación completa de `lucide-react` y actualización a `react-icons`
- Ajustes visuales generales para adaptar el tema oscuro en todo el sitio
- Estilos de `BlogPage` mejorados con fondos degradados, sombras y animaciones suaves
- `loadPage` encapsulado con `useCallback` para corregir dependencias de React Hook
- Banner de cookies añadido globalmente con soporte de idioma dinámico

---

## [v0.2.0] - 2025-11-05
### 🚀 Añadido
- Implementación de CHANGELOG

---

## [v0.1.0] - 2025-11-05
### 🚀 Añadido
- Implementación de tags automáticos en CD
- Configuración de despliegue continuo en Vercel

### 🧰 Modificado
- Flujo Git mejorado: feature → develop → main → tag → deploy

---

## [v0.0.1] - 2025-10-28
### 🧱 Añadido
- CI básico (build, lint, test)
- Integración inicial con Supabase

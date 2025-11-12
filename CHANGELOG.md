# 🧾 Changelog — Arkeon Blog

> Registro de versiones del proyecto, sincronizado con los tags de GitHub.


---

## [v1.0.0] - 2025-11-12
### 🚀 Added
- Sistema completo de newsletter con integración a Supabase y Resend.
- Confirmación de suscripciones vía correo electrónico.
- Seguridad avanzada con Row-Level Security (RLS) en la base de datos.
- Implementación estable de todas las funcionalidades principales del blog.
- Integración total con servicios externos para manejo de usuarios y envíos.
  
### 🧰 Changed
- Estructura del proyecto consolidada y estable.
- Proceso de despliegue completo y optimizado en Vercel.
- Pipeline de CI/CD configurado y funcionando de manera confiable.
- Mejoras generales en rendimiento y mantenimiento del código.


---

## [v0.4.1] - 2025-11-10
### 🧰 Changed
- Correcciones en vercel.json en cuanto a enrrutamiento.


---

## [v0.4.0] - 2025-11-10
### 🧰 Changed
- Referencias públicas actualizadas para apuntar a `www.arkeontech.es` y al nuevo favicon.
- Refactorización de código

---

## [v0.3.0] - 2025-11-05
### 🚀 Added
- Página **About** con soporte multilenguaje.
- Página **Contact** actualizada con traducciones y estilo coherente con el blog.
- Página **Terms of Use** con estructura legal y soporte en inglés y español.
- Página **Privacy Policy** con traducciones y formato profesional.
- Página **Cookies Policy** con integración de `react-cookie-consent` y traducción multilenguaje.
- Componente global de **Cookie Banner** añadido a `App.tsx`.
- Integración de **react-icons** reemplazando `lucide-react`.
- Reestructuración del **Header** con diseño minimalista, soporte responsive y selector de idioma con clic.
- Mejoras visuales en **Footer** y coherencia cromática con el tema oscuro.
- Mejoras visuales en **PostPage**
- Incorporación del sistema de traducción `useLocale` en todas las páginas estáticas.
- Mejoras en el **InfiniteCarousel** con bordes redondeados, difuminado lateral y alineación visual coherente.

### 🧰 Changed
- Eliminación completa de `lucide-react` y actualización a `react-icons`.
- Ajustes visuales generales para adaptar el tema oscuro en todo el sitio.
- Estilos de `BlogPage` mejorados con fondos degradados, sombras y animaciones suaves.
- `loadPage` encapsulado con `useCallback` para corregir dependencias de React Hook.
- Banner de cookies añadido globalmente con soporte de idioma dinámico.

---

## [v0.2.0] - 2025-11-05
### 🚀 Added
- Implementación de CHANGELOG

---

## [v0.1.0] - 2025-11-05
### 🚀 Added
- Implementación de tags automáticos en CD.
- Configuración de despliegue continuo en Vercel.

### 🧰 Changed
- Flujo Git mejorado: feature → develop → main → tag → deploy.

---

## [v0.0.1] - 2025-10-28
### 🧱 Added
- CI básico (build, lint, test).
- Integración inicial con Supabase.

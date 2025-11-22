# 🧾 Changelog — Arkeon Blog

> Registro de versiones del proyecto, sincronizado con los tags de GitHub.


---

## [v1.3.1] - 2025-11-22
### 🧰 Modificado
  - Adaptación de imágenes de cards de posts para que se ajusten tamaño predeterminado de cada imagen.  
  
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
  - Apariencia más limpia y dinámica

- **Mejoras en el Sistema de Temas**:
  - Configuración corregida de Tailwind CSS v4 con `@custom-variant`
  - Corregidos todos los `bg-linear-to-*` a `bg-gradient-to-*` (13 archivos)
  - Añadidas transiciones suaves (0.3s) para cambios de tema
  - BlogPage: Fondo blanco limpio en modo claro

- **Soporte de Modo Oscuro en Componentes**:
  - Refactorizados todos los componentes de layout, UI, posts y páginas
  - Estilos consistentes adaptados al tema en toda la aplicación
  - Mejor contraste y legibilidad en ambos modos

### 🐛 Corregido
- Problema de centrado del logo en el header
- Funcionalidad del toggle de tema con Tailwind v4
- Inconsistencias de color en el menú móvil
- Artefactos visuales en modo oscuro en varios componentes

---

## [v1.2.1] - 2025-11-15
### 🚀 Añadido
- Archivo txt necesario para anuncios
  
---

## [v1.2.0] - 2025-11-15
### 🚀 Añadido
- Google ads añadidos a la web.
  
---

## [v1.1.0] - 2025-11-13
### 🚀 Añadido
- Modificaciones para poder renderizar el texto de los posts.
  
---

## [v1.0.0] - 2025-11-12
### 🚀 Añadido
- Sistema completo de newsletter con integración a Supabase y Resend.
- Confirmación de suscripciones vía correo electrónico.
- Seguridad avanzada con Row-Level Security (RLS) en la base de datos.
- Implementación estable de todas las funcionalidades principales del blog.
- Integración total con servicios externos para manejo de usuarios y envíos.
  
### 🧰 Modificado
- Estructura del proyecto consolidada y estable.
- Proceso de despliegue completo y optimizado en Vercel.
- Pipeline de CI/CD configurado y funcionando de manera confiable.
- Mejoras generales en rendimiento y mantenimiento del código.


---

## [v0.4.1] - 2025-11-10
### 🧰 Modificado
- Correcciones en vercel.json en cuanto a enrrutamiento.


---

## [v0.4.0] - 2025-11-10
### 🧰 Modificado
- Referencias públicas actualizadas para apuntar a `www.arkeontech.es` y al nuevo favicon.
- Refactorización de código

---

## [v0.3.0] - 2025-11-05
### 🚀 Añadido
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

### 🧰 Modificado
- Eliminación completa de `lucide-react` y actualización a `react-icons`.
- Ajustes visuales generales para adaptar el tema oscuro en todo el sitio.
- Estilos de `BlogPage` mejorados con fondos degradados, sombras y animaciones suaves.
- `loadPage` encapsulado con `useCallback` para corregir dependencias de React Hook.
- Banner de cookies añadido globalmente con soporte de idioma dinámico.

---

## [v0.2.0] - 2025-11-05
### 🚀 Añadido
- Implementación de CHANGELOG

---

## [v0.1.0] - 2025-11-05
### 🚀 Añadido
- Implementación de tags automáticos en CD.
- Configuración de despliegue continuo en Vercel.

### 🧰 Modificado
- Flujo Git mejorado: feature → develop → main → tag → deploy.

---

## [v0.0.1] - 2025-10-28
### 🧱 Añadido
- CI básico (build, lint, test).
- Integración inicial con Supabase.

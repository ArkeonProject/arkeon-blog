# 🚀 Arkeonix Labs

**Arkeonix Labs** es una plataforma moderna creada para los amantes de la tecnología, el análisis y la innovación.  
Combina diseño limpio, rendimiento excepcional y contenido cuidadosamente seleccionado para ofrecer **noticias tecnológicas actualizadas, comparativas detalladas y análisis objetivos de productos** que ayudan a los usuarios a mantenerse informados y tomar mejores decisiones de compra.

---

## 🧠 Visión del proyecto

En un entorno donde la información se mueve más rápido que nunca, **Arkeonix Labs** nace con el propósito de ofrecer un espacio confiable y accesible donde la tecnología se entiende, se compara y se disfruta.

Nuestra misión es **traducir la complejidad del mundo tech** en artículos claros, comparativas útiles y guías honestas, manteniendo siempre una mirada objetiva y una presentación visual moderna.

---

## ✨ Qué ofrece Arkeonix Labs

### 📰 Noticias tecnológicas
Cobertura de las últimas tendencias, lanzamientos y novedades del ecosistema tecnológico global.  
Desde avances en inteligencia artificial hasta nuevos dispositivos, Arkeonix Labs te mantiene al día con un tono informativo y accesible.

### ⚙️ Comparativas y análisis
Análisis detallados de productos tecnológicos (smartphones, auriculares, monitores, gadgets del hogar, etc.), con un enfoque **neutral y basado en datos**.  
Cada comparativa está pensada para ayudar al lector a **decidir con confianza** qué producto se adapta mejor a sus necesidades.

### 💡 Recomendaciones inteligentes
Selecciones curadas de los mejores productos del momento, con enlaces directos de afiliación a Amazon y otros comercios, **sin publicidad invasiva** ni intereses ocultos.

### 🌐 Sistema multiidioma
Contenido disponible en español e inglés, con detección automática y selector manual de idioma, pensado para llegar a una audiencia internacional sin perder identidad.

### 📱 Experiencia fluida
Una interfaz **minimalista y completamente responsive**, optimizada para una lectura agradable tanto en escritorio como en dispositivos móviles.

---

## 🧩 Arquitectura y diseño

**Arkeonix Labs** está construido sobre una arquitectura moderna, ligera y eficiente.  
Combina las mejores tecnologías del ecosistema web actual:

- ⚛️ **React 19 + TypeScript 5.9** – Interfaz dinámica, componentes reutilizables y tipado estricto para máxima robustez.  
- 💨 **Vite + TailwindCSS** – Build ultrarrápido y diseño adaptable con un enfoque utilitario.  
- 🔗 **Supabase (PostgreSQL + API REST)** – Backend ágil para gestionar publicaciones, autores y suscriptores de newsletter.  
- 🔐 **DOMPurify + Marked** – Renderizado seguro y eficiente de contenido Markdown.  
- 🌍 **React Router + React Helmet** – Navegación fluida con optimización SEO integrada.

El resultado: una aplicación **SPA** rápida, optimizada y segura, que se comporta como una experiencia nativa.

---

## 🗂️ Estructura del proyecto

```text
arkeonix-labs/
├── .github/
│   ├── workflows/          # CI/CD (lint + deploy)
│   │   ├── ci.yml
│   │   └── deploy.yml
│   ├── release-drafter.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                   # Manuales y estrategia
│   ├── git-strategy.md
│   └── releases.md
├── public/                 # Assets estáticos (favicon, manifest, icons)
│   ├── icons/
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── assets/illustrations
│   ├── components/
│   │   ├── layout/         # Header, Footer, etc.
│   │   ├── posts/          # PostCard, FeaturedPostCard, PostList
│   │   ├── forms/          # NewsletterForm
│   │   └── ui/             # Button, Card
│   ├── context/            # LocaleProvider
│   ├── hooks/              # useLocale, useSupabaseQuery
│   ├── lib/                # supabase, analytics, cookies
│   ├── pages/
│   ├── router/             # AppRouter
│   ├── styles/
│   └── types/
├── tests/
│   ├── components/
│   └── pages/
├── vercel.json             # Configuración de despliegue
└── vite.config.ts
```

Todo el código nuevo respeta esta jerarquía, haciendo más fácil localizar componentes y mantener responsabilidades bien separadas.

---

## 🧭 Estructura de contenido

El modelo de datos se centra en la simplicidad y la escalabilidad, con dos entidades principales:

### 🗞️ `posts`
Contiene las publicaciones del blog:
- `id` — Identificador único  
- `title` — Título del artículo  
- `slug` — URL amigable  
- `excerpt` — Extracto o resumen  
- `content` — Texto completo en Markdown  
- `cover_image` — Imagen destacada   
- `author` — Autor del artículo  
- `language` — Idioma (`ES` / `EN`)  
- `published_at` — Fecha de publicación  

### 📬 `newsletter_subscribers`
Registra a los usuarios que desean recibir las últimas noticias y comparativas:
- `email` — Dirección de correo  
- `created_at` — Fecha de suscripción  

---

## 💡 Filosofía de diseño

El diseño de Arkeonix Labs se basa en tres principios:

| Principio | Descripción |
|------------|--------------|
| **Claridad** | Cada publicación está presentada de forma limpia, sin distracciones. |
| **Velocidad** | Tiempo de carga mínimo gracias a una arquitectura ligera y dependencias optimizadas. |
| **Accesibilidad** | Navegación intuitiva, soporte multiidioma y diseño responsive. |

---

## 🔍 Por qué Arkeonix Labs es diferente

A diferencia de otros portales tecnológicos, **Arkeonix Labs** combina **rigor técnico, transparencia y estética**.  
No busca solo informar, sino **crear una experiencia editorial digital** que invite a leer, comparar y descubrir.

- 🧭 Orientado al usuario: interfaz pensada para la lectura, no para el clic.  
- 📊 Objetivo y verificable: cada dato y análisis proviene de fuentes contrastadas.  
- 🧠 Humano y accesible: lenguaje claro, sin tecnicismos innecesarios.  

---

## 📈 En resumen

| Aspecto | Descripción |
|----------|--------------|
| 📰 **Contenido** | Noticias tecnológicas, comparativas y recomendaciones |
| ⚙️ **Tecnología** | React, Supabase, Vite, TailwindCSS |
| 🌍 **Idiomas** | Español e Inglés |
| 📬 **Interacción** | Newsletter y sistema de comentarios (en desarrollo) |
| 💡 **Objetivo** | Ser un referente de calidad y transparencia en divulgación tecnológica |

---

<div align="center">

💜 **Arkeonix Labs** — Tecnología con propósito, análisis con criterio y diseño con alma.  
Construido con pasión por **David López**.

</div>

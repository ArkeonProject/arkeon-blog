import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  // Redirección de index a /blog está en el root.tsx o Layout
  // Rutas públicas base bajo un Layout general (opcional si Layout está dentro de root)
  // Usaremos Layout desde root.tsx que emula a <Layout /> de AppRouter.tsx
  route("/", "pages/HomePage.tsx", { id: "home" }),
  route("blog", "pages/BlogPage.tsx", { id: "blog-listing" }),
  route("recursos", "pages/RecursosPage.tsx"),
  route("herramientas", "pages/HerramientasPage.tsx"),
  route("herramientas/calculadora-salario", "pages/herramientas/CalculadoraSalarioPage.tsx"),
  route("calculadora-salario", "routes/calculadora-redirect.ts"),
  route("lab", "pages/LabPage.tsx"),
  route("lab/:slug", "pages/LabPostPage.tsx"),
  route("post/:slug", "pages/PostPage.tsx"),
  
  route("contact", "pages/ContactPage.tsx"),
  route("about", "pages/AboutPage.tsx"),
  route("privacy", "pages/PrivacyPolicyPage.tsx"),
  route("terms", "pages/TermsPage.tsx"),
  route("cookies", "pages/CookiesPolicyPage.tsx"),
  route("affiliate-disclosure", "pages/AffiliateDisclosurePage.tsx"),
  
  route("newsletter/confirm", "pages/newsletter/ConfirmPage.tsx"),
  route("recursos/saas-boilerplate", "pages/ArkeonixPage.tsx"),
  route("saas-boilerplate", "routes/saas-boilerplate-redirect.ts"),
  route("arkeonix", "routes/arkeonix-redirect.ts"),
  route("arkeonix/gracias", "routes/arkeonix-thanks-redirect.ts"),
  route("admin", "pages/AdminPage.tsx"),
  
  // Auth routes
  route("login", "pages/auth/LoginPage.tsx"),
  route("register", "pages/auth/RegisterPage.tsx"),
  route("reset-password", "pages/auth/ResetPasswordPage.tsx"),
  
  // Guía Junior
  route("recursos/guia-junior", "pages/guia-junior/LandingPage.tsx"),
  route("recursos/guia-junior/gracias", "pages/guia-junior/ThanksPage.tsx"),
  route("guia-junior", "routes/guia-junior-redirect.ts"),
  route("guia-junior/gracias", "routes/guia-junior-thanks-redirect.ts"),
  
  // Protected routes will still use their internal guards or loaders
  route("recursos/guia-junior/dashboard", "pages/guia-junior/DashboardProtectedPage.tsx"),
  route("recursos/guia-junior/capitulo/:slug", "pages/guia-junior/ChapterPage.tsx"),
  route("guia-junior/dashboard", "routes/guia-junior-dashboard-redirect.ts"),
  route("guia-junior/capitulo/:slug", "routes/guia-junior-chapter-redirect.ts"),

  // Academia
  route("academia", "pages/academia/AcademiaPage.tsx"),
  route("academia/gracias", "pages/academia/ThanksPage.tsx"),
  route("academia/:category", "pages/academia/AcademiaCategoryPage.tsx"),
  route("academia/:category/:slug", "pages/academia/AcademiaExamPage.tsx"),

  // API resource routes — must be before the wildcard
  route("api/guia-checkout", "routes/api.guia-checkout.ts"),
  route("api/academia-checkout", "routes/api.academia-checkout.ts"),
  route("api/academia-grade", "routes/api.academia-grade.ts"),
  route("api/boilerplate-checkout", "routes/api.boilerplate-checkout.ts"),
  route("api/guia-webhook", "routes/api.guia-webhook.ts"),
  route("api/customer-portal", "routes/api.customer-portal.ts"),
  route("api/guia-chapter", "routes/api.guia-chapter.ts"),
  route("api/newsletter-subscribe", "routes/api.newsletter-subscribe.ts"),
  route("api/og", "routes/api.og.ts"),

  // Fallback 404
  route("*", "pages/NotFoundPage.tsx"),
] satisfies RouteConfig;

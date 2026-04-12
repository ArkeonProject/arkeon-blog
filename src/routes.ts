import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  // Redirección de index a /blog está en el root.tsx o Layout
  // Rutas públicas base bajo un Layout general (opcional si Layout está dentro de root)
  // Usaremos Layout desde root.tsx que emula a <Layout /> de AppRouter.tsx
  route("/", "pages/BlogPage.tsx", { id: "home" }),
  route("blog", "pages/BlogPage.tsx", { id: "blog-listing" }),
  route("recursos", "pages/RecursosPage.tsx"),
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
  route("arkeonix", "pages/ArkeonixPage.tsx"),
  route("arkeonix/gracias", "pages/arkeonix/ThanksPage.tsx"),
  route("admin", "pages/AdminPage.tsx"),
  
  // Auth routes
  route("login", "pages/auth/LoginPage.tsx"),
  route("register", "pages/auth/RegisterPage.tsx"),
  route("reset-password", "pages/auth/ResetPasswordPage.tsx"),
  
  // Guía Junior
  route("guia-junior", "pages/guia-junior/LandingPage.tsx"),
  route("guia-junior/gracias", "pages/guia-junior/ThanksPage.tsx"),
  
  // Protected routes will still use their internal guards or loaders
  route("guia-junior/dashboard", "pages/guia-junior/DashboardPage.tsx"),
  route("guia-junior/capitulo/:slug", "pages/guia-junior/ChapterPage.tsx"),

  // Academia
  route("academia", "pages/academia/AcademiaPage.tsx"),
  route("academia/:category", "pages/academia/AcademiaCategoryPage.tsx"),
  route("academia/:category/:slug", "pages/academia/AcademiaExamPage.tsx"),

  // API resource routes — must be before the wildcard
  route("api/guia-checkout", "routes/api.guia-checkout.ts"),
  route("api/academia-checkout", "routes/api.academia-checkout.ts"),
  route("api/boilerplate-checkout", "routes/api.boilerplate-checkout.ts"),
  route("api/guia-webhook", "routes/api.guia-webhook.ts"),
  route("api/customer-portal", "routes/api.customer-portal.ts"),
  route("api/guia-chapter", "routes/api.guia-chapter.ts"),
  route("api/newsletter-subscribe", "routes/api.newsletter-subscribe.ts"),
  route("api/og", "routes/api.og.ts"),

  // Fallback 404
  route("*", "pages/NotFoundPage.tsx"),
] satisfies RouteConfig;

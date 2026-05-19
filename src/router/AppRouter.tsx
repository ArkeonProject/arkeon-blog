import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, useParams } from "react-router";
import { useEffect } from "react";
import CookieConsent from "react-cookie-consent";
import HomePage from "@/pages/HomePage";
import BlogPage from "@/pages/BlogPage";
import PostPage from "@/pages/PostPage";
import ContactPage from "@/pages/ContactPage";
import AboutPage from "@/pages/AboutPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsPage from "@/pages/TermsPage";
import CookiesPolicyPage from "@/pages/CookiesPolicyPage";
import AffiliateDisclosurePage from "@/pages/AffiliateDisclosurePage";
import ConfirmPage from "@/pages/newsletter/ConfirmPage";
import NewsPage from "@/pages/NewsPage";
import LabPage from "@/pages/LabPage";
import LabPostPage from "@/pages/LabPostPage";
import ArkeonixPage from "@/pages/ArkeonixPage";
import AdminPage from "@/pages/AdminPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import GuiaLandingPage from "@/pages/guia-junior/LandingPage";
import GuiaThanksPage from "@/pages/guia-junior/ThanksPage";
import GuiaDashboardPage from "@/pages/guia-junior/DashboardPage";
import GuiaChapterPage from "@/pages/guia-junior/ChapterPage";
import AcademiaPage from "@/pages/academia/AcademiaPage";
import AcademiaThanksPage from "@/pages/academia/ThanksPage";
import AcademiaCategoryPage from "@/pages/academia/AcademiaCategoryPage";
import AcademiaExamPage from "@/pages/academia/AcademiaExamPage";
import HerramientasPage from "@/pages/HerramientasPage";
import CalculadoraSalarioPage from "@/pages/herramientas/CalculadoraSalarioPage";
import RecursosPage from "@/pages/RecursosPage";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
import { useLocale } from "@/hooks/useLocale";
import { COOKIE_CONSENT_NAME } from "@/lib/cookies";

function RouteScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function LegacyGuiaChapterRedirect() {
  const { slug } = useParams();
  const rawSlug = slug ?? "antes-de-empezar";
  const isValidSlug = /^[a-z0-9-]+$/i.test(rawSlug);
  const safeSlug = isValidSlug ? rawSlug : "antes-de-empezar";
  return <Navigate to={`/recursos/guia-junior/capitulo/${encodeURIComponent(safeSlug)}`} replace />;
}

function Layout() {
  const { t } = useLocale();
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <RouteScrollToTop />
      <Header />
      <main className="grow container mx-auto px-4 pt-24 pb-12">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <CookieConsent
        location="bottom"
        buttonText={t("cookies_accept")}
        cookieName={COOKIE_CONSENT_NAME}
        containerClasses="glass-nav font-body !bottom-4 !left-4 !right-4 !w-auto rounded-2xl shadow-2xl border border-border"
        style={{
          background: "var(--color-glass)",
          color: "var(--color-foreground)",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        buttonStyle={{
          background: "var(--color-primary)",
          color: "var(--color-primary-foreground)",
          borderRadius: "var(--radius-md)",
          fontWeight: "600",
          fontSize: "13px",
          padding: "10px 20px",
          margin: "10px",
        }}
        expires={365}
      >
        <span className="opacity-90">{t("cookies_banner_text")}{" "}</span>
        <a
          href="/cookies"
          className="text-primary font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity"
        >
          {t("footer_cookies")}
        </a>
      </CookieConsent>
    </div>
  );
}

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/recursos" element={<RecursosPage />} />
            <Route path="/herramientas" element={<HerramientasPage />} />
            <Route path="/herramientas/calculadora-salario" element={<CalculadoraSalarioPage />} />
            <Route path="/calculadora-salario" element={<Navigate to="/herramientas/calculadora-salario" replace />} />
            <Route path="/lab" element={<LabPage />} />
            <Route path="/lab/:slug" element={<LabPostPage />} />
            <Route path="/post/:slug" element={<PostPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiesPolicyPage />} />
            <Route path="/affiliate-disclosure" element={<AffiliateDisclosurePage />} />
            <Route path="/newsletter/confirm" element={<ConfirmPage />} />
            <Route path="/recursos/saas-boilerplate" element={<ArkeonixPage />} />
            <Route path="/saas-boilerplate" element={<Navigate to="/recursos/saas-boilerplate" replace />} />
            <Route path="/arkeonix" element={<Navigate to="/recursos/saas-boilerplate" replace />} />
            <Route path="/arkeonix/gracias" element={<Navigate to="/recursos/saas-boilerplate" replace />} />
            <Route path="/admin" element={<AdminPage />} />

            {/* Auth routes - públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Guía Junior - públicas */}
            <Route path="/recursos/guia-junior" element={<GuiaLandingPage />} />
            <Route path="/recursos/guia-junior/gracias" element={<GuiaThanksPage />} />
            <Route path="/guia-junior" element={<Navigate to="/recursos/guia-junior" replace />} />
            <Route path="/guia-junior/gracias" element={<Navigate to="/recursos/guia-junior/gracias" replace />} />

            {/* Guía Junior - protegidas (requieren auth + acceso pagado) */}
            <Route path="/recursos/guia-junior/dashboard" element={
              <ProtectedRoute requiredProduct="guia_junior" allowOpenSourceBypass>
                <GuiaDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/recursos/guia-junior/capitulo/:slug" element={<GuiaChapterPage />} />
            <Route path="/guia-junior/dashboard" element={<Navigate to="/recursos/guia-junior/dashboard" replace />} />
            <Route path="/guia-junior/capitulo/:slug" element={<LegacyGuiaChapterRedirect />} />

            {/* Academia */}
            <Route path="/academia" element={<AcademiaPage />} />
            <Route path="/academia/gracias" element={<AcademiaThanksPage />} />
            <Route path="/academia/:category" element={<AcademiaCategoryPage />} />
            <Route path="/academia/:category/:slug" element={<AcademiaExamPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

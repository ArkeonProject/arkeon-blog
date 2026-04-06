import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import CookieConsent from "react-cookie-consent";
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
import RecursosPage from "@/pages/RecursosPage";
import ArkeonixPage from "@/pages/ArkeonixPage";
import AdminPage from "@/pages/AdminPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import GuiaLandingPage from "@/pages/guia-junior/LandingPage";
import GuiaThanksPage from "@/pages/guia-junior/ThanksPage";
import GuiaDashboardPage from "@/pages/guia-junior/DashboardPage";
import GuiaChapterPage from "@/pages/guia-junior/ChapterPage";
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
            <Route path="/" element={<Navigate to="/blog" replace />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/recursos" element={<RecursosPage />} />
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
            <Route path="/arkeonix" element={<ArkeonixPage />} />
            <Route path="/admin" element={<AdminPage />} />

            {/* Auth routes - públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Guía Junior - públicas */}
            <Route path="/guia-junior" element={<GuiaLandingPage />} />
            <Route path="/guia-junior/gracias" element={<GuiaThanksPage />} />

            {/* Guía Junior - protegidas (requieren auth + acceso pagado) */}
            <Route path="/guia-junior/dashboard" element={
              <ProtectedRoute requiredProduct="guia_junior">
                <GuiaDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/guia-junior/capitulo/:slug" element={<GuiaChapterPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

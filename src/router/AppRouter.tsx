import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import CookieConsent from "react-cookie-consent";
import BlogPage from "../pages/BlogPage";
import PostPage from "../pages/PostPage";
import ContactPage from "../pages/ContactPage";
import AboutPage from "../pages/AboutPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import TermsPage from "../pages/TermsPage";
import CookiesPolicyPage from "../pages/CookiesPolicyPage";
import ConfirmPage from "../pages/newsletter/ConfirmPage";
import NewsPage from "../pages/NewsPage";
import LabPage from "../pages/LabPage";
import LabPostPage from "../pages/LabPostPage";
import ProductsPage from "../pages/ProductsPage";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/ui/ScrollToTop";
import { useLocale } from "../hooks/useLocale";
import { COOKIE_CONSENT_NAME } from "../lib/cookies";

function Layout() {
  const { t } = useLocale();
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
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
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/blog" replace />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/lab/:slug" element={<LabPostPage />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiesPolicyPage />} />
          <Route path="/newsletter/confirm" element={<ConfirmPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

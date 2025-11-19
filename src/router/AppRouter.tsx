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
import ProductsPage from "../pages/ProductsPage";
import Header from "../components/layout/Header";
import CategoryBanner from "../components/layout/CategoryBanner";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/ui/ScrollToTop";
import { useLocale } from "../hooks/useLocale";
import { COOKIE_CONSENT_NAME } from "../lib/cookies";

function Layout() {
  const { t } = useLocale();
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-900 dark:bg-gradient-to-b dark:from-[#0a1628] dark:via-[#0d1f38] dark:to-[#060f1a] dark:text-white transition-colors duration-300">
      <Header />
      <CategoryBanner />
      <main className="grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <CookieConsent
        location="bottom"
        buttonText={t("cookies_accept")}
        cookieName={COOKIE_CONSENT_NAME}
        style={{
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
          fontSize: "14px",
          textAlign: "center",
        }}
        buttonStyle={{
          background: "#007EAD",
          color: "white",
          borderRadius: "8px",
          fontWeight: "600",
          padding: "8px 16px",
        }}
        expires={365}
      >
        {t("cookies_banner_text")}{" "}
        <a
          href="/cookies"
          className="text-[#00aaff] underline hover:text-[#007EAD] transition-colors duration-300"
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

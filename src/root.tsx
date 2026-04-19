import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "react-router";
import { useEffect } from "react";
import CookieConsent from "react-cookie-consent";
import { HelmetProvider, Helmet } from "react-helmet-async";

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { useLocale } from "@/hooks/useLocale";
import { COOKIE_CONSENT_NAME } from "@/lib/cookies";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";

import "./styles/index.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-MTHC7PSV');` }} />

        <Meta />
        <Links />

        {/* Fallback meta tags — overridden by each route's meta export */}
        <title>Arkeonix Labs — Precisión Técnica</title>
        <meta name="description" content="Análisis técnicos detallados y vanguardia tecnológica bajo el estándar de Arkeonix Labs." />
        <meta name="author" content="David López" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://arkeonixlabs.com/" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://arkeonixlabs.com/" />
        <meta property="og:site_name" content="Arkeonix Labs" />
        <meta property="og:title" content="Arkeonix Labs — Precisión Técnica" />
        <meta property="og:description" content="Análisis técnicos detallados y vanguardia tecnológica bajo el estándar de Arkeonix Labs." />
        <meta property="og:image" content="https://arkeonixlabs.com/arkeonix-logo.png" />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:locale:alternate" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Arkeonix Labs — Precisión Técnica" />
        <meta name="twitter:description" content="Análisis técnicos detallados y vanguardia tecnológica bajo el estándar de Arkeonix Labs." />
        <meta name="twitter:image" content="https://arkeonixlabs.com/arkeonix-logo.png" />

        {/* JSON-LD: Organization + WebSite */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Arkeonix Labs",
          "url": "https://arkeonixlabs.com",
          "logo": "https://arkeonixlabs.com/arkeonix-logo.png",
          "description": "Análisis técnicos detallados y vanguardia tecnológica bajo el estándar de Arkeonix Labs.",
          "sameAs": [
            "https://github.com/ArkeonProject",
            "https://www.linkedin.com/in/david-l%C3%B3pez-santamar%C3%ADa-946965260/"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "url": "https://arkeonixlabs.com/contact"
          }
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Arkeonix Labs",
          "url": "https://arkeonixlabs.com",
          "description": "Análisis técnicos detallados y vanguardia tecnológica bajo el estándar de Arkeonix Labs.",
          "inLanguage": ["es", "en"],
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://arkeonixlabs.com/blog?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}} />

        <meta name="theme-color" content="#00aaff" />
        <link rel="icon" type="image/png" href="/arkeonix-logo.png" />
        <link rel="apple-touch-icon" href="/arkeonix-logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="me" href="https://github.com/ArkeonProject" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

        {/* AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4754704679096236" crossOrigin="anonymous"></script>

        {/* Impact.com verification */}
        <meta name="impact-site-verification" content="4523a10c-aa16-4890-8092-0571f75c46f6" />

      </head>
      <body>
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MTHC7PSV" height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
        </noscript>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function GlobalLayout() {
  const { t } = useLocale();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:font-semibold focus:text-sm"
      >
        {t("a11y_skip_link")}
      </a>
      <header>
        <Header />
      </header>
      <main id="main" className="grow container mx-auto px-4 pt-24 pb-12">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      {typeof window !== "undefined" && (
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
      )}
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <LocaleProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </LocaleProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

function AppContent() {
  const { locale } = useLocale();
  const location = useLocation();
  
  return (
    <div key={location.pathname} className="animate-reveal">
      <Helmet>
        <html lang={locale} />
      </Helmet>
      <GlobalLayout />
    </div>
  );
}

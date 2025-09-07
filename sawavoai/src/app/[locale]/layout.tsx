import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ReactNode, Suspense } from "react";
import "../globals.css";
import { AuthProvider } from "../../contexts/AuthContext";
import type { Metadata } from "next";
import ConditionalNavigation from "../../components/ConditionalNavigation";
import FloatingChatWidget from "@/components/chat/FloatingChatWidget";
import { GoogleAnalytics } from "../../components/analytics/GoogleAnalytics";
import ResourceHints from "../../components/performance/ResourceHints";
import ErrorBoundary from "../../components/performance/ErrorBoundary";

export const dynamic = "force-static";

// Generate static paths for both locales - Next.js 15 best practice
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

// Optimized metadata generation for Next.js 15
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Sawavo - Professional Skincare Solutions",
    description:
      "Advanced AI-powered skincare analysis and personalized recommendations",
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://Sawavo.com"
    ),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
    openGraph: {
      title: "Sawavo - Professional Skincare Solutions",
      description:
        "Advanced AI-powered skincare analysis and personalized recommendations",
      locale: locale,
      type: "website",
    },
    other: {
      // Performance hints
      "format-detection": "telephone=no",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Validate that the incoming `locale` parameter is valid
  const locales = ["en", "ar"];
  if (!locales.includes(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      style={{ backgroundColor: "white" }}
    >
      <head>
        {/* Use Suspense to wrap the component that uses client-side hooks */}
        <Suspense>
          <GoogleAnalytics />
        </Suspense>

        {/* Critical resource hints for performance */}
        <link rel="dns-prefetch" href="https://Sawavo.com" />
        <link rel="preconnect" href="https://Sawavo.com" crossOrigin="" />

        {/* Performance optimizations */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ffffff" />

        {/* Mobile viewport optimization for Speed Index */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />

        {/* Resource hints for performance optimization */}
        <ResourceHints locale={locale} />

        {/* Critical CSS for LCP optimization */}
      </head>
      <body
        className="bg-white antialiased"
        style={{ backgroundColor: "white" }}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <ErrorBoundary>
              <ConditionalNavigation>{children}</ConditionalNavigation>
            </ErrorBoundary>
          </AuthProvider>
        </NextIntlClientProvider>

        {/* Ensure a body-level container exists so the floating widget cannot be nested in other layout nodes */}
        <div id="Sawavo-floating-widget" />
        <FloatingChatWidget />
      </body>
    </html>
  );
}

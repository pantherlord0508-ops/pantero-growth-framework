import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const interVariable = "font-inter";
const spaceGroteskVariable = "font-space-grotesk";

export const metadata: Metadata = {
  metadataBase: new URL("https://pantero.vercel.app"),
  title: {
    default: "Pantero | Offline Community, Marketplace & AI for African Youth",
    template: "%s | Pantero",
  },
  description:
    "Pantero - Africa's first offline community workspace, marketplace & AI platform for African youth. Learn coding, get AI mentorship, trade, and build your tech career - even without internet. Built by a FUTO undergraduate.",
  keywords: [
    "Pantero",
    "offline platform Africa",
    "African tech platform",
    "community workspace Africa",
    "marketplace Africa",
    "African youth tech",
    "learn programming Africa",
    "AI companion Africa",
    "offline AI",
    "Web3 Africa",
    "blockchain credentials",
    "digital skills Africa",
    "tech marketplace Africa",
    "coding courses Africa",
    "youth tech platform",
    "African marketplace",
    "offline learning Africa",
    "FUTO",
    "Nigeria tech",
    "African startup",
  ],
  generator: "Pantero",
  applicationName: "Pantero",
  referrer: "strict-origin-when-cross-origin",
  authors: [{ name: "Pantero Team", url: "https://pantero.vercel.app" }],
  creator: "Pantero",
  publisher: "Pantero",
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
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://pantero.vercel.app",
    languages: {
      en: "https://pantero.vercel.app",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pantero.vercel.app",
    siteName: "Pantero",
    title: "Pantero | Offline Community, Marketplace & AI for African Youth",
    description:
      "Africa's first offline community workspace, marketplace & AI platform. Connect, trade, learn coding, and access AI mentorship - even without internet.",
    images: [
      {
        url: "https://pantero.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pantero - Offline Community, Marketplace & AI for African Youth",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pantero | Offline Community, Marketplace & AI for African Youth",
    description:
      "Africa's first offline community workspace, marketplace & AI platform. Connect, trade, learn without internet.",
    images: ["https://pantero.vercel.app/og-image.jpg"],
    creator: "@pantero",
    site: "@pantero",
  },
  verification: {
    google: "google2b791bc8e1e3a5c3",
  },
  category: "technology",
  classification: "Web Application",
  other: {
    "geo.region": "NG",
    "geo.placename": "Nigeria",
    "ICBM": "0, 0",
    "application-name": "Pantero",
    "msapplication-TileColor": "#0a0e17",
    "theme-color": "#0a0e17",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e17",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Pantero",
    url: "https://pantero.vercel.app",
    logo: "https://pantero.vercel.app/og-image.jpg",
    description: "Africa's first offline community workspace, marketplace & AI platform for African youth. Learn coding, get AI mentorship, trade, and build your tech career - even without internet.",
    sameAs: [
      "https://twitter.com/pantero",
      "https://tiktok.com/@panteroprelaunch",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableHours: "24/7",
    },
    areaServed: {
      "@type": "Place",
      name: "Africa",
    },
    serviceType: ["AI Companion", "Community Workspace", "Marketplace", "Learning Hub", "Web3 Credentials"],
    foundingLocation: {
      "@type": "Place",
      name: "Nigeria",
    },
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: 10,
    },
  };

  const webappJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Pantero",
    url: "https://pantero.vercel.app",
    description: "Africa's first offline community workspace, marketplace & AI platform. Connect, trade, learn, and access AI - even without internet.",
    applicationCategory: "EducationApplication",
    operatingSystem: "Web, Android, iOS",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "Pantero",
      url: "https://pantero.vercel.app",
    },
    browserRequirements: "Requires JavaScript",
    permissions: "internet",
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="framework" content="Next.js" />
        <meta name="author" content="Pantero Team" />
        <meta name="publisher" content="Pantero" />
        
        {/* Favicon - Multiple formats for better compatibility */}
        <link rel="icon" type="image/svg+xml" href="https://pantero.vercel.app/favicon.svg" />
        <link rel="icon" type="image/jpeg" href="https://pantero.vercel.app/favicon.jpg" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://pantero.vercel.app/favicon.jpg" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://pantero.vercel.app/favicon.jpg" />
        <link rel="apple-touch-icon" href="https://pantero.vercel.app/favicon.jpg" />
        <link rel="shortcut icon" href="https://pantero.vercel.app/favicon.svg" />
        
        {/* Theme & Mobile */}
        <meta name="theme-color" content="#0a0e17" />
        <meta name="apple-mobile-web-app-title" content="Pantero" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0a0e17" />
        <meta name="msapplication-TileImage" content="https://pantero.vercel.app/favicon.jpg" />
        
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Sitemap */}
        <link rel="sitemap" type="application/xml" title="Sitemap" href="https://pantero.vercel.app/sitemap.xml" />
        
        {/* SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="HandheldFriendly" content="True" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webappJsonLd) }}
        />
      </head>
      <body
        className={`${interVariable} ${spaceGroteskVariable} font-body antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
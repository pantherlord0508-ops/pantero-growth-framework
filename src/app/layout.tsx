import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { favicon } from "lucide-react";

const interVariable = "font-inter";
const spaceGroteskVariable = "font-space-grotesk";

export const metadata: Metadata = {
  metadataBase: new URL("https://pantero.vercel.app"),
  title: {
    default: "Pantero | Offline Community, Marketplace & AI for African Youth",
    template: "%s | Pantero",
  },
  description:
    "Pantero - Africa's first offline community workspace, marketplace & AI platform. Connect, trade, learn coding, and access AI mentorship without internet. Built by a FUTO undergraduate.",
  keywords: [
    "Pantero",
    "offline platform Africa",
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
  ],
  generator: "Pantero",
  applicationName: "Pantero",
  referrer: "strict-origin-when-cross-origin",
  authors: [{ name: "Pantero Team" }],
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
      "Africa's first offline community workspace, marketplace & AI platform. Connect, trade, learn, and access AI without internet.",
    images: [
      {
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
    creator: "@pantero",
  },
  other: {
    "geo.region": "AF",
    "geo.placename": "Africa",
    "ICBM": "0, 0",
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
    description: "The all-in-one ecosystem for African youth to explore, pursue, and succeed in tech careers. AI mentorship, courses, community, marketplace — powered by Web3.",
    sameAs: [
      "https://twitter.com/pantero",
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
    serviceType: ["AI Mentorship", "Tech Education", "Social Network", "Marketplace", "Web3 Credentials"],
  };

  const webappJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Pantero",
    url: "https://pantero.vercel.app",
    description: "All-in-one tech ecosystem for African youth: AI mentorship, courses, community, marketplace with Web3 credentials",
    applicationCategory: "EducationApplication",
    operatingSystem: "Web",
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
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="framework" content="" />
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="alternate" type="application/rss+xml" title="Pantero Blog" href="/rss.xml" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
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
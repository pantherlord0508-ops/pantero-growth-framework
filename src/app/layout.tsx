import type { Metadata, Viewport } from "next";
// import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// Replaced next/font/google with hardcoded links in <head> to bypass build-time network errors
const interVariable = "font-inter";
const spaceGroteskVariable = "font-space-grotesk";

export const metadata: Metadata = {
  title: "Pantero - Own Your Identity. Shape Your Path.",
  description:
    "Pantero gives every African a secure digital identity, an AI companion that speaks your language, and direct access to jobs and skills that matter.",
  keywords: ["Pantero", "digital identity", "Africa", "AI", "waitlist"],
  generator: "Pantero",
  applicationName: "Pantero",
  referrer: "strict-origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "Pantero",
    title: "Pantero - Own Your Identity. Shape Your Path.",
    description:
      "Pantero gives every African a secure digital identity, an AI companion that speaks your language, and direct access to jobs and skills that matter.",
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
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="framework" content="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
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

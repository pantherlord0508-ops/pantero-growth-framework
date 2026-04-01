import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

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
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

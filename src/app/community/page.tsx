"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PartyPopper, ArrowRight } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";
import ReferralDashboard from "@/components/referral-dashboard";

export default function CommunityPage() {
  const router = useRouter();
  const [signupData, setSignupData] = useState<{
    referral_code: string;
    position: number;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("pantero_signed_up");
    const code = localStorage.getItem("pantero_referral_code");
    const position = localStorage.getItem("pantero_position");

    if (!stored || !code) {
      router.push("/join");
      return;
    }

    setSignupData({
      referral_code: code,
      position: position ? parseInt(position, 10) : 0,
    });
  }, [router]);

  if (!signupData) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </main>
        <Footer />
      </>
    );
  }

  const whatsappUrl =
    process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL || "https://chat.whatsapp.com";

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-radial pt-24 pb-16">
        <div className="container">
          <div className="mx-auto max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-10 text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
                <PartyPopper className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                You&apos;re <span className="text-gradient-gold">In!</span>
              </h1>
              <p className="mt-3 text-muted-foreground">
                Welcome to the Pantero waitlist. Your spot is secured.
              </p>
              {signupData.position > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 font-display text-lg font-semibold text-primary"
                >
                  Your position: #{signupData.position}
                </motion.p>
              )}
            </motion.div>

            {/* WhatsApp Join */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-10 rounded-xl border border-border bg-card p-6 text-center"
            >
              <h2 className="font-display text-lg font-bold text-foreground">
                Join Our WhatsApp Community
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Connect with other early members, get updates, and help shape Pantero.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-8 py-4 font-display text-base font-semibold text-white shadow-lg transition-all hover:bg-[#20BD5A] hover:shadow-xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Join WhatsApp Community
                <ArrowRight className="h-5 w-5" />
              </a>
            </motion.div>

            {/* Referral Dashboard */}
            <ReferralDashboard
              referralCode={signupData.referral_code}
              position={signupData.position}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <Link
                href="/"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                &larr; Back to home
              </Link>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, Trophy, Users, Loader2 } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";
import SignupForm from "@/components/signup-form";

interface ReferrerInfo {
  full_name: string;
  referral_count: number;
  position: number;
}

export default function ReferralPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [referrer, setReferrer] = useState<ReferrerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!code) {
      router.push("/join");
      return;
    }

    fetch(`/api/referral?code=${encodeURIComponent(code)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setReferrer(data.user);
        } else {
          setError(true);
          setTimeout(() => router.push("/join"), 2000);
        }
      })
      .catch(() => {
        setError(true);
        setTimeout(() => router.push("/join"), 2000);
      })
      .finally(() => setLoading(false));
  }, [code, router]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading referral...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !referrer) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Referral code not found. Redirecting...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-radial pt-24 pb-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            {/* Referrer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                <span className="text-gradient-gold">{referrer.full_name}</span> invited you
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
                Join Pantero and get early access to Africa&apos;s digital identity platform.
              </p>

              <div className="mx-auto mt-8 flex max-w-sm items-center justify-center gap-6">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <Trophy className="mx-auto mb-2 h-5 w-5 text-primary" />
                  <p className="font-display text-xl font-bold text-foreground">
                    #{referrer.position}
                  </p>
                  <p className="text-xs text-muted-foreground">Their Position</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <Users className="mx-auto mb-2 h-5 w-5 text-primary" />
                  <p className="font-display text-xl font-bold text-foreground">
                    {referrer.referral_count}
                  </p>
                  <p className="text-xs text-muted-foreground">Referrals</p>
                </div>
              </div>
            </motion.div>

            {/* Signup Form with pre-filled referral code */}
            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-col justify-center"
              >
                <h2 className="font-display text-xl font-bold text-foreground">
                  What you get:
                </h2>
                <ul className="mt-4 space-y-3">
                  {[
                    "A secure decentralized digital identity",
                    "AI companion in your language",
                    "Access to jobs matched to your skills",
                    "Verifiable credentials & certificates",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <SignupForm referral_code={code} />
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}

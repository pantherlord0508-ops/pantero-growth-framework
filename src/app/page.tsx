/**
 * Home page — landing page for the Pantero waitlist.
 *
 * Composes section components: Hero, Recent Signups Ticker,
 * Signup Form, Features Grid, and CTA.
 */

"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";
import { HeroSection } from "@/components/sections/HeroSection";
import { RecentSignupsTicker } from "@/components/sections/RecentSignupsTicker";
import { SignupSection } from "@/components/sections/SignupSection";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import RoadmapSection from "@/components/RoadmapSection";

const CTASection = dynamic(() => import("@/components/sections/CTASection").then((mod) => mod.CTASection), {
  ssr: false,
  loading: () => <div className="py-24 md:py-32" />,
});

interface RecentSignup {
  name: string;
  time: string;
}

export default function HomePage() {
  const [recentSignups, setRecentSignups] = useState<RecentSignup[]>([]);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.recent_signups) {
          setRecentSignups(data.recent_signups);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <HeroSection />
      <RecentSignupsTicker signups={recentSignups} />
      <SignupSection />
      <FeaturesGrid />
      <RoadmapSection />
      <CTASection />
      <Footer />
      <WhatsAppButton />
    </>
  );
}

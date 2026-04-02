/**
 * Home page — landing page for the Pantero waitlist.
 *
 * Composes section components: Hero, Recent Signups Ticker,
 * Signup Form, Features Grid, and CTA.
 */

"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";
import { HeroSection } from "@/components/sections/HeroSection";
import { RecentSignupsTicker } from "@/components/sections/RecentSignupsTicker";
import { SignupSection } from "@/components/sections/SignupSection";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { CTASection } from "@/components/sections/CTASection";
import RoadmapSection from "@/components/RoadmapSection";

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

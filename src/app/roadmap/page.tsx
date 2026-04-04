import { Metadata } from "next";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";
import RoadmapSection from "@/components/RoadmapSection";

export const metadata: Metadata = {
  title: "Roadmap - Our Product Roadmap",
  description: "Explore Pantero's product roadmap with timeline for digital identity, AI companion, and job marketplace features for Africa.",
  keywords: ["Pantero roadmap", "product roadmap Africa", "digital identity roadmap", "AI companion features", "job marketplace timeline"],
};

export default function RoadmapPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-8">
        <RoadmapSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

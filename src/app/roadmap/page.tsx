import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";
import RoadmapSection from "@/components/RoadmapSection";
import { CTASection } from "@/components/sections/CTASection";

export default function RoadmapPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-8">
        <RoadmapSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

import dynamic from "next/dynamic";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";
import RoadmapSection from "@/components/RoadmapSection";

const CTASection = dynamic(() => import("@/components/sections/CTASection").then((mod) => mod.CTASection), {
  ssr: false,
  loading: () => <div className="py-24 md:py-32" />,
});

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

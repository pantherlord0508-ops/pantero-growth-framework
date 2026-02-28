import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import SocialProofSection from "@/components/SocialProofSection";
import RoadmapSection from "@/components/RoadmapSection";
import EarlyAccessSection from "@/components/EarlyAccessSection";
import RecommendationSection from "@/components/RecommendationSection";
import ReferralSection from "@/components/ReferralSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";
import FAQBot from "@/components/FAQBot";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <ProblemSection />
    <SolutionSection />
    <HowItWorksSection />
    <SocialProofSection />
    <RoadmapSection />
    <EarlyAccessSection />
    <RecommendationSection />
    <ReferralSection />
    <FinalCTASection />
    <Footer />
    <FAQBot />
  </div>
);

export default Index;

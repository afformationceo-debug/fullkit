import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingCTA } from "@/components/layout/FloatingCTA";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { QuickStartSection } from "@/components/landing/QuickStartSection";
import { ServiceShowcase } from "@/components/landing/ServiceShowcase";
import { PortfolioShowcase } from "@/components/landing/PortfolioShowcase";
import { IndustryTargeting } from "@/components/landing/IndustryTargeting";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { TestimonialsCarousel } from "@/components/landing/TestimonialsCarousel";
import { BlogPreview } from "@/components/landing/BlogPreview";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <QuickStartSection />
        <ServiceShowcase />
        <PortfolioShowcase />
        <IndustryTargeting />
        <ProcessSection />
        <TestimonialsCarousel />
        <BlogPreview />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}

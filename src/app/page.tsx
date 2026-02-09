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
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  // Fetch latest published blog posts for the preview section
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select(
      "slug, title, excerpt, category, reading_time_minutes, cover_image_url, published_at"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

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
        <BlogPreview
          posts={(posts || []) as Array<Record<string, unknown>>}
        />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}

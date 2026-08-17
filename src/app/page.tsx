import { HeroSection } from "@/components/hero/HeroSection";
import { OpportunitySection } from "@/components/sections/OpportunitySection";
import { StatsBand } from "@/components/sections/StatsBand";
import { SectorsSection } from "@/components/sections/SectorsSection";
import { EntrepreneursSection } from "@/components/sections/EntrepreneursSection";
import { ProgramSection } from "@/components/sections/ProgramSection";
import { TerritorySection } from "@/components/sections/TerritorySection";
import { VisionSection } from "@/components/sections/VisionSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ImpactStatement } from "@/components/sections/ImpactStatement";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { SupportCta } from "@/components/sections/SupportCta";
import { Newsletter } from "@/components/sections/Newsletter";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <OpportunitySection />
      <StatsBand />
      <SectorsSection />
      <EntrepreneursSection />
      <ProgramSection />
      <TerritorySection />
      <VisionSection />
      <AboutSection />
      <ImpactStatement />
      <PartnersSection />
      <SupportCta />
      <Newsletter />
      <Footer />
    </>
  );
}

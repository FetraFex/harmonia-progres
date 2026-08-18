import { HeroSection } from "@/components/hero/HeroSection";
import { OpportunitySection } from "@/components/sections/OpportunitySection";
import { LocalEconomySection } from "@/components/sections/LocalEconomySection";
import { EntrepreneursProgramSection } from "@/components/sections/EntrepreneursProgramSection";
import { TerritoryImpactSection } from "@/components/sections/TerritoryImpactSection";
import { VisionMissionSection } from "@/components/sections/VisionMissionSection";
import { PartnershipCTA } from "@/components/sections/PartnershipCTA";
import { NewsletterFooter } from "@/components/sections/NewsletterFooter";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <OpportunitySection />
      <LocalEconomySection />
      <EntrepreneursProgramSection />
      <TerritoryImpactSection />
      <VisionMissionSection />
      <PartnershipCTA />
      <NewsletterFooter />
    </>
  );
}

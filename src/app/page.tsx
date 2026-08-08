import { HeroSection } from "@/components/hero/HeroSection";
import { StatsBand } from "@/components/sections/StatsBand";
import { Mission } from "@/components/sections/Mission";
import { Actions } from "@/components/sections/Actions";
import { Presence } from "@/components/sections/Presence";
import { Testimonial } from "@/components/sections/Testimonial";
import { PartnersMarquee } from "@/components/sections/PartnersMarquee";
import { DonationCta } from "@/components/sections/DonationCta";
import { Newsletter } from "@/components/sections/Newsletter";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBand />
      <Mission />
      <Actions />
      <Presence />
      <Testimonial />
      <PartnersMarquee />
      <DonationCta />
      <Newsletter />
      <Footer />
    </>
  );
}

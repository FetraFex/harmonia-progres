import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Mission } from "@/components/sections/Mission";
import { Programs } from "@/components/sections/Programs";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Mission />
      <Programs />
    </>
  );
}

import type { Metadata } from "next";
import { createMetadata } from "@/seo/metadata";
import { Mission } from "@/components/sections/Mission";

export const metadata: Metadata = createMetadata({
  title: "About Us",
  description:
    "Learn about Harmonia Progres — our mission, vision, and objectives for supporting entrepreneurship in Manakara.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-text sm:text-5xl">
            About Harmonia Progres
          </h1>
          <p className="mt-6 text-lg text-text-secondary">
            We are a non-governmental organization dedicated to empowering local
            entrepreneurship in Manakara, Madagascar.
          </p>
        </div>
      </div>
      <Mission />
    </div>
  );
}

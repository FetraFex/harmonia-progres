import type { Metadata } from "next";
import { createMetadata } from "@/seo/metadata";
import { Programs } from "@/components/sections/Programs";

export const metadata: Metadata = createMetadata({
  title: "Our Programs",
  description:
    "Discover our four pillars of support: Training, Technical Assistance, Financing, and Networking for entrepreneurs in Manakara.",
  path: "/programs",
});

export default function ProgramsPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-text sm:text-5xl">
            Our Programs
          </h1>
          <p className="mt-6 text-lg text-text-secondary">
            Comprehensive support designed to nurture entrepreneurship at every
            stage of the journey.
          </p>
        </div>
      </div>
      <Programs />
    </div>
  );
}

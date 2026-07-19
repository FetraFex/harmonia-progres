import type { Metadata } from "next";
import { createMetadata } from "@/seo/metadata";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = createMetadata({
  title: "Partners",
  description: "Organizations and institutions partnering with Harmonia Progres.",
  path: "/partners",
});

export default function PartnersPage() {
  return (
    <>
      <PageHeader
        title="Our Partners"
        description="We collaborate with organizations that share our vision for a thriving Manakara."
      />
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-text-secondary">
            Partners content coming soon.
          </p>
        </div>
      </div>
    </>
  );
}

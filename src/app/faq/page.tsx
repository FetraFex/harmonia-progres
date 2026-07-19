import type { Metadata } from "next";
import { createMetadata } from "@/seo/metadata";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = createMetadata({
  title: "FAQ",
  description: "Frequently asked questions about Harmonia Progres and our programs.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <>
      <PageHeader
        title="Frequently Asked Questions"
        description="Find answers to common questions about our organization and programs."
      />
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-text-secondary">
            FAQ content coming soon.
          </p>
        </div>
      </div>
    </>
  );
}

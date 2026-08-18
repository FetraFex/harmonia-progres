import type { Metadata } from "next";
import { createMetadata } from "@/seo/metadata";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = createMetadata({
  title: "Donate",
  description: "Support our mission to empower entrepreneurs in Manakara.",
  path: "/donate",
});

export default function DonatePage() {
  return (
    <>
      <PageHeader
        title="Support Our Mission"
        description="Your donation helps us empower the next generation of entrepreneurs in Manakara."
      />
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-text-secondary">
            Donation form coming soon.
          </p>
        </div>
      </div>
    </>
  );
}

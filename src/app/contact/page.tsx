import type { Metadata } from "next";
import { createMetadata } from "@/seo/metadata";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description: "Get in touch with Harmonia Progres — we'd love to hear from you.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Us"
        description="Have questions or want to get involved? Reach out to our team."
      />
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-text-secondary">
            Contact form coming soon.
          </p>
        </div>
      </div>
    </>
  );
}

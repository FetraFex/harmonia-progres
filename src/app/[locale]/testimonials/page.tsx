import type { Metadata } from "next";
import { createMetadata } from "@/seo/metadata";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = createMetadata({
  title: "Testimonials",
  description: "Stories and feedback from entrepreneurs we've supported.",
  path: "/testimonials",
});

export default function TestimonialsPage() {
  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Hear from the entrepreneurs and community members whose lives have been transformed."
      />
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-text-secondary">
            Testimonials content coming soon.
          </p>
        </div>
      </div>
    </>
  );
}

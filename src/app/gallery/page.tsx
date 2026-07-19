import type { Metadata } from "next";
import { createMetadata } from "@/seo/metadata";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = createMetadata({
  title: "Gallery",
  description: "Photos and moments from our programs, events, and community impact.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        title="Gallery"
        description="A visual journey through our programs, events, and the entrepreneurs we serve."
      />
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-text-secondary">
            Gallery content coming soon.
          </p>
        </div>
      </div>
    </>
  );
}

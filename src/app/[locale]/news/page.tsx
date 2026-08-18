import type { Metadata } from "next";
import { createMetadata } from "@/seo/metadata";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = createMetadata({
  title: "News",
  description: "Latest news and updates from Harmonia Progres and our community.",
  path: "/news",
});

export default function NewsPage() {
  return (
    <>
      <PageHeader
        title="News"
        description="Stay updated with the latest news, stories, and announcements from our community."
      />
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-text-secondary">
            News content coming soon.
          </p>
        </div>
      </div>
    </>
  );
}

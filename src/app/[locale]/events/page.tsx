import type { Metadata } from "next";
import { createMetadata } from "@/seo/metadata";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = createMetadata({
  title: "Events",
  description: "Upcoming events, workshops, and community gatherings in Manakara.",
  path: "/events",
});

export default function EventsPage() {
  return (
    <>
      <PageHeader
        title="Events"
        description="Join us at our upcoming workshops, training sessions, and community events."
      />
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-text-secondary">
            Events content coming soon.
          </p>
        </div>
      </div>
    </>
  );
}

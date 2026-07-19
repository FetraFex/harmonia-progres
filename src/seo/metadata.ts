import type { Metadata } from "next";
import { SITE } from "@/constants";

interface PageSEO {
  title: string;
  description: string;
  path?: string;
}

export function createMetadata({ title, description, path = "" }: PageSEO): Metadata {
  const url = `${SITE.url}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://harmonia-progres.org"),
  title: {
    default: "Harmonia Progres — Supporting Local Entrepreneurship in Manakara",
    template: "%s | Harmonia Progres",
  },
  description:
    "Harmonia Progres supports local entrepreneurship in Manakara, Madagascar through training, technical assistance, networking, and access to financing.",
  keywords: [
    "NGO",
    "Manakara",
    "Madagascar",
    "entrepreneurship",
    "training",
    "financing",
    "local development",
  ],
  authors: [{ name: "Harmonia Progres" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://harmonia-progres.org",
    siteName: "Harmonia Progres",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

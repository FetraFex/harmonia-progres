import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import { Toaster } from "sonner";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://harmonia-progres.org"),
  title: "Harmonia Progr\u00e8s \u2014 Soutenir l\u2019entrepreneuriat local \u00e0 Manakara",
  description:
    "Harmonia Progr\u00e8s accompagne les jeunes, artisans, p\u00eacheurs et entrepreneurs de Manakara gr\u00e2ce \u00e0 la formation, l\u2019assistance technique et l\u2019acc\u00e8s au financement.",
  keywords: [
    "ONG",
    "Harmonia Progr\u00e8s",
    "Manakara",
    "Madagascar",
    "Entrepreneuriat",
    "Formation",
    "D\u00e9veloppement local",
    "Artisans",
    "P\u00eacheurs",
    "Jeunes entrepreneurs",
  ],
  authors: [{ name: "Harmonia Progr\u00e8s" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://harmonia-progres.org",
    siteName: "Harmonia Progr\u00e8s",
    title: "Harmonia Progr\u00e8s \u2014 Soutenir l\u2019entrepreneuriat local \u00e0 Manakara",
    description:
      "Construire l\u2019avenir entrepreneurial de Manakara. Accompagner les jeunes, artisans et entrepreneurs locaux.",
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
      lang="fr"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-void text-text-primary font-body flex flex-col relative selection:bg-teal selection:text-void">
        <ScrollProgressBar />
        <AmbientBackground />
        <main className="flex-1 relative z-10">{children}</main>
        <Toaster position="top-right" richColors theme="dark" />
      </body>
    </html>
  );
}

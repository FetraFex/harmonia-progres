import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Instrument_Serif, Geist } from "next/font/google";
import { Toaster } from "sonner";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
  title: "Harmonia Progrès — Soutenir l’entrepreneuriat local à Manakara",
  icons: {
    icon: "/images/logo/shortcut-icon.png",
    shortcut: "/images/logo/shortcut-icon.png",
    apple: "/images/logo/shortcut-icon.png",
  },
  description:
    "Harmonia Progrès accompagne les jeunes, artisans, pêcheurs et entrepreneurs de Manakara grâce à la formation, l’assistance technique et l’accès au financement.",
  keywords: [
    "ONG",
    "Harmonia Progrès",
    "Manakara",
    "Madagascar",
    "Entrepreneuriat",
    "Formation",
    "Développement local",
    "Artisans",
    "Pêcheurs",
    "Jeunes entrepreneurs",
  ],
  authors: [{ name: "Harmonia Progrès" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://harmonia-progres.org",
    siteName: "Harmonia Progrès",
    title: "Harmonia Progrès — Soutenir l’entrepreneuriat local à Manakara",
    description:
      "Construire l’avenir entrepreneurial de Manakara. Accompagner les jeunes, artisans et entrepreneurs locaux.",
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
      className={cn("h-full", "antialiased", spaceGrotesk.variable, inter.variable, jetbrainsMono.variable, instrumentSerif.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent theme flash: apply stored/system theme before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.classList.toggle('dark',t==='dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})();`,
          }}
        />
      </head>
      <body
        className="min-h-full bg-void text-text-primary font-body flex flex-col relative selection:bg-teal selection:text-on-void"
        suppressHydrationWarning
      >
        <AuthProvider>
          <ThemeProvider>
            <ScrollProgressBar />
            <AmbientBackground />
            <main className="flex-1 relative z-10">{children}</main>
            <Toaster position="top-right" richColors theme="system" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

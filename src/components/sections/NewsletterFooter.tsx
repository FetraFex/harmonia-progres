"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const footerColumns = [
  {
    title: "PROJET",
    links: [
      { label: "Jeunes Entrepreneurs", href: "#programme" },
      { label: "Notre mission", href: "#vision" },
      { label: "Programme", href: "#programme" },
    ],
  },
  {
    title: "SECTEURS",
    links: [
      { label: "Artisanat", href: "#secteurs" },
      { label: "Halieutique", href: "#secteurs" },
      { label: "Agriculture", href: "#secteurs" },
    ],
  },
  {
    title: "TERRITOIRE",
    links: [
      { label: "Manakara", href: "#territoire" },
      { label: "Vohipeno", href: "#territoire" },
      { label: "Fitovinany", href: "#territoire" },
    ],
  },
  {
    title: "PARTICIPER",
    links: [
      { label: "Candidater", href: "#programme" },
      { label: "Devenir partenaire", href: "#partenaires" },
      { label: "Contact", href: "#contact" },
    ],
  },
];

export function NewsletterFooter() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Veuillez entrer une adresse email valide.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    if (error) {
      if (error.code === "23505") {
        toast.info("Vous êtes déjà inscrit !");
      } else {
        toast.error("Une erreur est survenue. Réessayez.");
      }
    } else {
      toast.success("Inscription réussie !", {
        description: "Vous recevrez les actualités du projet HARMONIA PROGRES.",
      });
      setEmail("");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Newsletter */}
      <section
        id="newsletter"
        ref={ref}
        className="relative z-10"
        style={{ backgroundColor: "#050505" }}
      >
        <div className="px-32 max-w-[860px] mx-auto pt-24 md:pt-32 pb-16">
          <div
            className={`text-center space-y-6 transition-all duration-700 ${
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <h3
              className="font-display font-bold text-text-primary tracking-tight"
              style={{ fontSize: "clamp(24px, 3vw, 40px)" }}
            >
              Suivre l&apos;aventure HARMONIA PROGRES
            </h3>

            <p className="text-sm sm:text-base text-text-secondary max-w-md mx-auto">
              Recevez les actualités du projet, les opportunités de candidature
              et les initiatives menées dans la région.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Adresse email
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                required
                className="w-full px-5 py-3.5 rounded-full bg-white/[0.06] border border-white/[0.12] focus:border-teal text-text-primary text-sm placeholder:text-text-muted transition-colors outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-teal text-void font-bold text-sm hover:bg-teal/90 transition-all hover:scale-105 active:scale-95 shadow-md shadow-teal/20 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Inscription..." : "Je m'inscris"}
              </button>
            </form>

            <p className="text-[11px] text-text-muted leading-relaxed max-w-sm mx-auto">
              En vous inscrivant, vous acceptez de recevoir nos communications.
              Vous pourrez vous désabonner à tout moment. Aucune donnée
              n&apos;est partagée avec des tiers.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t border-white/[0.08] relative z-10 pt-16 pb-12 px-32"
        style={{ backgroundColor: "#050505" }}
      >
        <div className="max-w-[1280px] mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="inline-flex items-center gap-3">
                <Image
                  src="/images/logo/logo-transparent-dark.png"
                  alt="Harmonia Progrès"
                  width={160}
                  height={44}
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
                Organisation non gouvernementale dédiée au développement
                économique et à l&apos;accompagnement des jeunes entrepreneurs,
                artisans et pêcheurs à Manakara, Madagascar.
              </p>
            </div>

            {/* Columns */}
            {footerColumns.map((col) => (
              <div key={col.title} className="space-y-3">
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
                  {col.title}
                </h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="hover:text-teal transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/[0.08] text-xs text-text-muted">
            © 2026 HARMONIA PROGRES — MIASA Jeunes Entrepreneurs
          </div>
        </div>
      </footer>
    </>
  );
}

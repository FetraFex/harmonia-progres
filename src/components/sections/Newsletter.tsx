"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { MailIcon } from "@/components/ui/Icons";

export function Newsletter() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Veuillez entrer une adresse email valide.");
      return;
    }

    toast.success("Inscription réussie !", {
      description: "Vous recevrez les actualités du projet HARMONIA PROGRES.",
    });
    setEmail("");
  };

  return (
    <section
      id="newsletter"
      ref={ref}
      className="py-16 md:py-20 px-32 max-w-[860px] mx-auto relative z-10 scroll-mt-24"
    >
      <div
        className={`glass p-8 sm:p-12 rounded-3xl border-glass-border text-center shadow-xl transition-all duration-700 ${
          isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-teal/15 text-teal border border-teal/30 mx-auto flex items-center justify-center mb-6">
          <MailIcon className="w-6 h-6" />
        </div>

        <h3 className="font-display text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          Suivre l&apos;aventure HARMONIA PROGRES
        </h3>

        <p className="mt-3 text-sm sm:text-base text-text-secondary max-w-md mx-auto">
          Recevez les actualités du projet, les opportunités de candidature et
          les initiatives menées dans la région.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre.email@exemple.com"
            required
            className="w-full px-5 py-3.5 rounded-full bg-void/80 border border-glass-border focus:border-teal text-text-primary text-sm placeholder:text-text-muted transition-colors outline-none"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-teal text-void font-bold text-sm hover:bg-teal/90 transition-all hover:scale-105 active:scale-95 shadow-md shadow-teal/20 whitespace-nowrap cursor-pointer"
          >
            Je m&apos;inscris
          </button>
        </form>

        <p className="mt-4 text-[11px] text-text-muted leading-relaxed max-w-sm mx-auto">
          En vous inscrivant, vous acceptez de recevoir nos communications.
          Vous pourrez vous désabonner à tout moment. Aucune donnée n&apos;est
          partagée avec des tiers.
        </p>
      </div>
    </section>
  );
}

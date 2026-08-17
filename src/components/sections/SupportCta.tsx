"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { ArrowRightIcon } from "@/components/ui/Icons";

export function SupportCta() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section
      id="soutenir"
      ref={ref}
      className="py-16 md:py-24 px-32 max-w-[1080px] mx-auto relative z-10 scroll-mt-24"
    >
      <div
        className={`glass p-8 sm:p-12 md:p-16 rounded-[36px] border-glass-border-strong text-center shadow-2xl relative overflow-hidden transition-all duration-700 ${
          isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs font-semibold text-teal uppercase tracking-wider">
            Soutenir le projet
          </span>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-tight">
            SOUTENIR{" "}
            <span className="font-serif italic font-normal text-teal">
              LE PROJET
            </span>
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl mx-auto">
            Institutions, entreprises, ONG, partenaires techniques et
            financiers — rejoignez le mouvement pour le développement
            économique de Manakara et du Fitovinany.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#contact"
              className="px-8 py-4 rounded-full bg-teal text-void font-display font-bold text-sm sm:text-base hover:bg-teal/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-teal/25 flex items-center gap-2"
            >
              <span>Devenir partenaire</span>
              <ArrowRightIcon className="w-4 h-4" />
            </a>

            <a
              href="#contact"
              className="px-7 py-4 rounded-full glass hover:glass-strong text-text-primary font-semibold text-sm sm:text-base transition-all flex items-center gap-2 hover:translate-x-1 border-glass-border-strong"
            >
              <span>Nous contacter</span>
              <ArrowRightIcon className="w-4 h-4 text-teal" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

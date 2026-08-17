"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

export function ImpactStatement() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className="py-20 md:py-28 px-32 max-w-[1080px] mx-auto relative z-10"
    >
      <div
        className={`text-center space-y-8 transition-all duration-700 ${
          isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="text-5xl sm:text-6xl font-serif text-teal/30 leading-none select-none">
          &ldquo;
        </div>

        <blockquote className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-text-primary leading-relaxed tracking-tight max-w-3xl mx-auto">
          Au cœur de Manakara, un mouvement se construit. Chaque jeune formé,
          chaque activité créée, chaque ressource valorisée contribue à un
          avenir économique plus durable pour la région du Fitovinany.
        </blockquote>

        <div className="pt-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            — HARMONIA PROGRES
          </span>
        </div>
      </div>
    </section>
  );
}

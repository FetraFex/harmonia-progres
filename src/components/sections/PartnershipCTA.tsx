"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { ArrowRightIcon } from "@/components/ui/Icons";

export function PartnershipCTA() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section
      id="partenaires"
      ref={ref}
      className="relative z-10"
      style={{ backgroundColor: "#050505" }}
    >
      <div className="px-32 max-w-[1280px] mx-auto py-24 md:py-32">
        <div
          className={`text-center space-y-8 transition-all duration-700 ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-teal">
            REJOINDRE LE RÉSEAU
          </span>

          <h2
            className="font-display font-bold tracking-tight text-text-primary leading-tight max-w-3xl mx-auto"
            style={{ fontSize: "clamp(28px, 4.5vw, 56px)" }}
          >
            Construisons{" "}
            <span className="text-teal">l&apos;écosystème</span>{" "}
            ensemble.
          </h2>

          <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
            Le développement local repose sur la force des connexions.
            HARMONIA PROGRES souhaite réunir entrepreneurs, producteurs,
            institutions et partenaires engagés.
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
              className="px-7 py-4 rounded-full border border-white/[0.18] bg-white/[0.05] text-white font-semibold text-sm sm:text-base transition-all hover:bg-white/[0.1] hover:translate-x-0.5 flex items-center gap-2"
            >
              <span>Soutenir le projet</span>
              <ArrowRightIcon className="w-4 h-4 text-teal" />
            </a>
          </div>

          <p className="text-xs text-text-muted pt-4">
            Un réseau d&apos;acteurs engagés pour le développement local.
          </p>
        </div>
      </div>
    </section>
  );
}

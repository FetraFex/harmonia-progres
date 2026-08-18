"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

const missions = [
  "Former",
  "Développer les compétences",
  "Faciliter la création d'activités",
  "Favoriser l'accès au financement",
  "Accompagner vers les marchés",
  "Valoriser les ressources locales",
];

export function AboutSection() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section
      id="a-propos"
      ref={ref}
      className="py-16 md:py-24 px-32 max-w-[1280px] mx-auto relative z-10 scroll-mt-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left: Qui sommes-nous */}
        <div
          className={`space-y-6 transition-all duration-700 ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            QUI SOMMES-NOUS ?
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-text-primary leading-tight">
            HARMONIA PROGRES
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            Organisation non gouvernementale dédiée au développement économique
            local dans la région de Manakara et Fitovinany, à Madagascar.
            Nous accompagnons les jeunes, artisans, pêcheurs et agriculteurs
            dans la création et le développement d&apos;activités économiques
            durables.
          </p>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            Notre approche repose sur la formation, l&apos;accompagnement
            personnalisé et la mise en réseau des acteurs locaux pour construire
            un écosystème entrepreneurial résilient.
          </p>
        </div>

        {/* Right: Notre Mission */}
        <div
          className={`transition-all duration-700 delay-200 ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            NOTRE MISSION
          </span>

          <ol className="mt-8 space-y-6">
            {missions.map((mission, idx) => (
              <li
                key={idx}
                className={`flex items-start gap-5 transition-all duration-500 ${
                  isRevealed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
                style={{ transitionDelay: `${300 + idx * 100}ms` }}
              >
                <span className="shrink-0 w-8 h-8 rounded-full border border-teal/30 bg-green/5 flex items-center justify-center font-mono text-xs font-bold text-teal">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-lg font-semibold text-text-primary pt-0.5">
                  {mission}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

const missions = [
  "Former les jeunes à l'entrepreneuriat.",
  "Développer leurs compétences techniques et professionnelles.",
  "Faciliter la création de microentreprises.",
  "Favoriser l'accès au financement.",
  "Accompagner les entrepreneurs vers les marchés.",
  "Valoriser les ressources locales.",
];

export function VisionMissionSection() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section
      id="vision"
      ref={ref}
      className="relative z-10"
      style={{ backgroundColor: "#050505" }}
    >
      {/* Vision Statement */}
      <div className="py-24 md:py-32 px-32 max-w-[1280px] mx-auto">
        <div
          className={`text-center max-w-4xl mx-auto transition-all duration-700 ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2
            className="font-display font-bold tracking-tight leading-[1.15] text-text-primary"
            style={{ fontSize: "clamp(32px, 5vw, 72px)" }}
          >
            Construire une génération de jeunes entrepreneurs{" "}
            <span className="text-teal">autonomes</span>,{" "}
            <span className="text-teal">innovants</span> et{" "}
            <span className="text-teal">responsables</span>.
          </h2>
        </div>
      </div>

      {/* Mission List */}
      <div className="px-32 max-w-[1280px] mx-auto pb-24 md:pb-32">
        <div
          className={`transition-all duration-700 delay-200 ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            NOTRE MISSION
          </span>

          <ol className="mt-10 space-y-6">
            {missions.map((mission, idx) => (
              <li
                key={idx}
                className={`flex items-start gap-5 transition-all duration-500 ${
                  isRevealed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
                style={{ transitionDelay: `${400 + idx * 100}ms` }}
              >
                <span className="shrink-0 w-8 h-8 rounded-full border border-teal/30 bg-teal/5 flex items-center justify-center font-mono text-xs font-bold text-teal">
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

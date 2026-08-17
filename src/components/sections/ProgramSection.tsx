"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

interface Step {
  number: string;
  title: string;
  items: string[];
}

const steps: Step[] = [
  {
    number: "01",
    title: "IDENTIFICATION",
    items: ["Sensibilisation", "Appel à candidature", "Sélection"],
  },
  {
    number: "02",
    title: "FORMATION",
    items: [
      "Entrepreneuriat",
      "Création d'entreprise",
      "Gestion financière",
      "Marketing",
    ],
  },
  {
    number: "03",
    title: "INCUBATION",
    items: ["Coaching", "Mentorat", "Conseil professionnel", "Suivi de projet"],
  },
  {
    number: "04",
    title: "APPUI",
    items: [
      "Équipement",
      "Kits de démarrage",
      "Appui technique",
      "Accès au financement",
    ],
  },
  {
    number: "05",
    title: "CONNEXION",
    items: ["Réseautage", "Accès aux marchés", "Commercialisation"],
  },
  {
    number: "06",
    title: "DÉVELOPPEMENT",
    items: [
      "Croissance business",
      "Autonomie",
      "Impact économique local",
    ],
  },
];

export function ProgramSection() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section
      id="programme"
      ref={ref}
      className="py-16 md:py-24 px-32 max-w-[1280px] mx-auto relative z-10 scroll-mt-24"
    >
      <div
        className={`mb-16 transition-all duration-700 ${
          isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
          LE PROGRAMME
        </span>
        <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary">
          Le parcours{" "}
          <span className="font-serif italic font-normal text-teal">
            entrepreneur
          </span>
        </h2>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/[0.08]" />

        <div className="space-y-12">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className={`relative flex gap-8 transition-all duration-700 ${
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${idx * 120}ms` }}
            >
              {/* Node */}
              <div className="relative z-10 shrink-0">
                <div className="w-10 h-10 rounded-full border-2 border-teal bg-[#050505] flex items-center justify-center">
                  <span className="font-mono text-xs font-bold text-teal">
                    {step.number}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <h3 className="font-display text-lg md:text-xl font-bold text-text-primary tracking-wide mb-3">
                  {step.title}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {step.items.map((item) => (
                    <li
                      key={item}
                      className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs font-medium text-text-secondary"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { ArrowRightIcon } from "@/components/ui/Icons";

const words = ["APPRENDRE", "ENTREPRENDRE", "CRÉER", "GRANDIR"] as const;

interface Step {
  number: string;
  title: string;
  items: string[];
}

const steps: Step[] = [
  {
    number: "01",
    title: "IDENTIFIER",
    items: ["Sensibilisation", "Appel à candidature", "Sélection"],
  },
  {
    number: "02",
    title: "FORMER",
    items: [
      "Entrepreneuriat",
      "Création d'entreprise",
      "Gestion financière",
      "Marketing",
      "Techniques de production",
    ],
  },
  {
    number: "03",
    title: "INCUBER",
    items: ["Coaching", "Mentorat", "Conseils professionnels", "Suivi"],
  },
  {
    number: "04",
    title: "ACCOMPAGNER",
    items: [
      "Équipements",
      "Kits de démarrage",
      "Appui technique",
      "Accès au financement",
    ],
  },
  {
    number: "05",
    title: "CONNECTER",
    items: ["Réseautage", "Commercialisation", "Accès aux marchés"],
  },
];

export function EntrepreneursProgramSection() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section
      id="programme"
      ref={ref}
      className="py-16 md:py-24 px-32 max-w-[1280px] mx-auto relative z-10 scroll-mt-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left: Image + Words */}
        <div className="space-y-10">
          {/* Image Placeholder */}
          <div
            className={`relative rounded-3xl overflow-hidden min-h-[320px] lg:min-h-[400px] transition-all duration-700 ${
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal/20 via-[#0a1a1a] to-[#050505]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Stacked Words */}
          <div
            className={`space-y-1 transition-all duration-700 delay-200 ${
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="block text-xs font-mono font-semibold uppercase tracking-[0.2em] text-text-muted mb-4">
              JEUNES ENTREPRENEURS
            </span>
            {words.map((word, idx) => (
              <span
                key={word}
                className={`block font-display font-bold leading-[1.1] tracking-tight transition-all duration-700 ${
                  idx === 3 ? "text-teal" : "text-text-primary"
                } ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{
                  fontSize: "clamp(36px, 4.5vw, 60px)",
                  transitionDelay: `${400 + idx * 100}ms`,
                }}
              >
                {word}
              </span>
            ))}
          </div>

          <p
            className={`text-base text-text-secondary leading-relaxed max-w-md transition-all duration-700 delay-600 ${
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Un programme dédié aux jeunes de Manakara et Vohipeno pour
            transformer leurs idées en activités économiques viables et
            durables.
          </p>
        </div>

        {/* Right: Program Timeline */}
        <div
          className={`transition-all duration-700 delay-300 ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-text-primary mb-10">
            Le parcours{" "}
            <span className="font-serif italic font-normal text-teal">
              entrepreneur
            </span>
          </h3>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/[0.08]" />

            <div className="space-y-10">
              {steps.map((step, idx) => (
                <div
                  key={step.number}
                  className={`relative flex gap-6 transition-all duration-700 ${
                    isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${500 + idx * 120}ms` }}
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
                  <div className="flex-1 pb-2">
                    <h4 className="font-display text-base md:text-lg font-bold text-text-primary tracking-wide mb-2">
                      {step.title}
                    </h4>
                    <ul className="flex flex-wrap gap-1.5">
                      {step.items.map((item) => (
                        <li
                          key={item}
                          className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-[11px] font-medium text-text-secondary"
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

          <div className="mt-10">
            <a
              href="#territoire"
              className="inline-flex items-center gap-2 font-semibold text-teal hover:text-teal/80 transition-colors group"
            >
              <span>Découvrir le territoire</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

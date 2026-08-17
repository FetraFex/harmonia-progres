"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { ArrowRightIcon } from "@/components/ui/Icons";

interface Sector {
  number: string;
  title: string;
  description: string;
  gradient: string;
}

const sectors: Sector[] = [
  {
    number: "01",
    title: "ARTISANAT",
    description:
      "Nattes, paniers, raphia, vannerie — valoriser le savoir-faire local et ouvrir de nouveaux marchés aux artisans de Manakara.",
    gradient: "from-amber-900/40 via-amber-800/20 to-transparent",
  },
  {
    number: "02",
    title: "HALIEUTIQUE",
    description:
      "Pêche, conservation, transformation et commercialisation — structurer la filière poisson pour une économie durable.",
    gradient: "from-blue-900/40 via-blue-800/20 to-transparent",
  },
  {
    number: "03",
    title: "AGRICULTURE",
    description:
      "Riziculture, semences améliorées, productivité — accompagner les jeunes entrepreneurs agricoles vers l'autonomie.",
    gradient: "from-emerald-900/40 via-emerald-800/20 to-transparent",
  },
];

export function SectorsSection() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section
      id="secteurs"
      ref={ref}
      className="py-16 md:py-24 px-32 max-w-[1280px] mx-auto relative z-10 scroll-mt-24"
    >
      <div
        className={`space-y-4 mb-16 transition-all duration-700 ${
          isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
          NOS SECTEURS
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary">
          Trois filières{" "}
          <span className="font-serif italic font-normal text-teal">
            prioritaires
          </span>
        </h2>
      </div>

      <div className="space-y-6">
        {sectors.map((sector, idx) => (
          <article
            key={sector.number}
            className={`group relative overflow-hidden rounded-3xl border border-white/[0.06] hover:border-teal/20 transition-all duration-500 cursor-pointer ${
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${idx * 150}ms` }}
          >
            <div className="flex flex-col md:flex-row">
              {/* Image Placeholder */}
              <div className="relative w-full md:w-80 h-48 md:h-auto shrink-0 overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${sector.gradient} transition-transform duration-700 group-hover:scale-110`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-7xl md:text-8xl font-bold text-white/[0.06] select-none">
                    {sector.number}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-8 md:p-10 flex flex-col justify-between gap-6 bg-white/[0.02]">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-teal font-semibold tracking-wider">
                      {sector.number}
                    </span>
                    <div className="h-px flex-1 bg-white/[0.06] group-hover:bg-teal/20 transition-colors duration-500" />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-text-primary group-hover:text-teal transition-colors duration-300">
                    {sector.title}
                  </h3>
                  <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl">
                    {sector.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted group-hover:text-teal transition-colors">
                  <span>Explorer</span>
                  <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Accent Indicator Line */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-teal transition-all duration-700" />
          </article>
        ))}
      </div>
    </section>
  );
}

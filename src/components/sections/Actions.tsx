"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { WaterIcon, ClimateIcon, EducationIcon, ArrowRightIcon } from "@/components/ui/Icons";

export function Actions() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();

  const actions = [
    {
      icon: WaterIcon,
      accent: "teal",
      title: "Eau & assainissement",
      description:
        "Forages, points d'eau et systèmes de filtration dans les zones rurales les plus exposées au stress hydrique.",
    },
    {
      icon: ClimateIcon,
      accent: "coral",
      title: "Résilience climatique",
      description:
        "Formation des agriculteurs locaux aux techniques résilientes et aux systèmes d'alerte précoce.",
    },
    {
      icon: EducationIcon,
      accent: "green",
      title: "Éducation",
      description:
        "Bourses et infrastructures scolaires dans les communautés où nous intervenons déjà sur l'eau.",
    },
  ];

  return (
    <section
      id="actions"
      ref={ref}
      className="py-16 md:py-24 px-4 max-w-[1280px] mx-auto relative z-10 scroll-mt-24"
    >
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary">
          Nos piliers d&apos;
          <span className="font-serif italic font-normal text-teal">action</span>
        </h2>
        <p className="text-base text-text-secondary">
          Des interventions ciblées à fort impact, financées directement sur le terrain.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {actions.map((act, idx) => {
          const IconComp = act.icon;
          return (
            <div
              key={idx}
              className={`glass hover:glass-strong p-8 rounded-3xl border-glass-border hover:border-glass-border-strong transition-all duration-500 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group ${
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div className="space-y-6">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${
                    act.accent === "teal"
                      ? "bg-green/15 text-teal border border-teal/30"
                      : act.accent === "coral"
                      ? "bg-coral/15 text-coral border border-coral/30"
                      : "bg-green/15 text-green border border-green/30"
                  }`}
                >
                  <IconComp className="w-7 h-7" />
                </div>

                <h3 className="font-display text-2xl font-bold text-text-primary group-hover:text-teal transition-colors">
                  {act.title}
                </h3>

                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                  {act.description}
                </p>
              </div>

              <div className="pt-8">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted group-hover:text-teal transition-colors">
                  <span>En savoir plus</span>
                  <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

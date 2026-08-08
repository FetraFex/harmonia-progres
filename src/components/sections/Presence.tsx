"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { GlobeIcon } from "@/components/ui/Icons";

export function Presence() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();

  const countries = [
    { name: "Sénégal", projects: 84, color: "bg-teal" },
    { name: "Kenya", projects: 62, color: "bg-coral" },
    { name: "Madagascar", projects: 51, color: "bg-green" },
    { name: "Bangladesh", projects: 45, color: "bg-teal" },
    { name: "Pérou", projects: 38, color: "bg-coral" },
    { name: "Népal", projects: 29, color: "bg-green" },
    { name: "Éthiopie", projects: 22, color: "bg-teal" },
    { name: "Haïti", projects: 18, color: "bg-coral" },
  ];

  return (
    <section
      id="presence"
      ref={ref}
      className="py-16 md:py-24 px-4 max-w-[1280px] mx-auto relative z-10 scroll-mt-24"
    >
      <div className="glass p-8 md:p-14 rounded-3xl border-glass-border shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-teal/10 blur-[100px] pointer-events-none" />

        <div
          className={`space-y-8 relative z-10 transition-all duration-700 ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal">
                <GlobeIcon className="w-4 h-4" />
                <span>Présence internationale</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary">
                Actifs dans{" "}
                <span className="font-serif italic font-normal text-teal">
                  12
                </span>{" "}
                pays
              </h2>
            </div>

            <p className="text-sm sm:text-base text-text-secondary max-w-md">
              Chaque territoire bénéficie d&apos;une équipe locale dédiée et d&apos;un suivi
              photographique et financier ouvert au public.
            </p>
          </div>

          {/* Country Chips Grid */}
          <div className="flex flex-wrap gap-3.5 pt-4">
            {countries.map((c, idx) => (
              <div
                key={idx}
                className="glass hover:glass-strong px-4 py-3 rounded-full border-glass-border flex items-center gap-3 hover:-translate-y-1 transition-all cursor-pointer shadow-md group"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${c.color} group-hover:scale-125 transition-transform`} />
                <span className="font-display font-semibold text-sm text-text-primary">
                  {c.name}
                </span>
                <span className="font-mono text-xs text-text-muted bg-void/40 px-2 py-0.5 rounded-full">
                  {c.projects} prj.
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

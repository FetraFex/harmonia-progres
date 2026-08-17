"use client";

import React, { useRef, useEffect } from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useCountUp } from "@/hooks/useCountUp";
import { ArrowRightIcon } from "@/components/ui/Icons";

interface Sector {
  number: string;
  title: string;
  products: string;
  description: string;
  gradient: string;
}

const sectors: Sector[] = [
  {
    number: "01",
    title: "ARTISANAT",
    products: "Nattes · Raphia · Vannerie",
    description:
      "Préserver les savoir-faire locaux tout en ouvrant de nouveaux marchés. Nattes, paniers, raphia — un patrimoine artisanal à valoriser.",
    gradient: "from-amber-900/50 via-amber-800/30 to-[#0a0a0a]",
  },
  {
    number: "02",
    title: "HALIEUTIQUE",
    products: "Pêche · Transformation · Commercialisation",
    description:
      "Structurer la filière poisson pour une économie durable. Conservation, transformation et réduction des pertes post-capture.",
    gradient: "from-blue-900/50 via-blue-800/30 to-[#0a0a0a]",
  },
  {
    number: "03",
    title: "AGRICULTURE",
    products: "Riziculture · Semences · Productivité",
    description:
      "Accompagner les jeunes entrepreneurs agricoles vers l'autonomie. Techniques modernes, semences améliorées, commercialisation.",
    gradient: "from-emerald-900/50 via-emerald-800/30 to-[#0a0a0a]",
  },
];

interface StatItemProps {
  target: number;
  suffix?: string;
  label: string;
  delay: number;
}

function StatCard({ target, suffix = "", label, delay }: StatItemProps) {
  const { ref, formattedCount } = useCountUp(target, { suffix });
  const { ref: revealRef, isRevealed } = useRevealOnScroll<HTMLDivElement>();

  return (
    <div
      ref={revealRef}
      className={`flex flex-col transition-all duration-700 ${
        isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold text-teal tracking-tight">
        <span ref={ref}>{formattedCount}</span>
      </span>
      <span className="mt-2 text-sm text-text-secondary font-medium leading-snug">
        {label}
      </span>
    </div>
  );
}

const statsData = [
  { target: 3, suffix: "", label: "Secteurs d'intervention" },
  { target: 2, suffix: "", label: "Districts concernés" },
  { target: 0, suffix: " XX", label: "Jeunes accompagnés" },
  { target: 0, suffix: " XX", label: "Partenaires mobilisés" },
];

export function LocalEconomySection() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 5) return;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const atStart = scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 1 && e.deltaY > 0;
      if (!atStart && !atEnd) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <section
      id="secteurs"
      ref={ref}
      className="relative z-10"
    >
      {/* Stats Row */}
      <div className="px-32 max-w-[1280px] mx-auto pt-16 md:pt-24 pb-12 md:pb-16">
        <div
          className={`mb-12 transition-all duration-700 ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            L&apos;ÉCONOMIE LOCALE
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary">
            Trois secteurs.{" "}
            <span className="font-serif italic font-normal text-teal">
              Un même potentiel.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-2xl">
            Valoriser les savoir-faire et les ressources du territoire pour
            créer de nouvelles opportunités économiques.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-12">
          {statsData.map((stat, idx) => (
            <StatCard
              key={idx}
              target={stat.target}
              suffix={stat.suffix}
              label={stat.label}
              delay={idx * 100}
            />
          ))}
        </div>
      </div>

      {/* Horizontal Sector Panels */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto px-32 pb-16 md:pb-24 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {sectors.map((sector, idx) => (
          <article
            key={sector.number}
            className={`group shrink-0 w-[min(85vw,600px)] snap-center relative overflow-hidden rounded-3xl border border-white/[0.06] hover:border-teal/20 transition-all duration-500 cursor-pointer ${
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${300 + idx * 150}ms` }}
          >
            {/* Image Area */}
            <div className="relative h-[280px] md:h-[340px] overflow-hidden">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${sector.gradient} transition-transform duration-700 group-hover:scale-110`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-[120px] md:text-[160px] font-bold text-white/[0.04] select-none leading-none">
                  {sector.number}
                </span>
              </div>
              <div className="absolute top-6 left-6">
                <span className="font-mono text-xs text-teal font-semibold tracking-wider">
                  {sector.number}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-4 bg-white/[0.02]">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-text-primary group-hover:text-teal transition-colors duration-300">
                {sector.title}
              </h3>
              <span className="block text-xs font-mono font-semibold uppercase tracking-wider text-teal/70">
                {sector.products}
              </span>
              <p className="text-sm text-text-secondary leading-relaxed">
                {sector.description}
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted group-hover:text-teal transition-colors pt-2">
                <span>Explorer</span>
                <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Accent Line */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-teal transition-all duration-700" />
          </article>
        ))}
      </div>
    </section>
  );
}

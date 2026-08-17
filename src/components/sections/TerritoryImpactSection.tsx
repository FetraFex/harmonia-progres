"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

const territories = [
  {
    city: "MANAKARA",
    focus: "Artisanat · Halieutique",
    description: "Port maritime, artisanat local, filière halieutique structurée.",
  },
  {
    city: "VOHIPENO",
    focus: "Agriculture · Riziculture",
    description: "Terres agricoles, riziculture améliorée, production locale.",
  },
];

export function TerritoryImpactSection() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section
      id="territoire"
      ref={ref}
      className="py-16 md:py-24 px-32 max-w-[1280px] mx-auto relative z-10 scroll-mt-24"
    >
      <div
        className={`transition-all duration-700 ${
          isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          {/* Left: Title */}
          <div className="space-y-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
              NOTRE TERRITOIRE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-tight">
              Ancré dans{" "}
              <span className="font-serif italic font-normal text-teal">
                un territoire.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-text-secondary">
              Agir au plus près des communautés, des ressources et des
              opportunités locales.
            </p>
            <p className="text-sm text-text-muted">
              Madagascar → Fitovinany →{" "}
              <span className="text-teal font-semibold">Manakara</span> /{" "}
              <span className="text-teal font-semibold">Vohipeno</span>
            </p>
          </div>

          {/* Right: SVG Map */}
          <div
            className={`flex justify-center lg:justify-end transition-all duration-700 delay-200 ${
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="relative w-[200px] h-[340px] md:w-[240px] md:h-[400px]">
              <svg
                viewBox="0 0 200 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
                aria-label="Carte de Madagascar avec régions Fitovinany, Manakara et Vohipeno"
              >
                <path
                  d="M105 10 C115 15, 130 25, 140 40 C150 55, 160 70, 165 90 C170 110, 175 130, 178 150 C180 170, 182 190, 180 210 C178 230, 172 250, 165 270 C158 290, 148 310, 135 330 C125 345, 115 355, 105 365 C95 375, 85 380, 75 378 C65 375, 55 365, 48 350 C40 335, 35 315, 32 295 C28 275, 26 255, 28 235 C30 215, 35 195, 40 175 C45 155, 52 135, 58 115 C64 95, 70 75, 78 58 C85 42, 95 25, 105 10Z"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1.5"
                  fill="rgba(255,255,255,0.03)"
                />
                <ellipse
                  cx="130"
                  cy="260"
                  rx="28"
                  ry="35"
                  fill="rgba(206,251,72,0.08)"
                  stroke="rgba(206,251,72,0.25)"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                />
                <circle cx="140" cy="250" r="5" fill="#CEFB48" opacity="0.9" />
                <circle cx="140" cy="250" r="8" fill="#CEFB48" opacity="0.2" />
                <text
                  x="155"
                  y="253"
                  className="fill-teal"
                  fontSize="11"
                  fontFamily="Space Grotesk, sans-serif"
                  fontWeight="600"
                >
                  Manakara
                </text>
                <circle cx="125" cy="275" r="4" fill="#CEFB48" opacity="0.7" />
                <circle cx="125" cy="275" r="6" fill="#CEFB48" opacity="0.15" />
                <text
                  x="108"
                  y="295"
                  className="fill-teal"
                  fontSize="10"
                  fontFamily="Space Grotesk, sans-serif"
                  fontWeight="500"
                  opacity="0.8"
                >
                  Vohipeno
                </text>
                <circle cx="95" cy="160" r="3" fill="rgba(255,255,255,0.25)" />
                <text
                  x="105"
                  y="163"
                  fontSize="8"
                  fontFamily="Inter, sans-serif"
                  fill="rgba(255,255,255,0.25)"
                >
                  Tana
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Territory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {territories.map((t, idx) => (
            <div
              key={t.city}
              className={`group p-8 rounded-3xl border border-white/[0.06] hover:border-teal/20 bg-white/[0.02] transition-all duration-500 ${
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${400 + idx * 150}ms` }}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-teal" />
                  <h3 className="font-display text-xl font-bold text-text-primary">
                    {t.city}
                  </h3>
                </div>
                <span className="block text-xs font-mono font-semibold uppercase tracking-wider text-teal">
                  {t.focus}
                </span>
                <p className="text-sm text-text-secondary leading-relaxed pt-1">
                  {t.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

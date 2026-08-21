"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useTheme } from "@/contexts/ThemeContext";

export function TerritoryImpactSection() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();
  const { isDark } = useTheme();
  const t = useTranslations("territory");

  const territories = t.raw("cities") as {
    city: string;
    focus: string;
    description: string;
  }[];

  return (
    <section
      id="territoire"
      ref={ref}
      className="py-[var(--page-py)] md:py-[var(--page-py-lg)] px-[var(--page-px)] max-w-[var(--page-max-w)] mx-auto relative z-10 scroll-mt-24"
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
              {t("kicker")}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-tight">
              {t("title1")}{" "}
              <span className="font-serif italic font-normal text-teal">
                {t("title2")}
              </span>
            </h2>
            <p className="text-base sm:text-lg text-text-secondary">
              {t("paragraph")}
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
                aria-label={t("mapAria")}
              >
                {/* Madagascar outline (from Natural Earth geographic data) */}
                <path
                  d="M166.7 41.7Q166.7 41.7 170.1 47.0Q173.4 52.3 176.4 60.5Q179.5 68.8 181.5 83.8Q183.5 98.8 186.8 104.6Q190 110.4 188.8 116.4Q187.5 122.4 185.3 126.0Q183.1 129.7 178.8 122.4Q174.6 115.1 172.3 118.8Q170 122.5 172.3 131.7Q174.7 140.9 173.6 146.2Q172.5 151.5 169.1 154.4Q165.6 157.3 164.8 167.9Q164.1 178.4 159.1 192.9Q154.2 207.4 148.1 224.6Q141.9 241.8 134.3 265.4Q126.6 289 121.8 306.3Q117 323.6 111.3 338.1Q105.7 352.5 95.6 355.4Q85.5 358.4 74.6 363.7Q63.7 369 56.5 365.8Q49.4 362.6 39.5 358.1Q29.6 353.7 26.1 347.1Q22.7 340.6 21.9 329.6Q21.1 318.5 16.7 308.6Q12.3 298.6 11.2 289.6Q10 280.7 12.3 271.7Q14.5 262.7 20.2 260.5Q25.9 258.4 25.9 254.3Q26 250.1 31.9 240.6Q37.9 231.2 39.0 223.3Q40.2 215.3 37.3 209.4Q34.4 203.5 32.0 195.7Q29.7 187.8 28.7 176.3Q27.7 164.8 32.0 157.9Q36.4 150.9 38.0 143.0Q39.7 135.1 45.9 134.6Q52.1 134.2 59.0 131.6Q66 129.1 70.7 126.8Q75.3 124.5 80.8 124.3Q86.2 124.2 93.3 117.1Q100.4 110 110.7 102.3Q120.9 94.7 124.7 88.4Q128.4 82.1 126.7 76.8Q125 71.5 130.3 73.0Q135.6 74.5 142.4 65.8Q149.3 57.1 149.6 49.7Q149.8 42.2 153.9 36.6Q158.1 31 162.4 36.4Q166.7 41.7 166.7 41.7Z"
                  stroke={isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.15)"}
                  strokeWidth="1.5"
                  fill={isDark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.04)"}
                />
                <ellipse
                  cx="122"
                  cy="295"
                  rx="16.2"
                  ry="17.4"
                  fill="rgba(206,251,72,0.08)"
                  stroke="rgba(206,251,72,0.25)"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                />
                <circle cx="122" cy="295" r="5" fill="#CEFB48" opacity="0.9" />
                <circle cx="122" cy="295" r="8" fill="#CEFB48" opacity="0.2" />
                <text
                  x="138"
                  y="298"
                  className="fill-teal"
                  fontSize="11"
                  fontFamily="Space Grotesk, sans-serif"
                  fontWeight="600"
                >
                  Manakara
                </text>
                <circle cx="114" cy="305" r="4" fill="#CEFB48" opacity="0.7" />
                <circle cx="114" cy="305" r="6" fill="#CEFB48" opacity="0.15" />
                <text
                  x="114"
                  y="321"
                  textAnchor="middle"
                  className="fill-teal"
                  fontSize="10"
                  fontFamily="Space Grotesk, sans-serif"
                  fontWeight="500"
                  opacity="0.8"
                >
                  Vohipeno
                </text>
                <circle cx="115" cy="200" r="3" fill={isDark ? "rgba(255,255,255,0.25)" : "rgba(15,23,42,0.2)"} />
                <text
                  x="126"
                  y="203"
                  fontSize="8"
                  fontFamily="Inter, sans-serif"
                  fill={isDark ? "rgba(255,255,255,0.25)" : "rgba(15,23,42,0.3)"}
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
              className={`group p-8 rounded-3xl border border-glass-border hover:border-teal/40 bg-glass-bg transition-all duration-500 ${
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${400 + idx * 150}ms` }}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-green" />
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

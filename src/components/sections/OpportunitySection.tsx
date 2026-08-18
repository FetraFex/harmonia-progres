"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

export function OpportunitySection() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();
  const t = useTranslations("opportunity");

  const leftNodes = t.raw("leftNodes") as string[];

  return (
    <section
      id="opportunite"
      ref={ref}
      className="py-16 md:py-24 px-32 max-w-[1280px] mx-auto relative z-10 scroll-mt-24"
    >
      <div
        className={`space-y-16 transition-all duration-700 ${
          isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Header */}
        <div className="max-w-3xl space-y-6">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
            {t("kicker")}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-text-primary">
            {t("titleBefore")}{" "}
            <span className="font-serif italic font-normal text-teal">
              {t("titleAccent")}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
            {t("paragraph1")}
          </p>
          <p className="text-sm text-text-muted leading-relaxed max-w-2xl">
            {t("paragraph2")}
          </p>
        </div>

        {/* Connection Diagram */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0 py-12">
          {/* Left Nodes */}
          <div className="flex flex-col items-end gap-6 lg:gap-8 lg:w-1/3">
            {leftNodes.map((node, idx) => (
              <div
                key={node}
                className={`flex items-center gap-4 transition-all duration-700 ${
                  isRevealed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
                }`}
                style={{ transitionDelay: `${300 + idx * 150}ms` }}
              >
                <span className="font-display text-sm font-semibold text-text-secondary tracking-wide">
                  {node}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-teal/60 shrink-0" />
              </div>
            ))}
          </div>

          {/* Left Lines */}
          <div className="hidden lg:flex flex-col items-center justify-center gap-6 lg:w-16 h-[180px]">
            {leftNodes.map((_, idx) => (
              <div
                key={idx}
                className={`h-px bg-gradient-to-r from-teal/40 to-teal/10 w-full transition-all duration-700 ${
                  isRevealed ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                }`}
                style={{ transitionDelay: `${500 + idx * 150}ms`, transformOrigin: "right" }}
              />
            ))}
          </div>

          {/* Center Hub */}
          <div
            className={`flex flex-col items-center gap-3 lg:w-1/3 transition-all duration-700 ${
              isRevealed ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="px-6 py-4 border border-teal/30 rounded-2xl bg-teal/5 backdrop-blur-sm">
              <span className="font-display text-sm md:text-base font-bold tracking-[0.15em] text-teal uppercase">
                {t("hub")}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-teal/30" />
              <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
              <div className="h-px w-12 bg-teal/30" />
            </div>
          </div>

          {/* Right Line */}
          <div className="hidden lg:block lg:w-16">
            <div
              className={`h-px bg-gradient-to-r from-teal/10 to-teal/40 w-full transition-all duration-700 ${
                isRevealed ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              }`}
              style={{ transitionDelay: "750ms", transformOrigin: "left" }}
            />
          </div>

          {/* Right Node */}
          <div
            className={`lg:w-1/3 flex items-center gap-4 transition-all duration-700 ${
              isRevealed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-teal shrink-0" />
            <span className="font-display text-sm md:text-base font-bold text-teal tracking-wide">
              {t("rightNode")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

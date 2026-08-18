"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

export function Testimonial() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className="py-16 md:py-24 px-4 max-w-[1080px] mx-auto relative z-10"
    >
      <div
        className={`glass-strong p-8 sm:p-12 md:p-16 rounded-[32px] border-glass-border-strong text-center shadow-2xl relative overflow-hidden transition-all duration-700 ${
          isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-green/15 rounded-full blur-3xl pointer-events-none" />

        {/* Large Decorative Quote Mark */}
        <div className="text-6xl sm:text-7xl font-serif text-teal/40 leading-none select-none mb-4">
          “
        </div>

        {/* Quote text in Space Grotesk */}
        <blockquote className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-text-primary leading-relaxed max-w-3xl mx-auto tracking-tight">
          « Depuis le forage financé par Lucide, les enfants du village ne marchent
          plus deux heures pour aller chercher de l&apos;eau. Ce temps, ils le passent
          maintenant à l&apos;école. »
        </blockquote>

        {/* Author Avatar & Info */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal to-coral p-0.5 shadow-lg">
            <div className="w-full h-full rounded-full bg-void flex items-center justify-center font-bold text-sm text-teal">
              AD
            </div>
          </div>
          <div className="text-center sm:text-left">
            <div className="font-display font-bold text-text-primary text-base">
              Aïssatou Diop
            </div>
            <div className="text-xs sm:text-sm text-text-secondary">
              Coordinatrice terrain, Sénégal
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

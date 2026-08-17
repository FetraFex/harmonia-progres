"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { ArrowRightIcon } from "@/components/ui/Icons";

const words = ["APPRENDRE", "ENTREPRENDRE", "CRÉER", "GRANDIR"] as const;

export function EntrepreneursSection() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section
      id="jeunes-entrepreneurs"
      ref={ref}
      className="py-16 md:py-24 px-32 max-w-[1280px] mx-auto relative z-10 scroll-mt-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
        {/* Left: Image Placeholder */}
        <div
          className={`relative rounded-3xl overflow-hidden min-h-[400px] lg:min-h-[520px] transition-all duration-700 ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal/20 via-[#0a1a1a] to-[#050505]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-teal/60">
              Documentary
            </span>
          </div>
        </div>

        {/* Right: Content */}
        <div
          className={`flex flex-col justify-between py-4 transition-all duration-700 delay-200 ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="space-y-8">
            <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-text-muted">
              JEUNES ENTREPRENEURS
            </span>

            <div className="space-y-1">
              {words.map((word, idx) => (
                <span
                  key={word}
                  className={`block font-display font-bold text-[clamp(40px,5vw,64px)] leading-[1.1] tracking-tight transition-all duration-700 ${
                    idx === 3 ? "text-teal" : "text-text-primary"
                  } ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: `${300 + idx * 100}ms` }}
                >
                  {word}
                </span>
              ))}
            </div>

            <p className="text-base text-text-secondary leading-relaxed max-w-md">
              Un programme dédié aux jeunes de Manakara et Vohipeno pour
              transformer leurs idées en activités économiques viables et
              durables.
            </p>
          </div>

          <div className="pt-8">
            <a
              href="#programme"
              className="inline-flex items-center gap-2 font-semibold text-teal hover:text-teal/80 transition-colors group"
            >
              <span>Découvrir le programme</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { ArrowRightIcon } from "@/components/ui/Icons";

export function PartnersSection() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section
      id="partenaires"
      ref={ref}
      className="py-16 md:py-24 px-32 max-w-[1280px] mx-auto relative z-10 scroll-mt-24"
    >
      <div
        className={`text-center space-y-8 transition-all duration-700 ${
          isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-tight max-w-3xl mx-auto">
          Construisons ensemble{" "}
          <span className="font-serif italic font-normal text-teal">
            un réseau local d&apos;opportunités.
          </span>
        </h2>

        <div className="pt-4">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-green text-on-void font-semibold text-sm hover:bg-green/90 transition-all hover:scale-105 active:scale-95 shadow-md shadow-green/20"
          >
            <span>Devenir partenaire</span>
            <ArrowRightIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

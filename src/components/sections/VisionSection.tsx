"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

export function VisionSection() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section
      id="vision"
      ref={ref}
      className="py-24 md:py-32 px-32 max-w-[1280px] mx-auto relative z-10"
      style={{ backgroundColor: "#050505" }}
    >
      <div
        className={`text-center max-w-4xl mx-auto transition-all duration-700 ${
          isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2
          className="font-display font-bold tracking-tight leading-[1.15] text-text-primary"
          style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
        >
          Construire une génération de jeunes entrepreneurs{" "}
          <span className="text-teal">autonomes</span>,{" "}
          <span className="text-teal">innovants</span> et{" "}
          <span className="text-teal">responsables</span>.
        </h2>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useCountUp } from "@/hooks/useCountUp";

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
      className={`glass p-6 md:p-8 flex flex-col justify-between border-glass-border hover:border-glass-border-strong transition-all duration-700 hover:-translate-y-1 ${
        isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold text-teal tracking-tight">
        <span ref={ref}>{formattedCount}</span>
      </div>
      <p className="mt-3 text-sm sm:text-base text-text-secondary font-medium leading-snug">
        {label}
      </p>
    </div>
  );
}

export function StatsBand() {
  const statsData = [
    {
      target: 94,
      suffix: " %",
      label: "des dons vont directement aux projets de terrain",
    },
    {
      target: 128400,
      suffix: "",
      label: "personnes ayant un accès durable à l'eau potable",
    },
    {
      target: 12,
      suffix: "",
      label: "pays d'intervention",
    },
    {
      target: 340,
      suffix: "",
      label: "projets menés à terme depuis 2015",
    },
  ];

  return (
    <section className="py-12 md:py-16 px-4 max-w-[1280px] mx-auto relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </section>
  );
}

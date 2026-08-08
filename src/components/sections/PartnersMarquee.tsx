"use client";

import React from "react";
import { ShieldCheckIcon } from "@/components/ui/Icons";

export function PartnersMarquee() {
  const partners = [
    "Fonds Climat Solidaire",
    "Bleu Global",
    "Alliance Terre Vive",
    "Réseau Eau Pour Tous",
    "Fondation Horizon",
    "ClimateAction Partners",
  ];

  // Duplicate for seamless infinite scrolling loop
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section className="py-12 md:py-16 relative z-10 overflow-hidden">
      <div className="text-center mb-8">
        <p className="text-xs font-mono font-semibold uppercase tracking-widest text-text-muted">
          Partenaires institutionnels & vérificateurs
        </p>
      </div>

      {/* Marquee Container with edge fading mask */}
      <div className="w-full overflow-hidden marquee-mask">
        <div className="animate-marquee gap-8 md:gap-12 py-3">
          {duplicatedPartners.map((name, idx) => (
            <div
              key={idx}
              className="glass px-6 py-3.5 rounded-full border-glass-border flex items-center gap-3 whitespace-nowrap hover:border-teal/50 transition-colors shadow-sm"
            >
              <ShieldCheckIcon className="w-4 h-4 text-teal" />
              <span className="font-display font-medium text-sm text-text-secondary tracking-wide">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

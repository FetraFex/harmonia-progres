"use client";

import React from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { ArrowRightIcon, ShieldCheckIcon, PrismLogo } from "@/components/ui/Icons";

export function Mission() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section
      id="mission"
      ref={ref}
      className="py-16 md:py-24 px-4 max-w-[1280px] mx-auto relative z-10 scroll-mt-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Copy */}
        <div
          className={`lg:col-span-7 space-y-6 transition-all duration-700 ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="inline-flex items-center gap-2 glass px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal tracking-wider uppercase">
            <PrismLogo className="w-4 h-4" />
            <span>Notre mission</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-text-primary">
            Rendre l&apos;aide aussi{" "}
            <span className="font-serif italic font-normal text-teal">
              transparente
            </span>{" "}
            que l&apos;eau que nous protégeons.
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-body">
            Fondation Lucide finance des projets portés par des associations
            locales, pas par des intermédiaires. Chaque financement est documenté
            par des données de terrain vérifiées : photos géolocalisées, factures,
            témoignages. Vous ne donnez pas dans le vide — vous financez un puits
            précis, une école précise, une communauté précise.
          </p>

          <div className="pt-2">
            <a
              href="#actions"
              className="inline-flex items-center gap-2 font-semibold text-teal hover:text-teal/80 transition-colors group cursor-pointer"
            >
              <span>Découvrir notre méthode</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Right Column: Glass Visual */}
        <div
          className={`lg:col-span-5 transition-all duration-700 delay-200 ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="relative glass-strong p-8 rounded-3xl overflow-hidden min-h-[380px] flex flex-col justify-between shadow-2xl border-glass-border-strong group">
            {/* Ambient inner grid pattern */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Subtle Gradient Glow inside glass */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-coral/15 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

            {/* Top Badge */}
            <div className="relative z-10 flex justify-between items-center">
              <span className="text-xs font-mono font-semibold text-text-muted uppercase tracking-widest">
                Traçabilité 100%
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-green animate-ping" />
            </div>

            {/* Center Graphic Details */}
            <div className="relative z-10 my-8 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-void/50 border border-glass-border">
                <span className="text-xs text-text-secondary">Geotag Photo Log</span>
                <span className="text-xs font-mono text-teal font-semibold">OK #8492</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-void/50 border border-glass-border">
                <span className="text-xs text-text-secondary">Audit Facture Directe</span>
                <span className="text-xs font-mono text-teal font-semibold">100% Conforme</span>
              </div>
            </div>

            {/* Overlaid Prominent Badge */}
            <div className="relative z-10 glass p-4 rounded-2xl border-glass-border-strong flex items-center gap-3 bg-void-2/60 shadow-xl">
              <div className="p-2.5 rounded-xl bg-teal/20 text-teal">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-text-primary font-display">
                  340 projets vérifiés et clôturés
                </div>
                <div className="text-xs text-text-secondary">
                  Audités par tiers indépendants
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  StarIcon,
  ArrowRightIcon,
  LaurelWreathIcon,
  LightningIcon,
} from "@/components/ui/Icons";

export function Hero() {
  const [videoError, setVideoError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const scrollToDonate = () => {
    document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToMission = () => {
    document.getElementById("mission")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 max-w-[1400px] mx-auto overflow-visible">
      {/* Ghost text peeking above the framed card */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[7rem] sm:text-[11rem] md:text-[16rem] font-display font-bold tracking-widest text-white/[0.04] select-none pointer-events-none uppercase whitespace-nowrap z-0">
        TRANSPARENCE
      </div>

      {/* Top Center Peeking Badge (overlapping top edge) */}
      <div className="relative z-20 flex justify-center -mb-6">
        <div className="glass px-4 py-2 rounded-full shadow-2xl shadow-teal/20 animate-prism-bob border-glass-border-strong flex items-center gap-2 backdrop-blur-2xl">
          <Image
            src="/images/logo/logo-transparent-dark.png"
            alt="Harmonia Progrès"
            width={120}
            height={32}
            className="h-5 w-auto object-contain"
          />
        </div>
      </div>

      {/* Main Framed Glass Card */}
      <div className="relative z-10 glass-hero border border-glass-border-strong overflow-hidden min-h-[700px] md:min-h-[780px] flex flex-col justify-between p-6 sm:p-10 md:p-14 shadow-2xl rounded-[32px] md:rounded-[40px]">
        {/* Background Image Layer (generated high-res landscape asset) */}
        <Image
          src="/images/hero-bg.png"
          alt="Harmonia Progrès Impact Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center z-0 opacity-45 scale-105 transition-all duration-1000"
        />

        {/* Video Overlay Layer (if available) */}
        {!videoError && (
          <video
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoError(true)}
            className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover object-center z-0 opacity-35 transition-opacity duration-1000 pointer-events-none"
            style={{ objectFit: "cover" }}
          >
            <source src="/videos/harmonia-progres-1-rm.mp4" type="video/mp4" />
          </video>
        )}

        {/* Animated CSS Gradient Fallback */}
        <div
          className={`absolute inset-0 z-0 hero-gradient-fallback transition-opacity duration-1000 ${
            videoError ? "opacity-90" : "opacity-30"
          }`}
        />

        {/* Dark Radial Vignette & Gradient Overlays for Supreme Contrast */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-void via-void/65 to-void/30 pointer-events-none" />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-void/90 via-void/50 to-transparent pointer-events-none" />

        {/* TOP NAVBAR (Embedded inside the hero card per reference design) */}
        <nav className="relative z-20 glass px-6 py-3.5 rounded-full flex items-center justify-between shadow-xl backdrop-blur-2xl border-glass-border">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo/logo-transparent-dark.png"
              alt="Harmonia Progrès"
              width={140}
              height={36}
              className="h-8 w-auto object-contain"
            />
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <button
              onClick={scrollToMission}
              className="hover:text-teal transition-colors cursor-pointer"
            >
              Mission
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("actions")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-teal transition-colors cursor-pointer"
            >
              Actions
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("presence")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-teal transition-colors cursor-pointer"
            >
              Impact
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("newsletter")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-teal transition-colors cursor-pointer"
            >
              Actualités
            </button>
          </div>

          <button
            onClick={scrollToDonate}
            className="px-5 py-2 rounded-full bg-teal text-on-void font-bold text-xs sm:text-sm hover:bg-teal/90 transition-all hover:scale-105 active:scale-95 shadow-md shadow-teal/20 cursor-pointer"
          >
            Faire un don
          </button>
        </nav>

        {/* BOTTOM CONTENT AREA (Grid matching the reference image layout) */}
        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end pt-12 md:pt-20">
          {/* LEFT COLUMN: Trust Pill + Headline + Subheading + Action Buttons */}
          <div className="lg:col-span-7 space-y-6">
            {/* Trust Pill Badge with stacked avatars + green plus */}
            <div
              className={`inline-flex items-center gap-3 glass px-4 py-2 rounded-full border-glass-border-strong shadow-lg backdrop-blur-xl transition-all duration-700 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              {/* Stacked Avatars */}
              <div className="flex -space-x-2 overflow-hidden items-center">
                <span className="inline-block w-7 h-7 rounded-full bg-teal/30 border-2 border-void text-[10px] font-bold flex items-center justify-center text-teal">
                  AD
                </span>
                <span className="inline-block w-7 h-7 rounded-full bg-coral/30 border-2 border-void text-[10px] font-bold flex items-center justify-center text-coral">
                  ML
                </span>
                <span className="inline-block w-7 h-7 rounded-full bg-green/30 border-2 border-void text-[10px] font-bold flex items-center justify-center text-green">
                  RK
                </span>
                <span className="w-6 h-6 rounded-full bg-teal flex items-center justify-center text-on-void font-bold text-xs shadow">
                  +
                </span>
              </div>
              <span className="text-xs font-semibold text-text-primary">
                1 200+ donateurs actifs
              </span>
              <div className="flex items-center gap-0.5 text-coral">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-3.5 h-3.5" />
                ))}
              </div>
            </div>

            {/* Headline with Signature Italic Accent Word */}
            <h1
              className={`font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08] text-text-primary transition-all duration-700 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              Chaque don compte.
              <br />
              Chaque geste est{" "}
              <span className="font-serif italic font-normal text-teal">
                visible
              </span>
              .
            </h1>

            {/* Subheading Paragraph */}
            <p
              className={`text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed font-body transition-all duration-700 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              Nous finançons l&apos;eau potable, l&apos;éducation et la résilience
              climatique dans 12 pays — et documentons chaque euro, du don
              jusqu&apos;au terrain.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-wrap items-center gap-4 pt-2 transition-all duration-700 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <button
                onClick={scrollToDonate}
                className="px-8 py-4 rounded-full bg-teal text-on-void font-display font-bold text-sm sm:text-base hover:bg-teal/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-teal/30 flex items-center gap-2 cursor-pointer"
              >
                <span>Faire un don</span>
                <LightningIcon className="w-4 h-4 text-on-void" />
              </button>

              <button
                onClick={scrollToMission}
                className="px-7 py-4 rounded-full glass hover:glass-strong text-text-primary font-semibold text-sm sm:text-base transition-all flex items-center gap-2 hover:translate-x-1 cursor-pointer border-glass-border-strong"
              >
                <span>Voir notre impact</span>
                <ArrowRightIcon className="w-4 h-4 text-teal" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Glass Stat Cards + Laurel Certification Badges */}
          <div className="lg:col-span-5 space-y-6">
            {/* Top Stat Cards (2 side-by-side glass cards matching the 35% & 25% cards in the reference design) */}
            <div
              className={`grid grid-cols-2 gap-4 transition-all duration-700 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "450ms" }}
            >
              <div className="glass-strong p-5 md:p-6 rounded-[24px] border-glass-border-strong shadow-2xl backdrop-blur-2xl space-y-2 hover:-translate-y-1 transition-transform">
                <div className="font-display font-bold text-3xl sm:text-4xl text-teal tracking-tight">
                  94 %
                </div>
                <div className="text-xs sm:text-sm text-text-secondary font-medium leading-snug">
                  Fonds versés directement sur le terrain
                </div>
              </div>

              <div className="glass-strong p-5 md:p-6 rounded-[24px] border-glass-border-strong shadow-2xl backdrop-blur-2xl space-y-2 hover:-translate-y-1 transition-transform">
                <div className="font-display font-bold text-3xl sm:text-4xl text-coral tracking-tight">
                  128K
                </div>
                <div className="text-xs sm:text-sm text-text-secondary font-medium leading-snug">
                  Bénéficiaires d&apos;eau & éducation
                </div>
              </div>
            </div>

            {/* Bottom Laurel Certification Wreaths (matching the 7.9X, 5X, 1.2X laurel row in the reference design) */}
            <div
              className={`grid grid-cols-3 gap-3 pt-2 text-center transition-all duration-700 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "550ms" }}
            >
              {/* Laurel 1 */}
              <div className="flex flex-col items-center space-y-1.5 glass p-3.5 rounded-2xl border-glass-border shadow-lg">
                <div className="font-mono font-bold text-lg text-text-primary">
                  94 %
                </div>
                <div className="flex items-center justify-center text-teal">
                  <LaurelWreathIcon className="w-7 h-7" />
                </div>
                <div className="text-[11px] font-medium text-text-muted leading-tight">
                  Don en Confiance 2024
                </div>
              </div>

              {/* Laurel 2 */}
              <div className="flex flex-col items-center space-y-1.5 glass p-3.5 rounded-2xl border-glass-border shadow-lg">
                <div className="font-mono font-bold text-lg text-text-primary">
                  100 %
                </div>
                <div className="flex items-center justify-center text-coral">
                  <LaurelWreathIcon className="w-7 h-7" />
                </div>
                <div className="text-[11px] font-medium text-text-muted leading-tight">
                  Certifié IDEAS 2024
                </div>
              </div>

              {/* Laurel 3 */}
              <div className="flex flex-col items-center space-y-1.5 glass p-3.5 rounded-2xl border-glass-border shadow-lg">
                <div className="font-mono font-bold text-lg text-text-primary">
                  12 / 12
                </div>
                <div className="flex items-center justify-center text-green">
                  <LaurelWreathIcon className="w-7 h-7" />
                </div>
                <div className="text-[11px] font-medium text-text-muted leading-tight">
                  ISO 9001 2023
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Center Peeking Planet Graphic (matching the grass circle peeking at bottom of reference design) */}
      <div className="relative z-0 flex justify-center -mt-6 pointer-events-none">
        <div className="w-44 h-12 md:w-64 md:h-16 rounded-t-full bg-gradient-to-t from-teal/40 via-green/30 to-transparent blur-md opacity-80" />
      </div>
    </section>
  );
}

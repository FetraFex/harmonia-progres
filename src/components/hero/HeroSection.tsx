"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { HeroVideo } from "./HeroVideo";
import { HeroMetrics } from "./HeroMetrics";
import { ScrollIndicator } from "./ScrollIndicator";
import {
  initializeHeroScroll,
  cleanupHeroAnimations,
} from "@/animations/heroAnimations";

const NAV_LINKS = [
  { label: "Le Projet", href: "#mission" },
  { label: "Nos Actions", href: "#actions" },
  { label: "Impact", href: "#stats" },
  { label: "Actualités", href: "#newsletter" },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.4 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const lineReveal: Variants = {
  hidden: { opacity: 0, y: 40, clipPath: "inset(100% 0 0 0)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0 0 0)",
    transition: {
      duration: 0.8,
      delay: 0.6 + i * 0.12,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function HeroSection() {
  const ctxRef = useRef<ReturnType<typeof initializeHeroScroll>>(undefined);

  useEffect(() => {
    ctxRef.current = initializeHeroScroll();
    return () => cleanupHeroAnimations(ctxRef.current);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="hero-outer relative min-h-screen flex flex-col overflow-hidden"
      style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)" }}
      aria-label="Hero"
    >
      {/* ── Background Image ── */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
      </div>

      {/* ── Video ── */}
      <div className="absolute inset-0 z-[1]" data-hero-video>
        <HeroVideo
          src="/videos/hero-loop.mp4"
          poster="/images/hero-bg.png"
        />
      </div>

      {/* ── Gradient Overlays ── */}
      <div className="absolute inset-0 z-[2] pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
      </div>

      {/* ── Background Typography ── */}
      <div
        data-hero-bg-text
        className="hero-bg-text absolute inset-0 z-[3] flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span className="block font-display font-medium tracking-[-0.06em] text-white/[0.07] uppercase whitespace-nowrap">
          MANAKARA
        </span>
      </div>

      {/* ── Navbar ── */}
      <motion.nav
        className="absolute top-5 left-1/2 -translate-x-1/2 z-30 w-[min(90%,640px)] h-[54px] rounded-[16px] border border-white/[0.15] bg-white/[0.08] backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-between px-6"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Navigation principale"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-lg"
          aria-label="Harmonia Progrès — Accueil"
        >
          <div className="w-8 h-8 rounded-full bg-teal/20 border border-teal/40 flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
            <svg
              className="w-4 h-4 text-teal"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <span className="font-display font-semibold text-sm text-white tracking-tight">
            Harmonia Progrès
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7 text-[13px] font-medium text-white/60">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href.replace("#", ""))}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollTo("contact")}
          className="px-5 py-2 rounded-full bg-teal text-void text-[13px] font-semibold hover:bg-teal/90 transition-all hover:scale-105 active:scale-95 shadow-md shadow-teal/20 cursor-pointer"
        >
          Contact
        </button>

        <button
          className="md:hidden flex flex-col gap-[5px] p-1 cursor-pointer"
          aria-label="Ouvrir le menu"
          onClick={() => {}}
        >
          <span className="block w-5 h-[1.5px] bg-white/70 rounded-full" />
          <span className="block w-5 h-[1.5px] bg-white/70 rounded-full" />
          <span className="block w-3.5 h-[1.5px] bg-white/70 rounded-full" />
        </button>
      </motion.nav>

      {/* ── Content Grid (pushed to bottom) ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-32 py-10 md:py-14 lg:py-16">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          {/* LEFT: Content */}
          <div data-hero-content className="lg:col-span-7 space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeUp} className="mb-5">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] backdrop-blur-md text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                  Manakara &middot; Madagascar
                </span>
              </motion.div>

              <h1 className="space-y-0">
                {["Construire l’avenir", "entrepreneurial", "de Manakara."].map(
                  (line, i) => (
                    <motion.span
                      key={line}
                      custom={i}
                      variants={lineReveal}
                      initial="hidden"
                      animate="visible"
                      className="block font-display font-medium text-[clamp(40px,6vw,88px)] leading-[0.95] tracking-[-0.04em] text-white"
                    >
                      {i === 2 ? (
                        <>
                          de{" "}
                          <span className="font-serif italic font-normal text-teal">
                            Manakara
                          </span>
                          .
                        </>
                      ) : (
                        line
                      )}
                    </motion.span>
                  )
                )}
              </h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-[520px] text-[15px] md:text-[17px] leading-relaxed text-white/65 font-body"
              >
                Nous accompagnons les jeunes, artisans, pêcheurs et
                entrepreneurs locaux grâce à la formation,
                l&rsquo;accompagnement et l&rsquo;accès aux
                opportunités.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-wrap items-center gap-4 pt-3"
              >
                <button
                  onClick={() => scrollTo("mission")}
                  className="group px-7 py-3.5 rounded-[14px] bg-teal text-void font-semibold text-sm hover:bg-teal/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/25 active:scale-[0.98] flex items-center gap-2.5 cursor-pointer"
                >
                  Découvrir le projet
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>

                <button
                  onClick={() => scrollTo("actions")}
                  className="px-7 py-3.5 rounded-[14px] border border-white/[0.18] bg-white/[0.05] text-white font-semibold text-sm hover:bg-white/[0.1] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  Devenir partenaire
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT: Metric Cards */}
          <div className="lg:col-span-5 flex justify-start lg:justify-end">
            <HeroMetrics />
          </div>
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <ScrollIndicator />
    </section>
  );
}

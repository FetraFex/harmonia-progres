"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion, type Variants } from "framer-motion";
import { HeroVideo } from "./HeroVideo";
import { HeroMetrics } from "./HeroMetrics";
import { ScrollIndicator } from "./ScrollIndicator";
import {
  initializeHeroScroll,
  cleanupHeroAnimations,
} from "@/animations/heroAnimations";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { TextRoll } from "@/components/ui/skiper-ui/skiper58";

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

const NAV_LINKS = [
  { key: "project", href: "#opportunite" },
  { key: "sectors", href: "#secteurs" },
  { key: "program", href: "#programme" },
  { key: "territory", href: "#territoire" },
  { key: "about", href: "#vision" },
] as const;

export function HeroSection() {
  const ctxRef = useRef<ReturnType<typeof initializeHeroScroll>>(undefined);
  const { user, profile, loading } = useAuth();
  const t = useTranslations("nav");
  const th = useTranslations("hero");
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <div className="absolute inset-0 z-[1] w-full h-full overflow-hidden pointer-events-none" data-hero-video>
        <HeroVideo
          src="/videos/harmonia-progres-1-rm.mp4"
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
        className="hero-bg-text absolute inset-0 z-[3] flex items-start justify-center pt-[20vh] pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span className="block font-display font-black tracking-[-0.06em] text-white/[0.07] uppercase whitespace-nowrap leading-none text-center">
          HARMONIA<br />PROGRES
        </span>
      </div>

      {/* ── Navbar ── */}
      <div className="absolute top-5 left-0 right-0 z-30 px-6 sm:px-16 lg:px-[var(--page-px)] pointer-events-none">
        <motion.nav
          className="w-full h-[64px] rounded-[20px] flex items-center justify-between pointer-events-auto"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          aria-label={t("ariaNav")}
        >
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-lg shrink-0"
            aria-label={t("ariaHome")}
          >
            <Image
              src="/images/logo/logo-transparent-dark.png"
              alt="Harmonia Progrès"
              width={160}
              height={44}
              priority
              className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-white/70">
            {NAV_LINKS.map((link) => (
              <button
                key={link.key}
                onClick={() => scrollTo(link.href.replace("#", ""))}
                className="hover:text-teal transition-colors cursor-pointer"
              >
                {t(link.key)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher className="hidden md:inline-flex" />
            <ThemeToggle className="hidden md:inline-flex h-10 w-10 p-2 rounded-full glass text-white" />
            {loading ? null : user ? (
              <Link
                href={profile?.role === "admin" ? "/admin" : "/account"}
                className="hidden md:flex px-6 py-2.5 rounded-xl bg-green text-on-void text-[13px] font-semibold hover:bg-green/90 transition-all hover:scale-105 active:scale-95 shadow-md shadow-green/20 items-center gap-2"
              >
                {t("mySpace")}
              </Link>
            ) : (
              <Link
                href="/auth/login?next=/candidater"
                className="hidden md:flex px-6 py-2.5 rounded-xl bg-green text-on-void text-[13px] font-semibold hover:bg-green/90 transition-all hover:scale-105 active:scale-95 shadow-md shadow-green/20 items-center gap-2"
              >
                {t("candidater")}
              </Link>
            )}

            <button
              className="md:hidden flex flex-col gap-[5px] p-2 cursor-pointer"
              aria-label={t("ariaMenu")}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
            >
              <span className={`block w-5 h-[1.5px] bg-white/70 rounded-full transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
              <span className={`block w-5 h-[1.5px] bg-white/70 rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-3.5 h-[1.5px] bg-white/70 rounded-full transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[6.5px] w-5" : ""}`} />
            </button>
          </div>

          {/* ── Mobile Menu ── */}
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 p-4 rounded-2xl bg-void-2/95 backdrop-blur-xl border border-glass-border shadow-2xl"
            >
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.key}
                    onClick={() => { scrollTo(link.href.replace("#", "")); setMobileOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-text-primary hover:bg-teal/10 hover:text-teal transition-colors cursor-pointer"
                  >
                    {t(link.key)}
                  </button>
                ))}
                <div className="border-t border-glass-border my-2" />
                <div className="flex items-center gap-2 px-4">
                  <LanguageSwitcher />
                  <ThemeToggle className="h-10 w-10 p-2 rounded-full glass" />
                </div>
                <div className="px-4 pt-2">
                  {loading ? null : user ? (
                    <Link
                      href={profile?.role === "admin" ? "/admin" : "/account"}
                      className="block w-full text-center px-6 py-3 rounded-xl bg-green text-on-void text-sm font-semibold hover:bg-green/90 transition-all"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t("mySpace")}
                    </Link>
                  ) : (
                    <Link
                      href="/auth/login?next=/candidater"
                      className="block w-full text-center px-6 py-3 rounded-xl bg-green text-on-void text-sm font-semibold hover:bg-green/90 transition-all"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t("candidater")}
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </motion.nav>
      </div>

      {/* ── Content Grid (pushed to bottom) ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-6 sm:px-16 lg:px-[var(--page-px)] pt-28 pb-10 sm:py-10 md:py-14 lg:py-16">
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
                  <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                  {th("badge")}
                </span>
              </motion.div>

              {/* Trust Pill */}
              <motion.div
                variants={fadeUp}
                className="trust-pill mb-5"
              >
                <div className="avatar-stack">
                  <div className="mini-avatar">AD</div>
                  <div className="mini-avatar">KM</div>
                  <div className="mini-avatar plus">+</div>
                </div>
                <span className="trust-stars" aria-hidden="true">★★★★★</span>
                <span className="trust-text">{th("trust")}</span>
              </motion.div>

              <h1 className="space-y-0">
                {[th("titleLine1"), th("titleLine2")].map((line, i) => (
                  <motion.span
                    key={line}
                    custom={i}
                    variants={lineReveal}
                    initial="hidden"
                    animate="visible"
                    className="block font-display font-medium leading-[0.95] tracking-[-0.04em] text-white"
                    style={{ fontSize: "var(--page-font-hero)" }}
                  >
                    {line}
                  </motion.span>
                ))}
                <motion.span
                  custom={2}
                  variants={lineReveal}
                  initial="hidden"
                  animate="visible"
                  className="block font-display font-medium leading-[0.95] tracking-[-0.04em] text-white"
                  style={{ fontSize: "var(--page-font-hero)" }}
                >
                  {th("titleDe")}{" "}
                  <TextRoll
                    words={["Manakara", "Vohipeno"]}
                    interval={2500}
                    className="font-serif italic font-normal text-teal"
                  />
                  .
                </motion.span>
              </h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-[520px] text-[15px] md:text-[17px] leading-relaxed text-white/65 font-body"
              >
                {th("subtitle")}
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-wrap items-center gap-4 pt-3"
              >
                <Link
                  href={user ? "/candidater" : "/auth/login?next=/candidater"}
                  className="group px-7 py-3.5 rounded-[14px] bg-green text-on-void font-semibold text-sm hover:bg-green/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green/25 active:scale-[0.98] flex items-center gap-2.5"
                >
                  {t("join")}
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
                </Link>

                <button
                  onClick={() => scrollTo("opportunite")}
                  className="px-7 py-3.5 rounded-[14px] border border-white/[0.18] bg-white/[0.05] text-white font-semibold text-sm hover:bg-white/[0.1] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  {t("more")}
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

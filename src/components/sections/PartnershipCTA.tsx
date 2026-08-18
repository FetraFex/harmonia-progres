"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { ArrowRightIcon } from "@/components/ui/Icons";

export function PartnershipCTA() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();
  const t = useTranslations("partnership");

  return (
    <section
      id="partenaires"
      ref={ref}
      className="relative z-10 bg-void-2"
    >
      <div className="px-32 max-w-[1280px] mx-auto py-24 md:py-32">
        <div
          className={`text-center space-y-8 transition-all duration-700 ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-teal">
            {t("kicker")}
          </span>

          <h2
            className="font-display font-bold tracking-tight text-text-primary leading-tight max-w-3xl mx-auto"
            style={{ fontSize: "clamp(28px, 4.5vw, 56px)" }}
          >
            {t("title1")}{" "}
            <span className="text-teal">{t("title2")}</span>{" "}
            {t("title3")}
          </h2>

          <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
            {t("paragraph")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#contact"
              className="px-8 py-4 rounded-full bg-teal text-on-void font-display font-bold text-sm sm:text-base hover:bg-teal/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-teal/25 flex items-center gap-2"
            >
              <span>{t("becomePartner")}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </a>

            <a
              href="#contact"
              className="px-7 py-4 rounded-full border border-glass-border bg-glass-bg text-text-primary font-semibold text-sm sm:text-base transition-all hover:bg-glass-bg-strong hover:translate-x-0.5 flex items-center gap-2"
            >
              <span>{t("supportProject")}</span>
              <ArrowRightIcon className="w-4 h-4 text-teal" />
            </a>
          </div>

          <p className="text-xs text-text-muted pt-4">
            {t("footnote")}
          </p>
        </div>
      </div>
    </section>
  );
}

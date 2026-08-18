"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MetricCard } from "./MetricCard";

export function HeroMetrics() {
  const t = useTranslations("hero");
  const METRICS = t.raw("metrics") as { value: string; label: string }[];
  const LOGO_INDEX = 2; // replace the 3rd card (Partenaires locaux) with ISPM logo

  return (
    <div
      data-hero-metrics
      className="flex flex-col sm:flex-row gap-3 md:gap-4"
    >
      {METRICS.map((metric, i) =>
        i === LOGO_INDEX ? (
          <motion.div
            key="ispm-logo"
            className="hero-metric-card group flex items-center justify-center min-h-[90px]"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: 1.2 + i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <Image
              src="/images/ispm-logo-transparent.png"
              alt="ISPM"
              width={72}
              height={72}
              className="object-contain opacity-90 group-hover:opacity-100 transition-opacity"
              priority
            />
          </motion.div>
        ) : (
          <MetricCard
            key={metric.label}
            value={metric.value}
            label={metric.label}
            index={i}
          />
        )
      )}
    </div>
  );
}

"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { MetricCard } from "./MetricCard";

export function HeroMetrics() {
  const t = useTranslations("hero");
  const METRICS = t.raw("metrics") as { value: string; label: string }[];

  return (
    <div
      data-hero-metrics
      className="flex flex-col sm:flex-row gap-3 md:gap-4"
    >
      {METRICS.map((metric, i) => (
        <MetricCard
          key={metric.label}
          value={metric.value}
          label={metric.label}
          index={i}
        />
      ))}
    </div>
  );
}

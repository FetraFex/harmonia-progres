"use client";

import React from "react";
import { MetricCard } from "./MetricCard";

const METRICS = [
  { value: "+350", label: "Jeunes accompagnés" },
  { value: "+80", label: "Entrepreneurs soutenus" },
  { value: "+25", label: "Partenaires locaux" },
];

export function HeroMetrics() {
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

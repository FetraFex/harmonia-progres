"use client";

import React, { useEffect, useState } from "react";
import { motion, animate, useMotionValue } from "framer-motion";
import { useInView } from "react-intersection-observer";
import NumberFlow from "@number-flow/react";

interface MetricCardProps {
  value: string;
  label: string;
  index?: number;
}

function parseMetricValue(raw: string): { target: number; prefix: string; suffix: string } {
  const match = raw.match(/^([^0-9]*)([0-9]+)(.*)$/);
  if (!match) return { target: 0, prefix: raw, suffix: "" };
  return {
    prefix: match[1],
    target: parseInt(match[2], 10),
    suffix: match[3],
  };
}

export function MetricCard({ value, label, index = 0 }: MetricCardProps) {
  const { target, prefix, suffix } = parseMetricValue(value);
  const [displayValue, setDisplayValue] = useState(0);
  const count = useMotionValue(0);
  const { ref, inView } = useInView({ triggerOnce: false });

  useEffect(() => {
    if (inView) {
      animate(count, target, {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (latest) => setDisplayValue(Math.round(latest)),
      });
    } else {
      setDisplayValue(0);
    }
  }, [inView, count, target]);

  return (
    <motion.div
      ref={ref}
      className="hero-metric-card group"
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        delay: 1.2 + index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <span className="block text-3xl md:text-4xl font-display font-bold tracking-tight text-white">
        <NumberFlow
          value={displayValue}
          prefix={prefix}
          suffix={suffix}
          format={{ useGrouping: false }}
          trend={1}
        />
      </span>
      <span className="block text-xs md:text-sm text-white/70 font-medium mt-1 leading-snug">
        {label}
      </span>
    </motion.div>
  );
}

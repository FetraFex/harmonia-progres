"use client";

import React from "react";
import { motion } from "framer-motion";

interface MetricCardProps {
  value: string;
  label: string;
  index?: number;
}

export function MetricCard({ value, label, index = 0 }: MetricCardProps) {
  return (
    <motion.div
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
        {value}
      </span>
      <span className="block text-xs md:text-sm text-white/70 font-medium mt-1 leading-snug">
        {label}
      </span>
    </motion.div>
  );
}

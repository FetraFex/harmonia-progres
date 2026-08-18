"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function ScrollIndicator() {
  const t = useTranslations("hero");
  return (
    <motion.div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.8 }}
      aria-hidden="true"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">
        {t("scroll")}
      </span>
      <motion.div
        className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent"
        animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

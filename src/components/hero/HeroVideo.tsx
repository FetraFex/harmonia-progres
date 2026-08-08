"use client";

import React, { useState, useCallback, useSyncExternalStore } from "react";
import { motion } from "framer-motion";

interface HeroVideoProps {
  src: string;
  poster?: string;
  className?: string;
}

function getPrefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribePrefersReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

export function HeroVideo({ src, poster, className = "" }: HeroVideoProps) {
  const [videoError, setVideoError] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribePrefersReducedMotion,
    getPrefersReducedMotion,
    getPrefersReducedMotion
  );

  const handleError = useCallback(() => setVideoError(true), []);

  if (prefersReducedMotion || videoError) {
    if (poster) {
      return (
        <div
          className={`absolute inset-0 bg-cover bg-center ${className}`}
          style={{ backgroundImage: `url(${poster})` }}
          role="img"
          aria-label="Hero background"
        />
      );
    }
    return null;
  }

  return (
    <motion.video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      onError={handleError}
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
      aria-hidden="true"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <source src={src} type="video/mp4" />
    </motion.video>
  );
}

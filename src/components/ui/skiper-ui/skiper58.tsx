"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── TextRoll: cycles through words with per-letter roll animation ── */
export function TextRoll({
  words,
  interval = 2500,
  className = "",
  center = false,
}: {
  words: string[];
  interval?: number;
  className?: string;
  center?: boolean;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span
      className={`inline-flex items-baseline ${center ? "justify-center" : ""} ${className}`}
      role="status"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={index}
          className="inline-flex"
          initial="hidden"
          animate="visible"
          exit="exit"
          aria-label={words[index]}
        >
          {words[index].split("").map((char, i) => (
            <span
              key={`${index}-${i}`}
              className="inline-block overflow-hidden"
            >
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: "110%", opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      y: { duration: 0.45, delay: i * 0.04, ease: [0.33, 1, 0.68, 1] },
                      opacity: { duration: 0.25, delay: i * 0.04 },
                    },
                  },
                  exit: {
                    y: "-110%",
                    opacity: 0,
                    transition: {
                      y: { duration: 0.35, delay: i * 0.025, ease: [0.33, 1, 0.68, 1] },
                      opacity: { duration: 0.2, delay: i * 0.025 },
                    },
                  },
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            </span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

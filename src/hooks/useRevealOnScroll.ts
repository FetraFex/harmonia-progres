"use client";

import { useEffect, useRef, useState } from "react";

interface UseRevealOptions {
  threshold?: number;
  triggerOnce?: boolean;
}

export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  triggerOnce = true,
}: UseRevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isRevealed, setIsRevealed] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (isRevealed && triggerOnce) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsRevealed(false);
        }
      },
      { threshold }
    );

    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [threshold, triggerOnce, isRevealed]);

  return { ref, isRevealed };
}

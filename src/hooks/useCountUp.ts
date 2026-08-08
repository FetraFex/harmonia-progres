"use client";

import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  suffix?: string;
  prefix?: string;
  duration?: number;
  threshold?: number;
}

export function useCountUp(
  target: number,
  { suffix = "", prefix = "", duration = 1500, threshold = 0.4 }: UseCountUpOptions = {}
) {
  const ref = useRef<HTMLSpanElement | null>(null);

  const [hasAnimated, setHasAnimated] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  const [count, setCount] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return target;
    }
    return 0;
  });

  useEffect(() => {
    const node = ref.current;
    if (!node || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          let startTime: number | null = null;
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            // Cubic ease-out
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(easeOutCubic * target);

            setCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(animate);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [target, duration, threshold, hasAnimated]);

  const formattedCount = `${prefix}${count.toLocaleString("fr-FR")}${suffix}`;

  return { ref, count, formattedCount };
}

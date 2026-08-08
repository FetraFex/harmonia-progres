import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function initializeHeroScroll() {
  if (typeof window === "undefined") return;

  const ctx = gsap.context(() => {
    const heroSection = document.querySelector("[aria-label='Hero']");
    const heroVideo = document.querySelector("[data-hero-video]");
    const heroBgText = document.querySelector("[data-hero-bg-text]");
    const heroContent = document.querySelector("[data-hero-content]");
    const heroMetrics = document.querySelector("[data-hero-metrics]");

    if (!heroSection) return;

    gsap.to(heroVideo, {
      scale: 1.06,
      ease: "none",
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
      },
    });

    if (heroBgText) {
      gsap.to(heroBgText, {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          end: "bottom top",
          scrub: 0.3,
        },
      });
    }

    if (heroContent) {
      gsap.to(heroContent, {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }

    if (heroMetrics) {
      gsap.to(heroMetrics, {
        y: -20,
        ease: "none",
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });
    }
  });

  return ctx;
}

export function cleanupHeroAnimations(
  ctx: gsap.Context | null | undefined
) {
  ctx?.revert();
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

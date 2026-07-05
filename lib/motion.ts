import type { Transition } from "framer-motion";

/**
 * Shared motion language for ASDRÉ — slow, calm, luxury-inspired timing.
 * Every animation pulls its easing/spring/duration from here so the whole
 * experience shares one rhythm.
 */

// Signature easing — a soft, expensive-feeling ease-out (cubic-bezier).
export const EASE_LUX: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const DURATION = {
  fast: 0.4,
  base: 0.7,
  slow: 1.1,
  glacial: 1.6,
} as const;

/** Spring used to smooth scroll-linked motion values (the "camera"). */
export const SPRING_SCROLL: { stiffness: number; damping: number; mass: number } = {
  stiffness: 90,
  damping: 30,
  mass: 0.4,
};

/** Softer spring for mouse parallax on the hero object. */
export const SPRING_SOFT: { stiffness: number; damping: number; mass: number } = {
  stiffness: 60,
  damping: 18,
  mass: 0.6,
};

export const transitionLux = (duration = DURATION.base, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE_LUX,
});

/** Standard in-view viewport config: fire once, a little before fully visible. */
export const VIEWPORT_ONCE = { once: true, margin: "-12% 0px -12% 0px" } as const;

"use client";

import { type RefObject } from "react";
import {
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { SPRING_SCROLL } from "@/lib/motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import { useIsMobile } from "@/hooks/useIsMobile";

export interface SectionScroll {
  /** Raw 0→1 progress across the section's scroll runway. */
  progress: MotionValue<number>;
  /** Spring-smoothed progress — use this to drive the "camera". */
  smooth: MotionValue<number>;
  reduced: boolean;
  isMobile: boolean;
}

/**
 * Wraps `useScroll` for a pinned section: 0 when the section's top reaches the
 * viewport bottom, 1 when its bottom reaches the viewport top. Returns both raw
 * and spring-smoothed progress plus the reduced-motion / mobile flags so a
 * section can pick the right transform ranges.
 */
export function useSectionScroll(ref: RefObject<HTMLElement | null>): SectionScroll {
  const { reduced } = useReducedMotionPref();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, SPRING_SCROLL);

  return { progress: scrollYProgress, smooth, reduced, isMobile };
}

/** Convenience: map a progress value through input/output ranges. */
export function useRange(
  value: MotionValue<number>,
  input: number[],
  output: number[],
): MotionValue<number> {
  return useTransform(value, input, output);
}

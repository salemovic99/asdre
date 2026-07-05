"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { SPRING_SCROLL } from "@/lib/motion";

/**
 * A whisper-thin indigo progress bar pinned to the very top of the viewport,
 * tracking overall scroll through the story. Purely decorative wayfinding —
 * the value is a smoothed document scroll progress.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, SPRING_SCROLL);

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-brand/70"
      style={{ scaleX }}
    />
  );
}

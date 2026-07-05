"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";

/**
 * The living environment behind the whole story. Two vast, soft gradient
 * fields — one warm-neutral, one indigo — drift and shift as the user
 * descends, so the "room" quietly changes per chapter without hard breaks.
 * Sits at the very back; dark chapters paint their own full-bleed panel on top.
 */
export function AmbientBackground() {
  const { reduced } = useReducedMotionPref();
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 40, damping: 24, mass: 0.6 });

  const warmY = useTransform(p, [0, 1], ["-6%", "16%"]);
  const coolY = useTransform(p, [0, 1], ["12%", "-14%"]);
  const coolX = useTransform(p, [0, 1], ["8%", "-10%"]);
  const indigoOpacity = useTransform(p, [0, 0.35, 0.7, 1], [0.14, 0.26, 0.2, 0.32]);

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* base wash */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#ffffff_0%,var(--background)_55%,#f2f1ef_100%)]" />

      {/* warm neutral field */}
      <motion.div
        style={reduced ? undefined : { y: warmY }}
        className="absolute left-1/2 top-[8%] size-[70vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(214,211,209,0.6),transparent_62%)] blur-3xl"
      />

      {/* indigo accent field */}
      <motion.div
        style={reduced ? { opacity: 0.22 } : { y: coolY, x: coolX, opacity: indigoOpacity }}
        className="absolute right-[6%] top-[38%] size-[52vw] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.55),transparent_60%)] blur-[120px]"
      />

      {/* subtle vignette to seat the content */}
      <div className="absolute inset-0 bg-[radial-gradient(130%_100%_at_50%_50%,transparent_58%,rgba(28,25,23,0.06)_100%)]" />
    </div>
  );
}

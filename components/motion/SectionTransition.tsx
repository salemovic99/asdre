"use client";

import { type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useTransform,
  type MotionValue,
} from "framer-motion";

export interface SectionTransitionProps {
  /** Scroll progress (0→1) across the owning section's runway. */
  progress: MotionValue<number>;
  reduced: boolean;
  isMobile: boolean;
  /** scale at [start, middle, end] of the runway. */
  scaleRange?: [number, number, number];
  /** opacity at [0, 0.16, 0.84, 1]. */
  opacityRange?: [number, number, number, number];
  /** blur px at [0, 0.16, 0.84, 1]. */
  blurRange?: [number, number, number, number];
  /** translateZ depth travel (px); the illusion of flying through. */
  depth?: number;
  /** optional rotate (deg) at [start, end]. */
  rotateRange?: [number, number];
  className?: string;
  children: ReactNode;
}

/**
 * The productized "dive through portal" motion layer. Maps a section's scroll
 * progress onto composited transforms (scale / translateZ / blur / opacity) so
 * the camera appears to fly into the outgoing section while the next emerges
 * from depth. Degrades to an opacity-only crossfade under reduced motion, and
 * drops perspective/translateZ/blur on mobile.
 *
 * Hooks run unconditionally (Rules of Hooks); the chosen style is selected
 * afterwards.
 */
export function SectionTransition({
  progress,
  reduced,
  isMobile,
  scaleRange = [0.86, 1, 1.26],
  opacityRange = [0, 1, 1, 0],
  blurRange = [10, 0, 0, 14],
  depth = 260,
  rotateRange = [0, 0],
  className,
  children,
}: SectionTransitionProps) {
  const scale = useTransform(progress, [0, 0.5, 1], scaleRange);
  const opacity = useTransform(progress, [0, 0.16, 0.84, 1], opacityRange);
  const blurPx = useTransform(progress, [0, 0.16, 0.84, 1], blurRange);
  const filter = useMotionTemplate`blur(${blurPx}px)`;
  const translateZ = useTransform(progress, [0, 1], [-depth, depth * 0.7]);
  const rotate = useTransform(progress, [0, 1], rotateRange);

  if (reduced) {
    // `filter: "none"` explicitly clears any blur Framer set on a prior render —
    // it does NOT reset a style value once you stop passing it (would stick).
    return (
      <motion.div style={{ opacity, filter: "none", willChange: "opacity" }} className={className}>
        {children}
      </motion.div>
    );
  }

  const style = isMobile
    ? { scale, opacity, rotate, filter: "none", willChange: "transform, opacity" }
    : {
        scale,
        opacity,
        rotate,
        filter,
        translateZ,
        transformPerspective: 1200,
        willChange: "transform, opacity, filter",
      };

  return (
    <motion.div style={style} className={className}>
      {children}
    </motion.div>
  );
}

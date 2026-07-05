"use client";

import { type ReactNode } from "react";
import { motion, type Target } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";

interface FloatingObjectProps {
  children: ReactNode;
  /** Vertical bob distance (px). */
  amplitude?: number;
  /** Seconds per full bob cycle. */
  bobDuration?: number;
  /** Seconds per full rotation; 0 disables rotation. */
  rotateDuration?: number;
  /** Which axis to rotate around. */
  spin?: "z" | "y";
  delay?: number;
  className?: string;
}

/**
 * A slowly floating, rotating luxury object (crystal, ring, sculpture …).
 * Infinite motion is COMPLETELY disabled under reduced motion for vestibular
 * safety — it renders as a still object.
 */
export function FloatingObject({
  children,
  amplitude = 14,
  bobDuration = 7,
  rotateDuration = 44,
  spin = "y",
  delay = 0,
  className,
}: FloatingObjectProps) {
  const { reduced } = useReducedMotionPref();

  if (reduced) {
    return <div className={cn("[transform-style:preserve-3d]", className)}>{children}</div>;
  }

  const animate: Target = { y: [-amplitude, amplitude, -amplitude] };
  if (rotateDuration > 0) {
    if (spin === "y") animate.rotateY = [0, 360];
    else animate.rotateZ = [0, 360];
  }

  return (
    <motion.div
      className={cn("will-change-transform [transform-style:preserve-3d]", className)}
      style={{ transformPerspective: 1000 }}
      animate={animate}
      transition={{
        y: { duration: bobDuration, repeat: Infinity, ease: "easeInOut", delay },
        rotateY: { duration: rotateDuration, repeat: Infinity, ease: "linear", delay },
        rotateZ: { duration: rotateDuration, repeat: Infinity, ease: "linear", delay },
      }}
    >
      {children}
    </motion.div>
  );
}

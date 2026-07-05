"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { SPRING_SCROLL } from "@/lib/motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ParallaxProps {
  children: ReactNode;
  /** Fraction of the scroll distance to travel; negative reverses direction. */
  speed?: number;
  axis?: "x" | "y";
  className?: string;
}

/**
 * Scroll-linked translation for background/foreground depth layering. Static
 * under reduced motion or on mobile.
 */
export function Parallax({ children, speed = 0.25, axis = "y", className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useReducedMotionPref();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const distance = 120 * speed;
  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const value = useSpring(raw, SPRING_SCROLL);

  const disabled = reduced || isMobile;

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={disabled ? undefined : axis === "y" ? { y: value } : { x: value }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { createElement, type ElementType } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_LUX, VIEWPORT_ONCE } from "@/lib/motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";

interface RevealProps {
  text: string;
  /** Semantic wrapper tag (defaults to a span). */
  as?: ElementType;
  splitBy?: "word" | "char";
  stagger?: number;
  delay?: number;
  duration?: number;
  className?: string;
  /** Per-token class (e.g. to accent a word). */
  tokenClassName?: string;
  once?: boolean;
}

/**
 * Cinematic text reveal — each word (or char) rises from behind a clip mask,
 * staggered. The full text is exposed to assistive tech via aria-label while
 * the animated tokens are aria-hidden. Under reduced motion it renders the
 * plain text with no split animation.
 */
export function Reveal({
  text,
  as = "span",
  splitBy = "word",
  stagger = 0.045,
  delay = 0,
  duration = 0.8,
  className,
  tokenClassName,
  once = true,
}: RevealProps) {
  const { reduced } = useReducedMotionPref();

  if (reduced) {
    // Wrap so per-token styling (e.g. gradient fill) survives the static path.
    return createElement(as, { className }, <span className={tokenClassName}>{text}</span>);
  }

  const tokens = splitBy === "char" ? Array.from(text) : text.split(" ");

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
  const token: Variants = {
    hidden: { y: "115%", opacity: 0 },
    show: { y: "0%", opacity: 1, transition: { duration, ease: EASE_LUX } },
  };

  const viewport = once
    ? VIEWPORT_ONCE
    : ({ once: false, margin: "-12% 0px" } as const);

  return createElement(
    as,
    { className, "aria-label": text },
    <motion.span
      aria-hidden="true"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={cn(
        "inline-flex flex-wrap pb-[0.14em] -mb-[0.14em]",
        splitBy === "word" ? "gap-x-[0.28em]" : "gap-x-0",
      )}
    >
      {tokens.map((tok, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em]"
        >
          <motion.span
            variants={token}
            className={cn("inline-block will-change-transform", tokenClassName)}
          >
            {tok === " " ? " " : tok}
          </motion.span>
        </span>
      ))}
    </motion.span>,
  );
}

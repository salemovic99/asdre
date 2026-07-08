"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A modern, minimal scroll cue shaped like a mouse: a slim rounded capsule with
 * a wheel-dot that travels down and fades on a loop. Rendered as a real anchor
 * to the first chapter, so it is clickable and keyboard-focusable. On hover the
 * body lifts, its rim warms to the brand wine and gains a soft focus ring, and
 * the label sharpens — a quiet, premium interaction.
 */
export function ScrollMouse({
  reduced = false,
  className,
}: {
  reduced?: boolean;
  className?: string;
}) {
  return (
    <a
      href="#about"
      aria-label="Scroll to explore"
      className={cn(
        "group inline-flex cursor-pointer flex-col items-center gap-3 rounded-full outline-none",
        "focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-4 focus-visible:ring-offset-background",
        className,
      )}
    >
      {/* mouse body */}
      <span
        className={cn(
          "relative flex h-11 w-[26px] items-start justify-center rounded-full border border-foreground/25",
          "bg-background/30 backdrop-blur-sm transition-all duration-300 ease-out",
          "group-hover:-translate-y-0.5 group-hover:border-brand",
          "group-hover:shadow-[0_0_0_4px_rgba(79,70,229,0.10),0_10px_30px_-12px_rgba(79,70,229,0.5)]",
        )}
      >
        {/* wheel */}
        <motion.span
          className="mt-[7px] h-2 w-[3px] rounded-full bg-foreground/55 transition-colors duration-300 group-hover:bg-brand"
          animate={reduced ? undefined : { y: [0, 10, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>

      <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
        Scroll
      </span>
    </a>
  );
}

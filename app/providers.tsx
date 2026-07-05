"use client";

import { type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import {
  ReducedMotionProvider,
  useReducedMotionPref,
} from "@/hooks/useReducedMotionPref";
import { useLenis } from "@/hooks/useLenis";
import { EASE_LUX, DURATION } from "@/lib/motion";
import { TooltipProvider } from "@/components/ui/tooltip";

function ExperienceRuntime({ children }: { children: ReactNode }) {
  const { userReduced } = useReducedMotionPref();
  // Lenis smooth-scroll (self-disables under reduced motion).
  useLenis();

  return (
    <MotionConfig
      // "user" auto-respects the OS setting; flip to "always" when the user
      // opts in via the toggle so reduction is forced site-wide.
      reducedMotion={userReduced ? "always" : "user"}
      transition={{ duration: DURATION.base, ease: EASE_LUX }}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </MotionConfig>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReducedMotionProvider>
      <ExperienceRuntime>{children}</ExperienceRuntime>
    </ReducedMotionProvider>
  );
}

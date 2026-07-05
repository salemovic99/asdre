"use client";

import { Waves, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * User-facing motion toggle. Flips the reduced-motion context (persisted),
 * which forces MotionConfig to "always" and disables infinite/parallax motion
 * across the experience. Offered alongside the OS-level preference.
 */
export function ReduceMotionToggle({ className }: { className?: string }) {
  const { userReduced, toggle } = useReducedMotionPref();
  const label = userReduced ? "Motion reduced — restore motion" : "Reduce motion";

  return (
    <Tooltip>
      <TooltipTrigger
        type="button"
        aria-pressed={userReduced}
        aria-label={label}
        onClick={toggle}
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-full border border-border/70 bg-background/50 text-foreground/70 backdrop-blur transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
          userReduced && "border-brand/40 text-brand",
          className,
        )}
      >
        {userReduced ? (
          <Minus className="size-4" aria-hidden="true" />
        ) : (
          <Waves className="size-4" aria-hidden="true" />
        )}
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

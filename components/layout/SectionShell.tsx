"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import {
  SectionTransition,
  type SectionTransitionProps,
} from "@/components/motion/SectionTransition";

type DepthProps = Pick<
  SectionTransitionProps,
  "scaleRange" | "opacityRange" | "blurRange" | "depth" | "rotateRange"
>;

interface SectionShellProps extends DepthProps {
  id: string;
  /** Accessible label id for the section heading. */
  labelledBy?: string;
  children: ReactNode;
  /** Runway height as a vh multiple (desktop). Taller = slower dive. */
  trackVh?: number;
  mobileTrackVh?: number;
  className?: string;
  /** Classes for the centered, full-viewport content panel. */
  contentClassName?: string;
}

/**
 * A pinned story chapter: a tall scroll runway containing a sticky full-viewport
 * panel. The panel's content is wrapped in <SectionTransition> so it dives
 * through the portal as the user scrolls. Every content section composes this.
 */
export function SectionShell({
  id,
  labelledBy,
  children,
  trackVh = 180,
  mobileTrackVh = 130,
  className,
  contentClassName,
  ...depth
}: SectionShellProps) {
  const ref = useRef<HTMLElement>(null);
  const { smooth, reduced, isMobile } = useSectionScroll(ref);
  const trackHeight = isMobile ? mobileTrackVh : trackVh;

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative w-full", className)}
      style={{ height: `${trackHeight}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden [transform-style:preserve-3d]">
        <SectionTransition
          progress={smooth}
          reduced={reduced}
          isMobile={isMobile}
          {...depth}
          className={cn(
            "flex h-full w-full items-center justify-center px-6 sm:px-10",
            contentClassName,
          )}
        >
          {children}
        </SectionTransition>
      </div>
    </section>
  );
}

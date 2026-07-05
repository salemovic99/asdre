"use client";

import { useEffect, useState } from "react";
import { CHAPTERS, type ChapterId } from "@/lib/chapters";

/**
 * Tracks which chapter is currently centered in the viewport by observing each
 * section element. Returns the active ChapterId — drives the nav/progress
 * active state without coupling to fixed scroll offsets (sections vary in
 * runway height).
 */
export function useActiveChapter(): ChapterId {
  const [active, setActive] = useState<ChapterId>("hero");

  useEffect(() => {
    const elements = CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most-visible intersecting section.
        let best: { id: ChapterId; ratio: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id as ChapterId;
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { id, ratio: entry.intersectionRatio };
          }
        }
        if (best) setActive(best.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}

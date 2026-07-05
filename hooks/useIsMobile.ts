"use client";

import { useEffect, useState } from "react";

/**
 * Reports whether the viewport is below `breakpoint` (default 768px).
 * Used to flatten expensive 3D/blur effects on mobile. SSR-safe: returns
 * false until mounted, then syncs to the real media query.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";

/**
 * Cinematic inertial smooth-scroll via Lenis. Lenis drives the native
 * document scroll, which Framer Motion's `useScroll` reads transparently, so
 * the portal transitions inherit the smoothing. Disabled under reduced-motion
 * (falls back to the browser's native scroll).
 */
export function useLenis(): void {
  const { reduced } = useReducedMotionPref();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Route in-page anchor clicks through Lenis for a smooth glide.
    const onAnchorClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!target) return;
      const id = target.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      event.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.4 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
    };
  }, [reduced]);
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { HOURGLASS } from "@/lib/content";
import { SPRING_SCROLL } from "@/lib/motion";
import { ParticleField } from "@/components/visual/Shapes";
import { Odometer, StaticOdometer, COUNTDOWN_SECONDS } from "@/components/visual/Odometer";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * The Countdown — the bridge out of the hero dive.
 *
 * An almost-silent warm-white room holding one object: a mechanical timer that
 * runs 00:59:59 down to 00:00:00 as you scroll. Time is spent rather than
 * counted; when it lands, the light warms, motes drift up, and the room fogs
 * into the warm white Patience opens on.
 *
 * The room's colour is never animated. The section base is #fafaf9 and the
 * closing fog is the opacity of a solid #fafaf9 panel, so both seams — Hero's
 * whiteout above, Patience's room below — are white meeting white.
 */

// ── Reduced motion: the countdown already spent.
function StaticHourglass() {
  return (
    <section
      id="hourglass"
      aria-labelledby="hourglass-heading"
      className="relative flex min-h-screen w-full flex-col items-center justify-center gap-14 overflow-hidden bg-[#fafaf9] px-6 py-32"
    >
      <h2 id="hourglass-heading" className="sr-only">
        {HOURGLASS.heading}
      </h2>

      <span className="font-mono text-xs uppercase tracking-[0.5em] text-brand">
        {HOURGLASS.eyebrow}
      </span>

      <p className="sr-only">{HOURGLASS.countdownLabel}</p>
      <StaticOdometer />
    </section>
  );
}

export function Hourglass() {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useReducedMotionPref();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, SPRING_SCROLL);

  const track = isMobile ? 240 : 300;
  const u = (track - 100) / track;
  const k = (n: number) => n * u;

  const seconds = useTransform(p, [k(0.12), k(0.72)], [COUNTDOWN_SECONDS, 0]);

  const eyebrowOpacity = useTransform(p, [k(0.02), k(0.08), k(0.8), k(0.86)], [0, 1, 1, 0]);
  const clockOpacity = useTransform(p, [k(0.05), k(0.14), k(0.84), k(0.92)], [0, 1, 1, 0]);
  // The timer settles into place, then draws a breath as it lands on zero.
  const clockScale = useTransform(p, [k(0.05), k(0.14), k(0.72), k(0.9)], [0.94, 1, 1, 1.06]);

  // The final second: a wine flare as the last digit falls.
  const flareOpacity = useTransform(p, [k(0.7), k(0.74), k(0.82)], [0, 0.7, 0]);
  const flareScale = useTransform(p, [k(0.7), k(0.82)], [0.7, 1.2]);

  // Time lands; the room warms and comes alive again.
  const warmOpacity = useTransform(p, [k(0.7), k(0.8), k(0.94)], [0, 0.85, 0]);
  const moteOpacity = useTransform(p, [k(0.78), k(0.86), k(0.94)], [0, 1, 0]);
  const moteScale = useTransform(p, [k(0.78), k(0.95)], [1, 3.2]);
  // The fog: a solid panel, landing before the unpin so the seam is white-on-white.
  const fogOpacity = useTransform(p, [k(0.86), k(0.94)], [0, 1]);

  if (reduced) return <StaticHourglass />;

  return (
    <section
      ref={ref}
      id="hourglass"
      aria-labelledby="hourglass-heading"
      className={`relative w-full bg-[#fafaf9] ${isMobile ? "h-[240vh]" : "h-[300vh]"}`}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <h2 id="hourglass-heading" className="sr-only">
          {HOURGLASS.heading}
        </h2>
        <p className="sr-only">{HOURGLASS.countdownLabel}</p>

        <div className="relative z-[1] flex h-full w-full flex-col items-center justify-center gap-14 px-6">
          <motion.span
            style={{ opacity: eyebrowOpacity }}
            className="font-mono text-xs uppercase tracking-[0.5em] text-brand"
          >
            {HOURGLASS.eyebrow}
          </motion.span>

          <div className="relative">
            {/* The flare rides behind the digits as the last second falls.
                Centring lives on this wrapper — a Tailwind translate would be
                overwritten by the inline transform framer's `scale` generates. */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                aria-hidden="true"
                style={{ opacity: flareOpacity, scale: flareScale, willChange: "opacity, transform" }}
                className="size-[60vw] max-w-[620px] rounded-full bg-[radial-gradient(circle,rgba(194,90,109,0.45),transparent_62%)] blur-2xl"
              />
            </div>

            <motion.div
              style={{ opacity: clockOpacity, scale: clockScale, willChange: "opacity, transform" }}
              className="relative"
            >
              <Odometer s={seconds} />
            </motion.div>
          </div>
        </div>

        {/* ── layers above the timer, inside the same pinned panel ── */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: warmOpacity }}
          className="pointer-events-none absolute inset-0 z-[4] bg-[radial-gradient(circle_at_50%_46%,rgba(201,138,43,0.22),transparent_58%)]"
        />
        <motion.div
          aria-hidden="true"
          style={{ opacity: moteOpacity, scale: moteScale, willChange: "transform, opacity" }}
          className="pointer-events-none absolute inset-0 z-[5]"
        >
          <ParticleField count={isMobile ? 24 : 44} tone="warm" />
        </motion.div>
        <motion.div
          aria-hidden="true"
          style={{ opacity: fogOpacity, willChange: "opacity" }}
          className="pointer-events-none absolute inset-0 z-[6] bg-[#fafaf9]"
        />
      </div>
    </section>
  );
}

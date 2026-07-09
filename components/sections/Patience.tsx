"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { PATIENCE } from "@/lib/content";
import { SPRING_SCROLL } from "@/lib/motion";
import { FadeIn } from "@/components/motion/FadeIn";
import { ParticleField } from "@/components/visual/Shapes";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * Patience — the held breath between the hero dive and the founding story.
 *
 * The room opens in the hero's warm white (its portal flash lands here, seamless),
 * holds one line, then darkens to the deep space About lives in while particles
 * and an ambient wine light rise. A long, motionless beat lets the second line
 * sit before the story begins.
 *
 * Colour is never animated. The section's own background is permanently dark and
 * a childless white overlay fades out over it — so the darken is a compositor-only
 * opacity crossfade, and the area revealed as the sticky panel unpins is already
 * dark. Animating `backgroundColor` instead would repaint every frame and flash
 * white at the seam, where the fixed #fafaf9 dot-grid shows through.
 */

const LINE_CLS =
  "max-w-[22ch] font-serif text-[clamp(1.6rem,5vw,3.25rem)] font-medium leading-[1.25] tracking-tight text-balance-pretty sm:max-w-[26ch]";

// ── Reduced motion: no pin, no scrub. The end state, stated plainly.
function StaticPatience() {
  return (
    <section
      id="patience"
      aria-labelledby="patience-heading"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0c0a09] px-6 py-32 text-center sm:px-10"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40">
        <ParticleField count={26} />
      </div>

      <h2 id="patience-heading" className="sr-only">
        {PATIENCE.heading}
      </h2>

      <div className="relative z-10 flex flex-col items-center gap-10">
        <FadeIn>
          <p className={`${LINE_CLS} text-[#fafaf9]`}>{PATIENCE.line1}</p>
        </FadeIn>

        <span
          aria-hidden="true"
          className="h-px w-24 bg-gradient-to-r from-transparent via-[#c25a6d]/70 to-transparent"
        />

        <FadeIn delay={0.15}>
          <p className={`${LINE_CLS} text-[#fafaf9]/70`}>{PATIENCE.line2}</p>
        </FadeIn>
      </div>
    </section>
  );
}

export function Patience() {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useReducedMotionPref();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const p = useSpring(scrollYProgress, SPRING_SCROLL);

  const track = isMobile ? 220 : 260;
  // The sticky panel releases here; every beat is a fraction of it so the
  // choreography always finishes before the handoff, whatever the track height.
  const u = (track - 100) / track;
  const k = (n: number) => n * u;

  // The room darkens. Fully dark by 0.62u — well ahead of the unpin, so the
  // spring's lag can never expose a light frame at the seam into About.
  const whiteOpacity = useTransform(p, [k(0.18), k(0.62)], [1, 0]);

  // Line 1 lives in the light. It is gone before the room turns.
  const line1Opacity = useTransform(p, [k(0.04), k(0.14), k(0.3), k(0.4)], [0, 1, 1, 0]);
  const line1Y = useTransform(p, [k(0.04), k(0.14), k(0.3), k(0.42)], [24, 0, 0, -28]);

  // Line 2 lives in the dark, and holds — the pause the chapter is named for.
  const line2Opacity = useTransform(p, [k(0.52), k(0.64), k(0.9), k(0.99)], [0, 1, 1, 0]);
  const line2Y = useTransform(p, [k(0.52), k(0.64), k(0.9), k(1)], [20, 0, 0, -16]);

  const particleOpacity = useTransform(p, [k(0.4), k(0.62), k(0.9), k(1)], [0, 1, 1, 0]);
  const particleY = useTransform(p, [0, k(1)], [0, -40]);

  const glowOpacity = useTransform(p, [k(0.36), k(0.6), k(0.9), k(1)], [0, 0.85, 0.85, 0]);
  const glowScale = useTransform(p, [k(0.36), k(0.85)], [0.7, 1.1]);

  if (reduced) return <StaticPatience />;

  return (
    <section
      ref={ref}
      id="patience"
      aria-labelledby="patience-heading"
      // Dark base: what shows through as the sticky child slides away.
      className={`relative w-full bg-[#0c0a09] ${isMobile ? "h-[220vh]" : "h-[260vh]"}`}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-6 sm:px-10">
        {/* The warm-white room, dissolving. Childless, so no glyph ever repaints. */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: whiteOpacity, willChange: "opacity" }}
          className="pointer-events-none absolute inset-0 z-[5] bg-[#fafaf9]"
        />

        {/* Ambient wine light, rising with the dark. */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: glowOpacity, scale: glowScale, willChange: "opacity, transform" }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-[6] size-[90vw] max-w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(165,64,82,0.30),transparent_62%)] blur-3xl"
        />

        <motion.div
          aria-hidden="true"
          style={{ opacity: particleOpacity, y: particleY, willChange: "opacity, transform" }}
          className="pointer-events-none absolute inset-0 z-[6]"
        >
          <ParticleField count={isMobile ? 22 : 40} />
        </motion.div>

        <h2 id="patience-heading" className="sr-only">
          {PATIENCE.heading}
        </h2>

        {/* Both lines stay in the DOM and in the a11y tree — only opacity moves.
            They share one grid cell so each is centred without absolute
            positioning, which would collide with framer's `y` transform. */}
        <div className="relative z-10 grid w-full max-w-3xl place-items-center text-center">
          <motion.p
            style={{ opacity: line1Opacity, y: line1Y, willChange: "opacity, transform" }}
            className={`col-start-1 row-start-1 ${LINE_CLS} text-foreground`}
          >
            {PATIENCE.line1}
          </motion.p>

          <motion.p
            style={{ opacity: line2Opacity, y: line2Y, willChange: "opacity, transform" }}
            className={`col-start-1 row-start-1 ${LINE_CLS} text-[#fafaf9]`}
          >
            {PATIENCE.line2}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

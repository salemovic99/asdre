"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { COMING_SOON } from "@/lib/content";
import { EASE_LUX, VIEWPORT_ONCE } from "@/lib/motion";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/Reveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { ParticleField } from "@/components/visual/Shapes";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * A quiet, non-functional countdown placeholder — luxury cannot be rushed.
 * The digits carry a slow shimmer sweep instead of a flat pulse.
 */
function CountdownPlaceholder({ reduced }: { reduced: boolean }) {
  const units = ["Days", "Hours", "Minutes"];
  return (
    <div className="flex items-end justify-center gap-5 sm:gap-8" aria-hidden="true">
      {units.map((unit, i) => (
        <div key={unit} className="flex items-end gap-5 sm:gap-8">
          <div className="flex flex-col items-center">
            <motion.span
              className="block bg-[linear-gradient(100deg,rgba(255,255,255,0.32)_20%,#ffffff_50%,rgba(255,255,255,0.32)_80%)] bg-[length:220%_100%] bg-clip-text font-serif text-5xl font-light tabular-nums text-transparent sm:text-7xl"
              animate={reduced ? undefined : { backgroundPosition: ["160% 0", "-60% 0"] }}
              transition={
                reduced ? undefined : { duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }
              }
            >
              00
            </motion.span>
            <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">
              {unit}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="pb-9 font-serif text-3xl text-white/15 sm:text-5xl">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

export function ComingSoon() {
  const { reduced } = useReducedMotionPref();
  const isMobile = useIsMobile();
  const interactive = !reduced && !isMobile;

  // Cursor-tracked spotlight (delta from section center; rests centered).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });

  // Pointer-reactive drift for the headline.
  const { x: pmx, y: pmy } = useMouseParallax();
  const headX = useTransform(pmx, [-0.5, 0.5], [-12, 12]);
  const headY = useTransform(pmy, [-0.5, 0.5], [-8, 8]);

  return (
    <section
      id="coming-soon"
      aria-labelledby="coming-soon-heading"
      onPointerMove={
        interactive
          ? (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              mx.set(e.clientX - r.left - r.width / 2);
              my.set(e.clientY - r.top - r.height / 2);
            }
          : undefined
      }
      onPointerLeave={
        interactive
          ? () => {
              mx.set(0);
              my.set(0);
            }
          : undefined
      }
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0c0a09] py-32 text-white"
    >
      {/* slow rotating aurora ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 size-[120vw] max-w-[1400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(99,102,241,0.10),transparent_35%,rgba(79,70,229,0.08),transparent_70%)] blur-[100px]"
        animate={reduced ? undefined : { rotate: 360 }}
        transition={reduced ? undefined : { duration: 70, repeat: Infinity, ease: "linear" }}
      />

      {/* cursor-tracked wine spotlight (rests centered) */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <motion.div
          aria-hidden="true"
          style={interactive ? { x: smx, y: smy } : undefined}
          className="size-[80vw] max-w-[900px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.22),transparent_62%)] blur-3xl"
        />
      </div>

      {/* drifting particle field */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        animate={reduced ? undefined : { y: [0, -20, 0] }}
        transition={reduced ? undefined : { duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <ParticleField count={isMobile ? 26 : 54} />
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 text-center">
        <FadeIn className="mb-10">
          <Badge className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.4em] text-white/70 backdrop-blur-md">
            06 — {COMING_SOON.eyebrow}
          </Badge>
        </FadeIn>

        <motion.div style={interactive ? { x: headX, y: headY } : undefined}>
          <Reveal
            as="h2"
            text={COMING_SOON.headline}
            stagger={0.06}
            className="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-primary sm:text-6xl lg:text-7xl"
          />
        </motion.div>
        <span id="coming-soon-heading" className="sr-only">
          Coming Soon
        </span>

        {/* hairline divider */}
        <motion.span
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 1, delay: 0.3, ease: EASE_LUX }}
          className="mt-12 h-px w-24 origin-center bg-gradient-to-r from-transparent via-[#c25a6d]/70 to-transparent"
        />

        <div className="mt-12">
          <CountdownPlaceholder reduced={reduced} />
        </div>

        <div className="mt-14 max-w-xl space-y-4">
          {COMING_SOON.body.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.9, delay: i * 0.12, ease: EASE_LUX }}
              className="text-sm leading-relaxed text-secondary sm:text-base"
            >
              {para}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}

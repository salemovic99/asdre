"use client";

import { motion } from "framer-motion";
import { COMING_SOON } from "@/lib/content";
import { EASE_LUX, VIEWPORT_ONCE } from "@/lib/motion";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/Reveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { ParticleField } from "@/components/visual/Shapes";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";

/** A quiet, non-functional countdown placeholder — luxury cannot be rushed. */
function CountdownPlaceholder() {
  const { reduced } = useReducedMotionPref();
  const units = ["Days", "Hours", "Minutes"];
  return (
    <div className="flex items-end justify-center gap-5 sm:gap-8" aria-hidden="true">
      {units.map((unit, i) => (
        <div key={unit} className="flex items-end gap-5 sm:gap-8">
          <div className="flex flex-col items-center">
            <motion.span
              animate={reduced ? undefined : { opacity: [0.5, 0.85, 0.5] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
              className="font-serif text-4xl font-light tabular-nums text-white/90 sm:text-6xl"
            >
              00
            </motion.span>
            <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">
              {unit}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="pb-8 font-serif text-3xl text-white/20 sm:text-5xl">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

export function ComingSoon() {
  const { reduced } = useReducedMotionPref();
  return (
    <section
      id="coming-soon"
      aria-labelledby="coming-soon-heading"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0c0a09] py-32 text-white"
    >
      {/* spotlight */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/3 size-[80vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.22),transparent_62%)] blur-3xl"
      />
      {/* particles */}
      <motion.div
        className="absolute inset-0"
        animate={reduced ? undefined : { y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <ParticleField count={54} />
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 text-center">
        <FadeIn className="mb-10">
          <Badge className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.4em] text-white/70">
            06 — {COMING_SOON.eyebrow}
          </Badge>
        </FadeIn>

        <Reveal
          as="h2"
          text={COMING_SOON.headline}
          stagger={0.06}
          className="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl"
        />
        <span id="coming-soon-heading" className="sr-only">
          Coming Soon
        </span>

        <div className="mt-14">
          <CountdownPlaceholder />
        </div>

        <div className="mt-14 max-w-xl space-y-4">
          {COMING_SOON.body.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.9, delay: i * 0.12, ease: EASE_LUX }}
              className="text-sm leading-relaxed text-white/55 sm:text-base"
            >
              {para}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}

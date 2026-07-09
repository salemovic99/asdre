"use client";

import { motion } from "framer-motion";
import { MISSION } from "@/lib/content";
import { EASE_LUX, VIEWPORT_ONCE } from "@/lib/motion";
import { SectionShell } from "@/components/layout/SectionShell";
import { Reveal } from "@/components/motion/Reveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";

/** Self-drawing fabric-fold lines. */
function FabricLines() {
  const { reduced } = useReducedMotionPref();
  const paths = [
    "M-40 120 C 260 40, 460 200, 760 110 S 1300 40, 1520 150",
    "M-40 220 C 300 150, 520 300, 820 210 S 1320 150, 1520 250",
    "M-40 320 C 240 260, 500 380, 800 320 S 1280 280, 1520 350",
  ];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 400"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.5]"
    >
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke={i === 1 ? "var(--brand)" : "var(--border)"}
          strokeOpacity={i === 1 ? 0.35 : 0.9}
          strokeWidth={1.25}
          initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
          whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 2.2, delay: i * 0.25, ease: EASE_LUX }}
        />
      ))}
    </svg>
  );
}

export function Mission() {
  return (
    <SectionShell
      id="mission"
      labelledBy="mission-heading"
      trackVh={200}
      scaleRange={[0.92, 1, 1.16]}
      blurRange={[8, 0, 0, 12]}
      depth={190}
    >
      <div className="relative flex w-full max-w-4xl flex-col items-center text-center">
        <FabricLines />

        <FadeIn className="mb-10">
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-brand">
            03 — {MISSION.eyebrow}
          </span>
        </FadeIn>

        <Reveal
          as="h2"
          text={MISSION.statement}
          stagger={0.045}
          className="max-w-3xl font-serif text-[1.75rem] font-medium leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl"
          tokenClassName="brand-gradient-text"
        />
        <span id="mission-heading" className="sr-only">
          Mission
        </span>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-3"
        >
          {MISSION.pillars.map((pillar) => (
            <motion.li
              key={pillar}
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_LUX } },
              }}
              className="rounded-full border border-border/70 bg-card/50 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-secondary-foreground backdrop-blur-sm"
            >
              {pillar}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </SectionShell>
  );
}

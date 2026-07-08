"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { VALUES } from "@/lib/content";
import { SPRING_SCROLL } from "@/lib/motion";
import { Reveal } from "@/components/motion/Reveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * Values — a content-first "word-illumination" scrub. The statement sits still
 * and perfectly legible; as the section scrolls, the body sentence lights up
 * one word at a time — muted gray → full ink — beneath a clean serif title, with
 * key words ("considered", "feel", "name") glowing wine as they land. A thin
 * rail tracks the reveal. Modern, editorial, always readable. Fully scroll-driven
 * and reversible; degrades to a static, fully-lit layout under reduced motion.
 */

const BRAND = "#a54052";
const DIM = "#d6d3d1"; // unlit gray (border token)
const INK = "#0c0a09"; // lit foreground

// Reveal band across the runway — lead-in before, hold after.
const BAND_START = 0.12;
const BAND_END = 0.86;

const ACCENTS = new Set(["considered", "feel", "name"]);
const clean = (w: string) => w.replace(/[^a-zA-Z]/g, "").toLowerCase();

// ── One word that inks in as the scrub passes over it.
function Word({
  p,
  word,
  index,
  total,
  accent,
}: {
  p: MotionValue<number>;
  word: string;
  index: number;
  total: number;
  accent: boolean;
}) {
  const slice = (BAND_END - BAND_START) / total;
  const start = BAND_START + index * slice;
  const end = start + slice * 1.8; // overlap neighbours for a smooth sweep
  const t = useTransform(p, [start, end], [0, 1]);
  const color = useTransform(t, [0, 1], accent ? [DIM, BRAND] : [DIM, INK]);
  const opacity = useTransform(t, [0, 1], [0.55, 1]);
  return (
    <motion.span style={{ color, opacity }} className="inline-block">
      {word}
      {index < total - 1 ? " " : ""}
    </motion.span>
  );
}

// ── Bottom rail — how far the illumination has travelled.
function RevealRail({ p }: { p: MotionValue<number> }) {
  const fill = useTransform(p, [BAND_START, BAND_END], [0, 1]);
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex items-center justify-center gap-4 px-6">
      <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
        {VALUES.eyebrow}
      </span>
      <span className="relative h-px w-28 overflow-hidden bg-border sm:w-44">
        <motion.span style={{ scaleX: fill }} className="absolute inset-0 origin-left bg-brand" />
      </span>
    </div>
  );
}

// ── Reduced-motion fallback: static, fully-lit, no pin.
function StaticValues() {
  const words = VALUES.value.body.split(" ");
  return (
    <section id="values" aria-labelledby="values-heading" className="relative w-full bg-[#fafaf9] py-32 sm:py-40">
      <div className="mx-auto flex w-full max-w-3xl flex-col px-6">
        <span className="mb-8 font-mono text-xs uppercase tracking-[0.5em] text-brand">
          04 — {VALUES.eyebrow}
        </span>
        <h2
          id="values-heading"
          className="font-serif text-[clamp(2rem,6vw,3.5rem)] font-medium tracking-tight text-foreground"
        >
          {VALUES.value.title}
        </h2>
        <p className="mt-8 max-w-2xl font-serif text-[clamp(1.4rem,4vw,2.4rem)] leading-[1.4] tracking-tight">
          {words.map((w, i) => (
            <span key={`${w}-${i}`} style={{ color: ACCENTS.has(clean(w)) ? BRAND : INK }}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

export function Values() {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useReducedMotionPref();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, SPRING_SCROLL);

  // Gentle fade at the very tail so the pin hands off cleanly to Collections.
  const blockOpacity = useTransform(p, [0, 0.04, 0.94, 1], [0, 1, 1, 0.55]);

  if (reduced) return <StaticValues />;

  const words = VALUES.value.body.split(" ");

  return (
    <section
      id="values"
      ref={ref}
      aria-labelledby="values-heading"
      className={isMobile ? "relative h-[220vh]" : "relative h-[260vh]"}
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden bg-[#fafaf9]">
        <motion.div style={{ opacity: blockOpacity }} className="mx-auto flex w-full max-w-3xl flex-col px-6 sm:px-10">
          <FadeIn className="mb-8">
            <span className="font-mono text-xs uppercase tracking-[0.5em] text-brand">
              04 — {VALUES.eyebrow}
            </span>
          </FadeIn>

          <Reveal
            as="h2"
            text={VALUES.value.title}
            stagger={0.05}
            className="font-serif text-[clamp(2rem,6vw,3.5rem)] font-medium tracking-tight text-foreground"
          />
          <span id="values-heading" className="sr-only">
            Values
          </span>

          {/* the illuminated statement — full copy for a11y, per-word scrub visually */}
          <p
            aria-label={VALUES.value.body}
            className="mt-8 max-w-2xl font-serif text-[clamp(1.4rem,4vw,2.4rem)] leading-[1.4] tracking-tight"
          >
            <span aria-hidden="true">
              {words.map((w, i) => (
                <Word key={`${w}-${i}`} p={p} word={w} index={i} total={words.length} accent={ACCENTS.has(clean(w))} />
              ))}
            </span>
          </p>
        </motion.div>

        <RevealRail p={p} />
      </div>
    </section>
  );
}

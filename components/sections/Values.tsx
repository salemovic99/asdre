"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { VALUES } from "@/lib/content";
import { SPRING_SCROLL } from "@/lib/motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * Values — "The Loupe": a cinematic macro-zoom into focus. The section pins and
 * scrolling drives one continuous camera push-in that literalizes "attention to
 * detail": the question "What do we believe?" zooms up and blows past the lens,
 * fragments of the craft (SEAM · FABRIC · FINISH) streak through depth, and
 * "Attention to Detail" resolves from soft-and-distant into razor-sharp focus as
 * a precision loupe reticle draws in around it — blurry feeling → named detail.
 * Light throughout, fully scroll-driven and reversible; degrades to a static,
 * framed layout under reduced motion.
 */

const BRAND = "#4f46e5";
const GRAY = "#a8a29e";

// The craft fragments the camera flies through — pulled from value.body.
const FRAGMENTS: {
  word: string;
  tint: boolean;
  dx: string;
  dy: string;
  s0: number;
  s1: number;
  band: [number, number];
}[] = [
  { word: "SEAM", tint: false, dx: "-24%", dy: "-16%", s0: 0.4, s1: 6, band: [0.15, 0.5] },
  { word: "FABRIC", tint: true, dx: "22%", dy: "8%", s0: 0.5, s1: 7, band: [0.22, 0.58] },
  { word: "FINISH", tint: false, dx: "-6%", dy: "20%", s0: 0.45, s1: 6.5, band: [0.3, 0.62] },
];

// ── Warm-white base + a centre focal glow that sharpens and a vignette that
//    tightens as the camera settles. Opacity-only (never scale-on-blur).
function FocusBackdrop({ p }: { p: MotionValue<number> }) {
  const glow = useTransform(p, [0.45, 0.75], [0, 0.9]);
  const vignette = useTransform(p, [0.4, 0.82], [0.08, 0.46]);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f3f4f7,#fafaf9_45%,#ffffff)]" />
      <motion.div
        style={{ opacity: glow }}
        className="absolute top-1/2 left-1/2 size-[60vw] max-w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.16),transparent_64%)] blur-2xl"
      />
      <motion.div
        style={{ opacity: vignette }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_38%,rgba(12,10,9,0.16)_92%)]"
      />
    </div>
  );
}

// ── The opening question the camera zooms through.
function QuestionLayer({ p }: { p: MotionValue<number> }) {
  const scale = useTransform(p, [0, 0.28], [1, 12]);
  const opacity = useTransform(p, [0, 0.18], [1, 0]);
  const y = useTransform(p, [0, 0.28], [0, -40]);
  return (
    <motion.div
      aria-hidden="true"
      style={{ scale, opacity, y, willChange: "transform, opacity" }}
      className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-6"
    >
      <span className="font-serif text-[clamp(1.75rem,5.5vw,3.25rem)] font-medium tracking-tight text-foreground/80">
        What do we believe?
      </span>
    </motion.div>
  );
}

// ── One craft fragment streaking past the lens at its own depth.
function Fragment({ p, item }: { p: MotionValue<number>; item: (typeof FRAGMENTS)[number] }) {
  const [b0, b1] = item.band;
  const scale = useTransform(p, item.band, [item.s0, item.s1]);
  const opacity = useTransform(p, [b0, (b0 + b1) / 2, b1], [0, 0.5, 0]);
  return (
    <motion.span
      style={{ x: item.dx, y: item.dy, scale, opacity, color: item.tint ? BRAND : GRAY, willChange: "transform, opacity" }}
      className="absolute font-mono text-[clamp(0.9rem,2.6vw,1.7rem)] font-medium uppercase tracking-[0.4em]"
    >
      {item.word}
    </motion.span>
  );
}

function FragmentField({ p, isMobile }: { p: MotionValue<number>; isMobile: boolean }) {
  // Fewer planes on mobile for clarity + cost.
  const items = isMobile ? FRAGMENTS.slice(0, 2) : FRAGMENTS;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
      {items.map((item) => (
        <Fragment key={item.word} p={p} item={item} />
      ))}
    </div>
  );
}

// ── The focal title: small + soft + distant → scales up and pulls into sharp
//    focus. The blur pull is the "snap into focus" beat (desktop only).
function TitleFocus({ p, interactive }: { p: MotionValue<number>; interactive: boolean }) {
  const scale = useTransform(p, [0.3, 0.72], [0.35, 1]);
  const opacity = useTransform(p, [0.3, 0.5], [0, 1]);
  const blurPx = useTransform(p, [0.52, 0.72], [10, 0]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;
  const style = interactive
    ? { scale, opacity, filter, willChange: "transform, opacity, filter" }
    : { scale, opacity, filter: "none", willChange: "transform, opacity" };
  return (
    <motion.h2
      id="values-heading"
      style={style}
      className="font-serif text-[clamp(2.5rem,10vw,6.5rem)] font-medium leading-[0.95] tracking-tight text-balance text-foreground"
    >
      {VALUES.value.title}
    </motion.h2>
  );
}

// ── The precision loupe reticle — hairline frame, corner ticks, crosshair and a
//    focus point drawing in as the title resolves. The modern technical accent.
function LoupeReticle({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0.6, 0.78], [0, 1]);
  const scale = useTransform(p, [0.6, 0.86], [1.14, 1]);
  const draw = useTransform(p, [0.62, 0.88], [0, 1]);
  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity, scale }}
      className="pointer-events-none absolute top-1/2 left-1/2 aspect-[2/1] w-[86vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2"
    >
      <svg viewBox="0 0 640 320" fill="none" className="h-full w-full">
        {/* corner ticks */}
        {[
          "M24 60 V24 H60",
          "M616 60 V24 H580",
          "M24 260 V296 H60",
          "M616 260 V296 H580",
        ].map((d) => (
          <motion.path
            key={d}
            d={d}
            stroke={BRAND}
            strokeWidth={1.25}
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: draw }}
          />
        ))}
        {/* centre crosshair */}
        <motion.path d="M320 138 V182" stroke={BRAND} strokeWidth={1} vectorEffect="non-scaling-stroke" style={{ pathLength: draw }} />
        <motion.path d="M298 160 H342" stroke={BRAND} strokeWidth={1} vectorEffect="non-scaling-stroke" style={{ pathLength: draw }} />
        {/* focus ring */}
        <motion.circle cx={320} cy={160} r={13} stroke={BRAND} strokeWidth={1} vectorEffect="non-scaling-stroke" style={{ pathLength: draw }} />
      </svg>
      <span className="absolute top-0 left-0 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: BRAND }}>
        ×12 · MAG
      </span>
      <span className="absolute right-0 bottom-0 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: BRAND }}>
        f · DETAIL
      </span>
    </motion.div>
  );
}

// ── The body line, resolving under the title once focus lands.
function BodyReveal({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0.8, 0.95], [0, 1]);
  const y = useTransform(p, [0.8, 1], [16, 0]);
  return (
    <motion.p
      style={{ opacity, y }}
      className="mt-8 max-w-md text-balance text-base leading-relaxed text-muted-foreground sm:text-lg"
    >
      {VALUES.value.body}
    </motion.p>
  );
}

// ── Persistent overlay: chapter chip + a focus-state readout that flips to
//    "IN FOCUS" as the camera settles.
function FocusState({ p }: { p: MotionValue<number> }) {
  const focusing = useTransform(p, [0.64, 0.74], [1, 0]);
  const locked = useTransform(p, [0.68, 0.78], [0, 1]);
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-10 z-30 grid place-items-center font-mono text-[11px] uppercase tracking-[0.4em]">
      <span className="relative grid place-items-center">
        <motion.span style={{ opacity: focusing }} className="col-start-1 row-start-1 text-muted-foreground">
          Focusing…
        </motion.span>
        <motion.span
          style={{ opacity: locked, color: BRAND }}
          className="col-start-1 row-start-1 whitespace-nowrap"
        >
          In focus
        </motion.span>
      </span>
    </div>
  );
}

// ── Reduced-motion fallback: a static, framed composition (no pin, no zoom).
function StaticValues() {
  return (
    <section id="values" aria-labelledby="values-heading" className="relative w-full bg-[#fafaf9] py-32 sm:py-40">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 text-center">
        <span className="mb-8 font-mono text-xs uppercase tracking-[0.5em] text-brand">
          04 — {VALUES.eyebrow}
        </span>
        <span className="mb-6 font-serif text-lg font-medium tracking-tight text-foreground/70">
          {VALUES.question}
        </span>
        <div className="relative flex flex-col items-center">
          <svg
            aria-hidden="true"
            viewBox="0 0 640 320"
            fill="none"
            className="pointer-events-none absolute top-1/2 left-1/2 aspect-[2/1] w-[110%] max-w-[560px] -translate-x-1/2 -translate-y-1/2"
          >
            {["M24 60 V24 H60", "M616 60 V24 H580", "M24 260 V296 H60", "M616 260 V296 H580"].map((d) => (
              <path key={d} d={d} stroke={BRAND} strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
          <h2
            id="values-heading"
            className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            {VALUES.value.title}
          </h2>
        </div>
        <p className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground">{VALUES.value.body}</p>
      </div>
    </section>
  );
}

export function Values() {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useReducedMotionPref();
  const isMobile = useIsMobile();
  const interactive = !reduced && !isMobile;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, SPRING_SCROLL);

  if (reduced) return <StaticValues />;

  return (
    <section id="values" ref={ref} aria-labelledby="values-heading" className="relative h-[300vh] md:h-[360vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#fafaf9] [perspective:1200px]">
        <FocusBackdrop p={p} />
        <QuestionLayer p={p} />
        <FragmentField p={p} isMobile={isMobile} />

        {/* focus stack — reticle frames the title; body resolves beneath */}
        <div className="absolute inset-0 z-20 grid place-items-center px-6">
          <div className="relative flex flex-col items-center text-center">
            <LoupeReticle p={p} />
            <TitleFocus p={p} interactive={interactive} />
            <BodyReveal p={p} />
          </div>
        </div>

        {/* persistent overlay UI */}
        <div className="pointer-events-none absolute top-24 left-6 z-30 sm:top-28 sm:left-10">
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-brand">
            04 — {VALUES.eyebrow}
          </span>
        </div>
        <FocusState p={p} />
      </div>
    </section>
  );
}

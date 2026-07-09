"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  type MotionValue,
} from "framer-motion";
import { PATIENCE } from "@/lib/content";
import { SPRING_SCROLL } from "@/lib/motion";
import { FadeIn } from "@/components/motion/FadeIn";
import { ParticleField } from "@/components/visual/Shapes";
import { ThreadConnector } from "@/components/visual/ThreadConnector";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * Patience — the held breath between the hero dive and the founding story.
 *
 * The white room states it plainly — "We Are In Development" — over a quiet
 * second line. Then a dark iris opens from behind the type and swallows the
 * room, revealing the closing line inside it. The wipe rhymes with the hero's
 * dive through the counter of the D, and carries the hero's white flash down
 * into About's deep space.
 *
 * Two rules hold this together:
 *
 * 1. Colour is never animated. The section's own background is permanently dark,
 *    so the strip revealed as the sticky panel unpins is already dark — no white
 *    flash at the seam into About, where the fixed #fafaf9 dot-grid sits behind.
 *
 * 2. `clip-path` is NOT compositor-accelerated — it repaints on the main thread
 *    every frame. So only cheap layers are clipped: a flat colour fill and a text
 *    layer. The blurred glow and the box-shadowed particles are never clipped;
 *    they fade in on `opacity` once the iris has already covered the viewport.
 */

// Worst case (a square viewport) needs √2/2 ≈ 70.71vmax to reach the corners.
// `circle()` has no farthest-corner keyword, so the length is explicit. 80
// leaves margin for iOS's URL-bar viewport wobble.
const IRIS_MAX_VMAX = 80;

// The headline that names the moment.
const HEADING_CLS =
  "max-w-[13ch] font-serif text-[clamp(2.25rem,8vw,5.5rem)] font-medium leading-[1.02] tracking-tight";
// The poetic line beneath it — deliberately subordinate. Colour is supplied at
// the call site: this line sits on white when animated, on black when static.
const LINE1_CLS =
  "max-w-[30ch] font-serif text-[clamp(1.05rem,2.6vw,1.6rem)] font-medium leading-[1.4] tracking-tight";
// The line that lives inside the iris.
const LINE_CLS =
  "max-w-[22ch] font-serif text-[clamp(1.6rem,5vw,3.25rem)] font-medium leading-[1.25] tracking-tight sm:max-w-[26ch]";

// ── One word rising from behind a clip mask as the scrub passes over it.
function ScrubWord({
  p,
  word,
  index,
  total,
  start,
  end,
  wordClassName,
}: {
  p: MotionValue<number>;
  word: string;
  index: number;
  total: number;
  start: number;
  end: number;
  /** Sits on the animated span — a gradient fill must own the faded element. */
  wordClassName?: string;
}) {
  const slice = (end - start) / total;
  const wStart = start + index * slice;
  const wEnd = wStart + slice * 2.2; // overlap neighbours into a continuous sweep
  const y = useTransform(p, [wStart, wEnd], ["110%", "0%"]);
  const opacity = useTransform(p, [wStart, wEnd], [0, 1]);

  return (
    <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em]">
      <motion.span
        style={{ y, opacity, willChange: "transform" }}
        className={`inline-block ${wordClassName ?? ""}`}
      >
        {word}
      </motion.span>
    </span>
  );
}

// ── A line: per-word rise in, then a line-level hold and exit.
function ScrubLine({
  p,
  text,
  band,
  hold,
  className,
  wordClassName,
  as = "p",
  id,
}: {
  p: MotionValue<number>;
  text: string;
  /** [start, end] of the per-word rise. */
  band: [number, number];
  /** [holdEnd, gone] — the line fades and drifts out across this window. */
  hold: [number, number];
  className: string;
  wordClassName?: string;
  as?: "p" | "h2";
  id?: string;
}) {
  const opacity = useTransform(p, [hold[0], hold[1]], [1, 0]);
  const y = useTransform(p, [hold[0], hold[1]], [0, -24]);
  const words = text.split(" ");
  const Tag = as === "h2" ? motion.h2 : motion.p;

  return (
    <Tag
      id={id}
      aria-label={text}
      style={{ opacity, y, willChange: "transform" }}
      className={className}
    >
      {/* Tokens are decorative; the full sentence is on the aria-label. */}
      <span
        aria-hidden="true"
        className="inline-flex flex-wrap justify-center gap-x-[0.28em] pb-[0.14em] -mb-[0.14em]"
      >
        {words.map((w, i) => (
          <ScrubWord
            key={`${w}-${i}`}
            p={p}
            word={w}
            index={i}
            total={words.length}
            start={band[0]}
            end={band[1]}
            wordClassName={wordClassName}
          />
        ))}
      </span>
    </Tag>
  );
}

// ── The mono eyebrow, flanked by hairlines. The section's graphic anchor.
function Eyebrow({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-4 ${className ?? ""}`}>
      <span aria-hidden="true" className="h-px w-8 bg-brand/40 sm:w-12" />
      <span className="font-mono text-xs uppercase tracking-[0.5em] text-brand">
        {PATIENCE.eyebrow}
      </span>
      <span aria-hidden="true" className="h-px w-8 bg-brand/40 sm:w-12" />
    </span>
  );
}

// ── Reduced motion: no pin, no scrub, no iris. The end state, stated plainly.
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

      <div className="relative z-10 flex flex-col items-center gap-8">
        <FadeIn>
          <Eyebrow />
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 id="patience-heading" className={`${HEADING_CLS} brand-gradient-text`}>
            {PATIENCE.heading}
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className={`${LINE1_CLS} text-[#fafaf9]/60`}>{PATIENCE.line1}</p>
        </FadeIn>

        <span
          aria-hidden="true"
          className="h-px w-24 bg-gradient-to-r from-transparent via-[#c25a6d]/70 to-transparent"
        />

        <FadeIn delay={0.3}>
          <p className={`${LINE_CLS} text-[#fafaf9]`}>{PATIENCE.line2}</p>
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
  // The sticky panel releases here; every beat is a fraction of it, so the
  // choreography always lands before the handoff whatever the track height.
  const u = (track - 100) / track;
  const k = (n: number) => n * u;

  // The white room reads top-down: eyebrow, headline, then the quiet line.
  const eyebrowOpacity = useTransform(p, [k(0.02), k(0.08), k(0.3), k(0.36)], [0, 1, 1, 0]);
  const eyebrowY = useTransform(p, [k(0.02), k(0.08)], [14, 0]);

  // The aperture. Everything in the white room is gone by k(0.46) — the iris
  // eats the centre first, so nothing may still be standing there.
  const r = useTransform(p, [k(0.46), k(0.62), k(0.76)], [0, 34, IRIS_MAX_VMAX]);
  const iris = useMotionTemplate`circle(${r}vmax at 50% 50%)`;

  // A wine flare at the moment the aperture breaks open.
  const flareOpacity = useTransform(p, [k(0.44), k(0.48), k(0.54)], [0, 0.9, 0]);
  const flareScale = useTransform(p, [k(0.44), k(0.54)], [0.6, 1.15]);

  // Unclipped, composited. Both wait until the iris has covered the corners,
  // so neither is ever seen against the white room.
  const glowOpacity = useTransform(p, [k(0.68), k(0.8), k(0.92), k(1)], [0, 0.85, 0.85, 0]);
  const glowScale = useTransform(p, [k(0.68), k(0.95)], [0.7, 1.12]);
  const particleOpacity = useTransform(p, [k(0.72), k(0.84), k(0.92), k(1)], [0, 1, 1, 0]);
  const particleY = useTransform(p, [k(0.46), k(1)], [0, -40]);

  if (reduced) return <StaticPatience />;

  return (
    <section
      ref={ref}
      id="patience"
      aria-labelledby="patience-heading"
      // Dark base: what shows through as the sticky child slides away.
      className={`relative w-full bg-[#0c0a09] ${isMobile ? "h-[220vh]" : "h-[260vh]"}`}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* z-5 — the warm-white room. Static fill; the iris does all the work. */}
        <div aria-hidden="true" className="absolute inset-0 z-[5] bg-[#fafaf9]">
          {/* dot-grid carries its own mask, so it lives on a child, never on a
              clipped or masked element — masks don't stack. */}
          <div className="dot-grid pointer-events-none absolute inset-0" />
        </div>

        <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center gap-7 px-6 text-center sm:gap-8 sm:px-10">
          <motion.div style={{ opacity: eyebrowOpacity, y: eyebrowY }}>
            <Eyebrow />
          </motion.div>

          {/* The gradient sits on each word, not the heading — a parent-level
              fill cannot be faded by a child's animated opacity. */}
          <ScrubLine
            as="h2"
            id="patience-heading"
            p={p}
            text={PATIENCE.heading}
            band={[k(0.05), k(0.2)]}
            hold={[k(0.34), k(0.44)]}
            className={HEADING_CLS}
            wordClassName="brand-gradient-text"
          />

          <ScrubLine
            p={p}
            text={PATIENCE.line1}
            band={[k(0.2), k(0.34)]}
            hold={[k(0.36), k(0.46)]}
            className={`${LINE1_CLS} text-foreground/70`}
          />
        </div>

        {/* z-6 — the iris. A flat fill and nothing else: the only thing that
            repaints per frame. Positioned, because clip-path makes a stacking
            context but not a containing block. */}
        <motion.div
          aria-hidden="true"
          style={{ clipPath: iris, WebkitClipPath: iris, willChange: "clip-path" }}
          className="pointer-events-none absolute inset-0 z-[6] bg-[#0c0a09]"
        />

        {/* The flare, riding the aperture edge as it breaks open. Centring comes
            from framer's x/y — a Tailwind -translate-* would be overwritten by
            the inline transform that `scale` generates. */}
        <motion.div
          aria-hidden="true"
          style={{
            opacity: flareOpacity,
            scale: flareScale,
            x: "-50%",
            y: "-50%",
            willChange: "opacity, transform",
          }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-[6] size-[70vw] max-w-[760px] rounded-full bg-[radial-gradient(circle,rgba(194,90,109,0.55),transparent_62%)] blur-2xl"
        />

        {/* z-7 — line 2, clipped to the same aperture, so the iris reveals it. */}
        <motion.div
          style={{ clipPath: iris, WebkitClipPath: iris, willChange: "clip-path" }}
          className="absolute inset-0 z-[7] flex items-center justify-center px-6 text-center sm:px-10"
        >
          <ScrubLine
            p={p}
            text={PATIENCE.line2}
            band={[k(0.58), k(0.8)]}
            hold={[k(0.92), k(1)]}
            className={`${LINE_CLS} text-[#fafaf9]`}
          />
        </motion.div>

        {/* z-8 — unclipped and composited. Only arrives once the room is dark. */}
        <motion.div
          aria-hidden="true"
          style={{
            opacity: glowOpacity,
            scale: glowScale,
            x: "-50%",
            y: "-50%",
            willChange: "opacity, transform",
          }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-[8] size-[90vw] max-w-[1000px] rounded-full bg-[radial-gradient(circle,rgba(165,64,82,0.30),transparent_62%)] blur-3xl"
        />

        <motion.div
          aria-hidden="true"
          style={{ opacity: particleOpacity, y: particleY, willChange: "opacity, transform" }}
          className="pointer-events-none absolute inset-0 z-[8]"
        >
          <ParticleField count={isMobile ? 22 : 40} />
        </motion.div>
      </div>

      {/* The thread lives OUTSIDE the sticky child, as Hero's portal overlays do,
          so position:fixed stays glued to the viewport through the unpin and the
          panel's overflow-hidden cannot clip it. It fills the 100vh strip the
          unpin would otherwise spend on flat dark. */}
      <ThreadConnector p={p} u={u} />
    </section>
  );
}

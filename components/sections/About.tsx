"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ABOUT } from "@/lib/content";
import { SPRING_SCROLL, SPRING_SOFT } from "@/lib/motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import { useIsMobile } from "@/hooks/useIsMobile";
import { FadeIn } from "@/components/motion/FadeIn";
import { cn } from "@/lib/utils";

/**
 * Section 01 — the founding story, told one line at a time while the section is
 * pinned. Each line slides in from the left as a left-to-right clip wipe "types"
 * it (a brand caret rides the reveal edge), holds to be read, then slides out to
 * the right and fades. Only one line is ever visible; scrolling back reverses it.
 * After the final line, two collection teasers slide in from opposite sides and
 * settle. Everything is driven by scroll progress `p`, so it is fully reversible.
 * Opens seamlessly from the Hero's white "D" portal (matching #fafaf9). Degrades
 * to a static stacked column under reduced motion.
 */

const ROMAN = ["I", "II"];

// ── One story line: absolutely stacked & centered; visible only in its window.
interface StoryLineProps {
  p: MotionValue<number>;
  start: number;
  end: number;
  text: string;
  accent?: boolean;
}

function StoryLine({ p, start, end, text, accent }: StoryLineProps) {
  // Local progress across this line's global window (clamped 0→1).
  const q = useTransform(p, [start, end], [0, 1]);

  // Slide in from left → hold centered → snap out right (% of full-width root = vw).
  const x = useTransform(q, [0, 0.11, 0.86, 0.94], ["-64%", "0%", "0%", "64%"]);
  // Zero at both boundaries → guarantees only one block is ever visible. Fast exit.
  const opacity = useTransform(q, [0, 0.07, 0.88, 0.94], [0, 1, 1, 0]);

  // Longer, deliberate type; then a hold to read, then a very fast disappear.
  const f = useTransform(q, [0.07, 0.42], [0, 1]);
  const clipRight = useTransform(f, [0, 1], [100, 0]);
  const clipPath = useMotionTemplate`inset(-6% ${clipRight}% -6% 0%)`;
  const caretLeft = useTransform(f, [0, 1], ["0%", "100%"]);
  const caretOpacity = useTransform(q, [0.05, 0.07, 0.85, 0.87], [0, 1, 1, 0]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ x, opacity }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 sm:px-10"
    >
      <span className="relative inline-block">
        <motion.p
          style={{ clipPath, WebkitClipPath: clipPath, willChange: "clip-path" }}
          className={cn(
            "m-0 max-w-[22ch] text-center text-balance font-serif text-[1.9rem] font-medium leading-[1.15] tracking-tight sm:max-w-[26ch] sm:text-4xl lg:max-w-[32ch] lg:text-5xl lg:leading-[1.1]",
            accent ? "text-brand" : "text-foreground",
          )}
        >
          {text}
        </motion.p>
        <motion.span
          aria-hidden="true"
          style={{ left: caretLeft, opacity: caretOpacity }}
          className="absolute top-0 h-full w-[3px]"
        >
          <span className="block h-full w-full bg-brand [animation:blink_1.05s_steps(1,end)_infinite]" />
        </motion.span>
      </span>
    </motion.div>
  );
}

// ── Persistent, subtle corner heading. Fades in over the Hero→About seam.
function AboutHeading({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0, 0.05], [0, 1]);
  return (
    <motion.div style={{ opacity }} className="absolute top-24 left-6 z-10 sm:top-28 sm:left-10">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs tracking-[0.4em] text-brand">{ABOUT.index}</span>
        <span className="h-px w-12 bg-border" />
        <span className="font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">
          {ABOUT.question}
        </span>
      </div>
      <p className="mt-4 font-serif text-sm uppercase tracking-[0.35em] text-foreground/70">
        {ABOUT.heading}
      </p>
    </motion.div>
  );
}

// ── One finale card: slides in from its side, settles, keeps a hover tilt.
interface FinaleCardProps {
  p: MotionValue<number>;
  P1: number;
  u: number;
  index: number;
  card: { name: string; subtitle: string; from: "left" | "right" };
  interactive: boolean;
}

function FinaleCard({ p, P1, u, index, card, interactive }: FinaleCardProps) {
  const dir = card.from === "left" ? -1 : 1;
  const x = useTransform(p, [P1, 0.97 * u], [`${dir * 70}%`, "0%"]);
  const y = useTransform(p, [P1, 0.97 * u], [24, 0]);
  const opacity = useTransform(p, [P1, 0.94 * u], [0, 1]);

  // Pointer-driven 3D tilt (desktop only) — mirrors Collections' RotatableSculpture.
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const srx = useSpring(rotateX, SPRING_SOFT);
  const sry = useSpring(rotateY, SPRING_SOFT);

  function handleMove(e: React.PointerEvent<HTMLAnchorElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 16);
    rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
  }
  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.a
      href="#collections"
      onPointerMove={interactive ? handleMove : undefined}
      onPointerLeave={interactive ? handleLeave : undefined}
      style={{
        x,
        y,
        opacity,
        rotateX: interactive ? srx : undefined,
        rotateY: interactive ? sry : undefined,
        transformPerspective: 1000,
      }}
      className="group flex flex-col items-center gap-3 rounded-[2rem] border border-border/60 bg-card/40 p-9 text-center backdrop-blur-md transition-colors [transform-style:preserve-3d] hover:border-brand/40 max-md:backdrop-blur-none sm:p-12"
    >
      <span className="font-mono text-xs tracking-[0.4em] text-brand">{ROMAN[index]}</span>
      <span className="font-serif text-4xl tracking-[0.18em] text-foreground sm:text-5xl">
        {card.name}
      </span>
      <span className="text-sm text-muted-foreground">{card.subtitle}</span>
    </motion.a>
  );
}

function FinaleCards({
  p,
  P1,
  u,
  interactive,
}: {
  p: MotionValue<number>;
  P1: number;
  u: number;
  interactive: boolean;
}) {
  // Only clickable once revealed — resolved on the compositor, no React state.
  const pointerEvents = useTransform(p, (v) => (v >= P1 ? "auto" : "none"));
  return (
    <motion.div
      style={{ pointerEvents }}
      className="absolute inset-0 flex items-center justify-center px-6 sm:px-10"
    >
      <div className="grid w-full max-w-4xl gap-6 sm:grid-cols-2">
        {ABOUT.finale.map((card, i) => (
          <FinaleCard key={card.name} p={p} P1={P1} u={u} index={i} card={card} interactive={interactive} />
        ))}
      </div>
    </motion.div>
  );
}

// ── Reduced-motion fallback: no pin, all lines stacked, static cards.
function StaticAbout() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden py-32 sm:py-40"
    >
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 sm:px-10">
        <div className="mb-10 flex items-center gap-4">
          <span className="font-mono text-xs tracking-[0.4em] text-brand">{ABOUT.index}</span>
          <span className="h-px w-12 bg-border" />
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">
            {ABOUT.question}
          </span>
        </div>
        <h2 id="about-heading" className="sr-only">
          {ABOUT.heading}
        </h2>

        <div className="space-y-4">
          {ABOUT.lines.map((line, i) => (
            <FadeIn key={i} delay={i * 0.03}>
              <p
                className={cn(
                  "font-serif text-2xl font-medium leading-[1.3] tracking-tight sm:text-3xl",
                  "accent" in line && line.accent ? "text-brand" : "text-foreground",
                )}
              >
                {line.text}
              </p>
            </FadeIn>
          ))}
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {ABOUT.finale.map((card, i) => (
            <FadeIn key={card.name} delay={i * 0.1}>
              <a
                href="#collections"
                className="group flex flex-col items-center gap-3 rounded-[2rem] border border-border/60 bg-card/40 p-9 text-center transition-colors hover:border-brand/40 sm:p-12"
              >
                <span className="font-mono text-xs tracking-[0.4em] text-brand">{ROMAN[i]}</span>
                <span className="font-serif text-4xl tracking-[0.18em] text-foreground sm:text-5xl">
                  {card.name}
                </span>
                <span className="text-sm text-muted-foreground">{card.subtitle}</span>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About() {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useReducedMotionPref();
  const isMobile = useIsMobile(); // 768 — tilt + track length

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const p = useSpring(scrollYProgress, SPRING_SCROLL);

  // Bands as fractions of the sticky unpin point so they auto-scale to TRACK.
  const track = isMobile ? 560 : 750;
  const u = (track - 100) / track;
  const P0 = 0.06 * u;
  const P1 = 0.9 * u;
  const W = (P1 - P0) / ABOUT.lines.length;

  if (reduced) return <StaticAbout />;

  return (
    <section id="about" ref={ref} aria-labelledby="about-heading" className="relative h-[560vh] md:h-[750vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-[#fafaf9]">
        <h2 id="about-heading" className="sr-only">
          {ABOUT.heading}
        </h2>
        <span className="sr-only">{ABOUT.lines.map((l) => l.text).join(" ")}</span>

        <AboutHeading p={p} />

        {ABOUT.lines.map((line, i) => (
          <StoryLine
            key={i}
            p={p}
            start={P0 + i * W}
            end={P0 + (i + 1) * W}
            text={line.text}
            accent={"accent" in line ? line.accent : undefined}
          />
        ))}

        <FinaleCards p={p} P1={P1} u={u} interactive={!isMobile} />
      </div>
    </section>
  );
}

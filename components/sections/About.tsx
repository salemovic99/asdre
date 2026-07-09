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
import { ABOUT, BRAND } from "@/lib/content";
import { SPRING_SCROLL, SPRING_SOFT } from "@/lib/motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import { useIsMobile } from "@/hooks/useIsMobile";
import { FadeIn } from "@/components/motion/FadeIn";
import { FloatingObject } from "@/components/motion/FloatingObject";
import { ParticleField, MountainSilhouette } from "@/components/visual/Shapes";
import { cn } from "@/lib/utils";

/**
 * Section 01 — a dark, gallery-like camera journey. The Hero flies into the "D"
 * and its white portal flash dissolves to reveal this dark space; the camera then
 * keeps moving FORWARD. Each beat's typography emerges from deep space, flies
 * toward and past the camera (CSS translateZ + depth-of-field blur), and dissolves.
 * A persistent particle starfield + drifting wine light bridge the beats into one
 * continuous forward flight. Ends with a soft light, the ASDRÉ logo, a closing line,
 * and the LÉMAN/RIVIERA collection teasers. Fully scroll-driven and reversible;
 * degrades to a dark static column under reduced motion.
 */

const ROMAN = ["I", "II"];

type Variant = "title" | "wordmark" | "sentence" | "pair" | "listWord" | "word" | "special6";

interface Beat {
  variant: Variant;
  startK: number; // window start as a fraction of the sticky unpin point u
  endK: number;
  text?: string;
  left?: string;
  right?: string;
  accent?: boolean;
  dark?: boolean;
  overlap?: number; // per-beat window widening; defaults to the global OVERLAP
}

// Flat, constant-length beat list (stable hook order). Windows are fractions of u.
const BEATS: Beat[] = [
  { variant: "title", text: "Who are we?", startK: 0.04, endK: 0.115 },
  { variant: "wordmark", text: BRAND.name, startK: 0.115, endK: 0.2 },
  { variant: "sentence", text: "Founded by", startK: 0.2, endK: 0.255 },
  { variant: "pair", left: "Saudi", right: "Egyptian", startK: 0.255, endK: 0.335 },
  { variant: "sentence", text: "They met while studying in Leysin.", startK: 0.335, endK: 0.405 },
  { variant: "special6", text: "Swiss Alps", startK: 0.405, endK: 0.49 },
  { variant: "listWord", text: "Swiss Design", startK: 0.49, endK: 0.526 },
  { variant: "listWord", text: "Timeless Style", startK: 0.526, endK: 0.562 },
  { variant: "listWord", text: "Exceptional Quality", startK: 0.562, endK: 0.598 },
  { variant: "listWord", text: "Quiet Luxury", startK: 0.598, endK: 0.635 },
  { variant: "sentence", text: "We believe true luxury isn’t defined by loud logos.", startK: 0.635, endK: 0.665 },
  { variant: "sentence", text: "It is defined by timeless design.", startK: 0.665, endK: 0.695 },
  { variant: "sentence", text: "Lasting comfort.", startK: 0.695, endK: 0.725 },
  { variant: "sentence", text: "Pieces you’ll wear forever.", startK: 0.725, endK: 0.755 },
  { variant: "sentence", text: "When someone hears ASDRÉ…", dark: true, startK: 0.755, endK: 0.8 },
  // Longer windows + zero overlap → each word fully clears before the next
  // appears (a clean disappear-then-read, not a crossfade of all three).
  { variant: "word", text: "Calm.", accent: true, startK: 0.8, endK: 0.827, overlap: 0 },
  { variant: "word", text: "Refined.", accent: true, startK: 0.827, endK: 0.853, overlap: 0 },
  { variant: "word", text: "Considered.", accent: true, startK: 0.853, endK: 0.88, overlap: 0 },
];

// Editorial type scales — desktop huge; clamp mins keep them from overflowing mobile.
const TITLE_CLS =
  "font-serif font-medium tracking-tight text-balance max-w-[18ch] leading-[1.05] text-[clamp(2rem,7vw,5.5rem)]";
const BIG_CLS =
  "font-serif font-semibold tracking-tight leading-none text-[clamp(2.75rem,11vw,8.5rem)]";
const PAIR_CLS =
  "font-serif font-semibold tracking-tight leading-none text-[clamp(2.5rem,9vw,7rem)] text-[#fafaf9]";
// The brand mark itself — logo face, matching the finale wordmark.
const WORDMARK_CLS =
  "font-logo tracking-normal leading-none text-[clamp(3rem,13vw,9.5rem)] text-brand-soft";

// Per-variant fly-through keyframes (Z in px; scale/opacity/blur curves).
function sceneKeys(variant: Variant) {
  switch (variant) {
    case "word":
    case "listWord":
    case "special6":
      return { z: [-380, 0, 300], s: [0.72, 1.02, 1.6], o: [0, 0.22, 0.68, 0.9], b: [9, 0, 0, 5] };
    case "sentence":
      return { z: [-220, 0, 150], s: [0.86, 1, 1.24], o: [0, 0.16, 0.82, 1], b: [7, 0, 0, 7] };
    case "wordmark":
      return { z: [-160, 0, 120], s: [0.9, 1, 1.18], o: [0, 0.2, 0.8, 1], b: [6, 0, 0, 8] };
    default: // title, pair
      return { z: [-320, 0, 220], s: [0.8, 1, 1.4], o: [0, 0.18, 0.72, 0.92], b: [8, 0, 0, 6] };
  }
}

interface SceneProps {
  p: MotionValue<number>;
  start: number;
  end: number;
  variant: Variant;
  text?: string;
  left?: string;
  right?: string;
  accent?: boolean;
  dark?: boolean;
  isMobile: boolean;
}

function Scene({ p, start, end, variant, text, left, right, accent, dark, isMobile }: SceneProps) {
  const q = useTransform(p, [start, end], [0, 1]); // clamps → only the intended scene shows
  const k = sceneKeys(variant);

  const scale = useTransform(q, [0, 0.55, 1], k.s);
  const opacity = useTransform(q, k.o, [0, 1, 1, 0]);
  const translateZ = useTransform(q, [0, 0.55, 1], k.z);
  const blurPx = useTransform(q, [0, 0.2, 0.75, 1], k.b);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  // pair splay (camera threads between the two words) + wordmark spotlight
  const splay = isMobile ? 40 : 72;
  const leftX = useTransform(q, [0.2, 1], ["-8%", `-${splay}%`]);
  const rightX = useTransform(q, [0.2, 1], ["8%", `${splay}%`]);
  const spotOpacity = useTransform(q, [0, 0.2, 0.8, 1], [0, 0.9, 0.9, 0]);

  // `filter: "none"` on mobile explicitly clears any blur Framer applied on the
  // first (pre-mount, isMobile=false) render — Framer won't reset an omitted value.
  const rootStyle = isMobile
    ? { scale, opacity, filter: "none" }
    : { scale, opacity, translateZ, filter, transformPerspective: 1200, willChange: "transform, opacity, filter" };

  const color = accent ? "text-[#c25a6d]" : dark ? "text-white/80" : "text-[#fafaf9]";

  return (
    <motion.div
      aria-hidden="true"
      style={rootStyle}
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center [transform-style:preserve-3d] sm:px-12"
    >
      {variant === "pair" ? (
        <>
          <motion.div style={{ x: leftX }} className="absolute inset-0 flex items-center justify-center">
            <span className={PAIR_CLS}>{left}</span>
          </motion.div>
          <motion.div style={{ x: rightX }} className="absolute inset-0 flex items-center justify-center">
            <span className={PAIR_CLS}>{right}</span>
          </motion.div>
        </>
      ) : variant === "wordmark" ? (
        <div className="relative flex items-center justify-center">
          <motion.div
            aria-hidden="true"
            style={{ opacity: spotOpacity }}
            className="pointer-events-none absolute left-1/2 top-1/2 size-[70vw] max-w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.22),transparent_62%)] blur-3xl"
          />
          <FloatingObject amplitude={8} bobDuration={9} rotateDuration={0}>
            <span className={WORDMARK_CLS}>{text}</span>
          </FloatingObject>
        </div>
      ) : variant === "special6" ? (
        <div className="relative flex items-center justify-center">
          <div className="pointer-events-none absolute bottom-[-8vh] left-1/2 w-[92vw] max-w-[1100px] -translate-x-1/2 opacity-40 [transform:translateZ(-140px)]">
            <MountainSilhouette />
          </div>
          <span className={cn(BIG_CLS, color)}>{text}</span>
        </div>
      ) : (
        <span className={cn(variant === "title" || variant === "sentence" ? TITLE_CLS : BIG_CLS, color)}>
          {text}
        </span>
      )}
    </motion.div>
  );
}

// ── Environment: a persistent starfield streaming toward the lens (forward flight).
function EnvStarfield({ p, u, isMobile }: { p: MotionValue<number>; u: number; isMobile: boolean }) {
  const farZ = useTransform(p, [0, u], [-200, 900]);
  const farS = useTransform(p, [0, u], [1, 2.2]);
  const farO = useTransform(p, [0, 0.04 * u, 0.9 * u, u], [0, 0.5, 0.5, 0.35]);
  const nearZ = useTransform(p, [0, u], [0, 1500]);
  const nearS = useTransform(p, [0, u], [1.3, 3.6]);
  const nearO = useTransform(p, [0, 0.04 * u, 0.85 * u, u], [0, 0.7, 0.7, 0]);

  const farStyle = isMobile
    ? { scale: farS, opacity: farO }
    : { translateZ: farZ, scale: farS, opacity: farO, transformPerspective: 1200 };
  const nearStyle = isMobile
    ? { scale: nearS, opacity: nearO }
    : { translateZ: nearZ, scale: nearS, opacity: nearO, transformPerspective: 1200 };

  return (
    <div className="pointer-events-none absolute inset-0 [perspective:1200px] [transform-style:preserve-3d]" aria-hidden="true">
      <motion.div className="absolute inset-0" style={farStyle}>
        <ParticleField count={isMobile ? 10 : 22} />
      </motion.div>
      <motion.div className="absolute inset-0" style={nearStyle}>
        <ParticleField count={isMobile ? 8 : 16} />
      </motion.div>
    </div>
  );
}

// ── Environment: two slow-drifting wine glows (volumetric light).
function EnvGlows({ p, u }: { p: MotionValue<number>; u: number }) {
  const ax = useTransform(p, [0, u], ["-6%", "10%"]);
  const ay = useTransform(p, [0, u], ["8%", "-12%"]);
  const bx = useTransform(p, [0, u], ["12%", "-8%"]);
  const by = useTransform(p, [0, u], ["-10%", "14%"]);
  const bo = useTransform(p, [0, 0.4 * u, 0.8 * u, u], [0.5, 0.9, 0.7, 0.25]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        style={{ x: ax, y: ay }}
        className="absolute top-[10%] left-[6%] size-[70vw] max-w-[900px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.22),transparent_62%)] blur-3xl"
      />
      <motion.div
        style={{ x: bx, y: by, opacity: bo }}
        className="absolute right-[4%] bottom-[8%] size-[60vw] max-w-[820px] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.18),transparent_60%)] blur-[120px]"
      />
    </div>
  );
}

// ── Environment: static vignette (depth-of-field + hides scaled-dot edges).
function EnvVignette() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_100%_at_50%_50%,transparent_52%,rgba(0,0,0,0.65)_100%)]"
    />
  );
}

// ── Finale: the "soft light fills the environment" bloom.
function FinaleLight({ p, u }: { p: MotionValue<number>; u: number }) {
  const opacity = useTransform(p, [0.86 * u, 0.93 * u], [0, 1]);
  const scale = useTransform(p, [0.86 * u, 0.96 * u], [0.6, 1.4]);
  return (
    <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
      <motion.div
        style={{ opacity, scale }}
        className="size-[90vw] max-w-[1100px] rounded-full bg-[radial-gradient(circle,rgba(224,225,255,0.9),rgba(99,102,241,0.18)_45%,transparent_72%)] blur-3xl"
      />
    </div>
  );
}

interface FinaleCardProps {
  p: MotionValue<number>;
  u: number;
  index: number;
  card: { name: string; subtitle: string; from: "left" | "right" };
  interactive: boolean;
}

function FinaleCard({ p, u, index, card, interactive }: FinaleCardProps) {
  const dir = card.from === "left" ? -1 : 1;
  const x = useTransform(p, [0.92 * u, 0.97 * u], [`${dir * 70}%`, "0%"]);
  const y = useTransform(p, [0.92 * u, 0.97 * u], [24, 0]);
  const opacity = useTransform(p, [0.9 * u, 0.96 * u], [0, 1]);

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
      className="group flex flex-col items-center gap-3 rounded-[2rem] border border-white/12 bg-white/[0.04] p-9 text-center backdrop-blur-md transition-colors [transform-style:preserve-3d] hover:border-[#a54052]/50 max-md:backdrop-blur-none sm:p-12"
    >
      <span className="font-mono text-xs tracking-[0.4em] text-[#c25a6d]">{ROMAN[index]}</span>
      <span className="font-serif text-4xl tracking-[0.18em] text-[#fafaf9] sm:text-5xl">{card.name}</span>
      <span className="text-sm text-white/55">{card.subtitle}</span>
    </motion.a>
  );
}

// ── Finale: camera stops → logo + closing line + collection cards.
function FinaleReveal({ p, u, isMobile }: { p: MotionValue<number>; u: number; isMobile: boolean }) {
  const logoOpacity = useTransform(p, [0.88 * u, 0.92 * u], [0, 1]);
  const logoY = useTransform(p, [0.88 * u, 0.92 * u], [20, 0]);
  const lineOpacity = useTransform(p, [0.9 * u, 0.94 * u], [0, 1]);
  const pointerEvents = useTransform(p, (v) => (v >= 0.92 * u ? "auto" : "none"));

  return (
    <motion.div
      style={{ pointerEvents }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-12 px-6 text-center sm:px-12"
    >
      <div className="flex flex-col items-center gap-5">
        <motion.div style={{ opacity: logoOpacity, y: logoY }}>
          <FloatingObject amplitude={7} bobDuration={9} rotateDuration={0}>
            <span className="font-logo text-[clamp(3rem,12vw,8rem)] tracking-normal text-brand-soft [text-shadow:0_0_40px_rgba(99,102,241,0.35)]">
              {ABOUT.finale.logo}
            </span>
          </FloatingObject>
        </motion.div>
        <motion.p
          style={{ opacity: lineOpacity }}
          className="max-w-[26ch] font-serif text-[clamp(1rem,2.5vw,1.5rem)] leading-relaxed text-white/70"
        >
          {ABOUT.finale.line}
        </motion.p>
      </div>

      <div className="grid w-full max-w-3xl gap-6 sm:grid-cols-2">
        {ABOUT.finale.cards.map((card, i) => (
          <FinaleCard key={card.name} p={p} u={u} index={i} card={card} interactive={!isMobile} />
        ))}
      </div>
    </motion.div>
  );
}

// Static text list for the reduced-motion fallback (pairs joined).
const STATIC_LINES: { text: string; accent: boolean }[] = [
  ...BEATS.map((b) =>
    b.variant === "pair"
      ? { text: `${b.left} & ${b.right}`, accent: false }
      : { text: b.text ?? "", accent: !!b.accent },
  ),
  { text: ABOUT.finale.line, accent: false },
];

// ── Reduced-motion fallback: no pin, dark stacked column + static cards.
function StaticAbout() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-[#0c0a09] py-32 text-[#fafaf9] sm:py-40"
    >
      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 text-center sm:px-10">
        <div className="mb-12 flex items-center justify-center gap-4">
          <span className="font-mono text-xs tracking-[0.4em] text-[#c25a6d]">{ABOUT.index}</span>
          <span className="h-px w-12 bg-white/20" />
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-white/50">{ABOUT.question}</span>
        </div>
        <h2 id="about-heading" className="sr-only">
          {ABOUT.heading}
        </h2>

        <div className="space-y-6">
          {STATIC_LINES.map((l, i) => (
            <FadeIn key={i} delay={i * 0.02}>
              <p
                className={cn(
                  "font-serif text-2xl font-medium leading-snug tracking-tight sm:text-3xl",
                  l.accent ? "text-[#c25a6d]" : "text-[#fafaf9]",
                )}
              >
                {l.text}
              </p>
            </FadeIn>
          ))}
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {ABOUT.finale.cards.map((card, i) => (
            <FadeIn key={card.name} delay={i * 0.1}>
              <a
                href="#collections"
                className="group flex flex-col items-center gap-3 rounded-[2rem] border border-white/12 bg-white/[0.04] p-9 text-center transition-colors hover:border-[#a54052]/50 sm:p-12"
              >
                <span className="font-mono text-xs tracking-[0.4em] text-[#c25a6d]">{ROMAN[i]}</span>
                <span className="font-serif text-4xl tracking-[0.18em] text-[#fafaf9] sm:text-5xl">{card.name}</span>
                <span className="text-sm text-white/55">{card.subtitle}</span>
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
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, SPRING_SCROLL);

  // Bands are fractions of the sticky unpin point u, so they auto-scale to TRACK.
  const track = isMobile ? 900 : 1200;
  const u = (track - 100) / track;
  const OVERLAP = 0.012; // widen each window → beats overlap slightly → continuous flight

  if (reduced) return <StaticAbout />;

  return (
    <section id="about" ref={ref} aria-labelledby="about-heading" className="relative h-[900vh] md:h-[1200vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-[#0c0a09] text-[#fafaf9]">
        <h2 id="about-heading" className="sr-only">
          {ABOUT.heading}
        </h2>
        <span className="sr-only">{ABOUT.a11yStory}</span>

        <EnvStarfield p={p} u={u} isMobile={isMobile} />
        <EnvGlows p={p} u={u} />
        <EnvVignette />

        {BEATS.map((b, i) => (
          <Scene
            key={i}
            p={p}
            start={b.startK * u - (b.overlap ?? OVERLAP)}
            end={b.endK * u + (b.overlap ?? OVERLAP)}
            variant={b.variant}
            text={b.text}
            left={b.left}
            right={b.right}
            accent={b.accent}
            dark={b.dark}
            isMobile={isMobile}
          />
        ))}

        <FinaleLight p={p} u={u} />
        <FinaleReveal p={p} u={u} isMobile={isMobile} />
      </div>
    </section>
  );
}

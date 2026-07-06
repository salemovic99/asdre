"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { COLLECTIONS, type Collection } from "@/lib/content";
import { SPRING_SCROLL, SPRING_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/Reveal";
import { Sculpture } from "@/components/visual/Shapes";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * Collections — a cinematic horizontal camera pan through two worlds. The
 * section pins; scrolling travels sideways from LÉMAN (cool) to RIVIERA (warm)
 * while the light backdrop shifts cool → warm and the entering world grows into
 * focus. "Two Worlds, One House." made literal. Fully scroll-driven and
 * reversible; degrades to a static stacked layout under reduced motion.
 */

const COOL = "#4f46e5";
const WARM = "#c98a2b";

/** A rotatable sculpture — follows the pointer across the panel (desktop only). */
function RotatableSculpture({ tone }: { tone: "cool" | "warm" }) {
  const { reduced } = useReducedMotionPref();
  const isMobile = useIsMobile();
  const interactive = !reduced && !isMobile;

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const srx = useSpring(rotateX, SPRING_SOFT);
  const sry = useSpring(rotateY, SPRING_SOFT);

  if (!interactive) {
    return <Sculpture tone={tone} className="h-[40vh] max-h-[380px] w-auto" />;
  }

  return (
    <motion.div
      role="img"
      aria-label={`Rotate the ${tone === "cool" ? "LÉMAN" : "RIVIERA"} sculpture`}
      className="cursor-grab [transform-style:preserve-3d] active:cursor-grabbing"
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rotateY.set(px * 40);
        rotateX.set(-py * 26);
      }}
      onPointerLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
    >
      <Sculpture tone={tone} className="h-[40vh] max-h-[380px] w-auto" />
    </motion.div>
  );
}

// ── The cool→warm light backdrop that tracks the pan.
function TintBackground({ p }: { p: MotionValue<number> }) {
  const warmOpacity = useTransform(p, [0.3, 0.6], [0, 1]);
  const coolGlow = useTransform(p, [0.3, 0.55], [0.9, 0]);
  const warmGlow = useTransform(p, [0.35, 0.62], [0, 1]);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#eef1f6,#fafaf9_58%,#ffffff)]" />
      <motion.div
        style={{ opacity: warmOpacity }}
        className="absolute inset-0 bg-[linear-gradient(160deg,#f7ede0,#faf6f0_58%,#fffdfa)]"
      />
      <motion.div
        style={{ opacity: coolGlow }}
        className="absolute top-1/3 -left-[8%] size-[70vw] max-w-[900px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.16),transparent_62%)] blur-3xl"
      />
      <motion.div
        style={{ opacity: warmGlow }}
        className="absolute top-2/3 -right-[8%] size-[70vw] max-w-[900px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,138,43,0.18),transparent_62%)] blur-3xl"
      />
    </div>
  );
}

// ── One full-viewport "world" in the horizontal track.
function WorldPanel({ p, index, collection }: { p: MotionValue<number>; index: number; collection: Collection }) {
  const isCool = collection.tone === "cool";
  const accent = isCool ? COOL : WARM;

  // Camera focus — the entering world grows/sharpens, the leaving one recedes.
  const scale = useTransform(p, [0.3, 0.6], index === 0 ? [1, 0.9] : [0.9, 1]);
  const opacity = useTransform(
    p,
    index === 0 ? [0.42, 0.58] : [0.32, 0.48],
    index === 0 ? [1, 0.5] : [0.5, 1],
  );
  // Parallax on the giant ghost wordmark for editorial depth.
  const ghostX = useTransform(p, [0.3, 0.6], index === 0 ? ["0%", "-12%"] : ["12%", "0%"]);

  return (
    <div className="relative flex h-full w-screen shrink-0 items-center justify-center px-6 sm:px-16">
      <motion.span
        aria-hidden="true"
        style={{ x: ghostX, color: isCool ? "rgba(79,70,229,0.06)" : "rgba(201,138,43,0.09)" }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-serif text-[26vw] font-medium leading-none tracking-tighter select-none"
      >
        {collection.name}
      </motion.span>

      <motion.div
        style={{ scale, opacity }}
        className="relative z-10 flex max-w-2xl flex-col items-center gap-8 text-center"
      >
        <div className="flex min-h-[40vh] items-center justify-center">
          <RotatableSculpture tone={collection.tone} />
        </div>

        <div className="flex flex-col items-center">
          <span className="font-mono text-xs tracking-[0.4em]" style={{ color: accent }}>
            {collection.index}
          </span>
          <Reveal
            as="h3"
            text={collection.name}
            className="mt-3 font-serif text-[clamp(3rem,10vw,7rem)] font-medium leading-none tracking-[0.14em] text-foreground"
          />
          <p className="mt-5 max-w-md text-balance text-base font-medium text-secondary-foreground">
            {collection.tagline}
          </p>
          <p className="mt-3 max-w-lg text-balance text-sm leading-relaxed text-muted-foreground">
            {collection.description}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {collection.notes.map((note) => (
              <Badge
                key={note}
                variant="outline"
                className="rounded-full border-border/70 bg-background/50 px-3 py-1 font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-muted-foreground"
              >
                {note}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── The "Two Worlds, One House." title card, fading out as the pan begins.
function IntroTitle({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0, 0.05, 0.24, 0.3], [0, 1, 1, 0]);
  const y = useTransform(p, [0, 0.3], [0, -20]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none absolute inset-x-0 top-[14%] z-20 flex flex-col items-center px-6 text-center"
    >
      <span className="font-mono text-xs uppercase tracking-[0.5em] text-brand">Two Worlds</span>
      <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-foreground sm:text-5xl">
        Two Worlds, One House.
      </h2>
    </motion.div>
  );
}

// ── Bottom progress rail — which world you're travelling through.
function WorldProgress({ p }: { p: MotionValue<number> }) {
  const fill = useTransform(p, [0.3, 0.6], [0, 1]);
  const leftOpacity = useTransform(p, [0.42, 0.52], [1, 0.4]);
  const rightOpacity = useTransform(p, [0.48, 0.58], [0.4, 1]);
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex items-center justify-center gap-4 px-6 font-mono text-[10px] uppercase tracking-[0.35em] sm:gap-5">
      <motion.span style={{ opacity: leftOpacity }} className="text-foreground">
        I · LÉMAN
      </motion.span>
      <span className="relative h-px w-20 overflow-hidden bg-border sm:w-40">
        <motion.span style={{ scaleX: fill }} className="absolute inset-0 origin-left bg-brand" />
      </span>
      <motion.span style={{ opacity: rightOpacity }} className="text-foreground">
        RIVIERA · II
      </motion.span>
    </div>
  );
}

// ── Reduced-motion fallback: a static, light, stacked two-world layout.
function StaticCollections() {
  return (
    <section
      id="collections"
      aria-labelledby="collections-heading"
      className="relative w-full py-32 sm:py-40"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <div className="mb-16 flex flex-col items-center text-center">
          <span className="mb-6 font-mono text-xs uppercase tracking-[0.5em] text-brand">
            05 — Collections
          </span>
          <h2
            id="collections-heading"
            className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-6xl"
          >
            Two Worlds, One House.
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {COLLECTIONS.map((c) => (
            <div
              key={c.name}
              className={cn(
                "flex flex-col items-center gap-8 rounded-[2rem] border border-border/60 p-9 text-center sm:p-12",
                c.tone === "cool"
                  ? "bg-[linear-gradient(160deg,rgba(238,241,246,0.9),rgba(255,255,255,0.6))]"
                  : "bg-[linear-gradient(160deg,rgba(247,237,224,0.9),rgba(255,255,255,0.6))]",
              )}
            >
              <div className="flex min-h-[34vh] items-center justify-center">
                <Sculpture tone={c.tone} className="h-[34vh] max-h-[300px] w-auto" />
              </div>
              <div className="flex flex-col items-center">
                <span
                  className="font-mono text-xs tracking-[0.4em]"
                  style={{ color: c.tone === "cool" ? COOL : WARM }}
                >
                  {c.index}
                </span>
                <h3 className="mt-3 font-serif text-4xl tracking-[0.18em] text-foreground sm:text-5xl">
                  {c.name}
                </h3>
                <p className="mt-4 max-w-xs text-sm font-medium text-secondary-foreground">
                  {c.tagline}
                </p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {c.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Collections() {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useReducedMotionPref();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, SPRING_SCROLL);

  // Track pans one viewport left (2 worlds × 100vw = 200vw track → -50%).
  const x = useTransform(p, [0.3, 0.6], ["0%", "-50%"]);

  if (reduced) return <StaticCollections />;

  return (
    <section
      id="collections"
      ref={ref}
      aria-labelledby="collections-heading"
      className="relative h-[300vh] md:h-[360vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#fafaf9]">
        <TintBackground p={p} />
        <h2 id="collections-heading" className="sr-only">
          Collections
        </h2>

        <motion.div style={{ x }} className="flex h-full w-[200vw]">
          {COLLECTIONS.map((c, i) => (
            <WorldPanel key={c.name} p={p} index={i} collection={c} />
          ))}
        </motion.div>

        <IntroTitle p={p} />

        <div className="pointer-events-none absolute top-24 left-6 z-20 sm:top-28 sm:left-10">
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-brand">
            05 — Collections
          </span>
        </div>

        <WorldProgress p={p} />
      </div>
    </section>
  );
}

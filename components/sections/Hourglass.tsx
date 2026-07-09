"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { HOURGLASS } from "@/lib/content";
import { SPRING_SCROLL } from "@/lib/motion";
import { HourglassGlass, ParticleField } from "@/components/visual/Shapes";
import { Odometer, StaticOdometer, COUNTDOWN_SECONDS } from "@/components/visual/Odometer";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * The Hourglass — the bridge out of the hero dive.
 *
 * It approaches, turns once, freezes as the countdown lands on 00:00:00, flips,
 * and spills. The camera then flies into the falling sand, which dissolves into
 * fog that resolves to the warm white Patience opens on.
 *
 * Four things hold the illusion together:
 *
 * 1. An hourglass is a body of revolution, so spinning it about its axis would
 *    not change its silhouette. The glass therefore never rotates. The 3D read
 *    is carried entirely by the three posts orbiting it and the tilted caps.
 *
 * 2. CSS 3D does not z-buffer — it sorts by element centroid, and a thin post
 *    sweeping through the flat glass plane would tear. So the posts are drawn
 *    twice, on a ring behind the glass and a ring in front of it, and each copy
 *    fades in over the hemisphere it belongs to. Occlusion becomes an opacity
 *    decision, and everything stays composited.
 *
 * 3. The flip is rotateZ. rotateX would pass edge-on at 90°, where a flat SVG
 *    glass collapses to a line and disappears. Because rotateZ(180) maps local
 *    +y to screen −y, the sand must fall along local −y to fall *down* on screen.
 *
 * 4. The room's colour is never animated, and neither clip-path nor mask ever
 *    moves. The closing fog is the opacity of a solid #fafaf9 panel, so the strip
 *    revealed at the unpin already matches Patience's opening room.
 */

// Constant lengths: hook order must not depend on isMobile or reduced.
const POSTS = [0, 1, 2];
const GRAINS = [0, 1, 2, 3, 4, 5, 6, 7];

/** Rig box, in px. The dolly scale sizes it; these are just its proportions. */
const RIG_W = 240;
const RIG_H = 360;
/** Post ring radius — just outside the widest point of the bulbs. */
const RING_R = 94;
/** How far a grain travels from the neck into the receiving bulb. */
const FALL = RIG_H * 0.36;

const SAND_CLS = "h-full w-full bg-[linear-gradient(180deg,#c25a6d_0%,#a54052_100%)]";

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const rad = (deg: number) => (deg * Math.PI) / 180;

// ── One post of the frame. The ring positions it; this billboards it back to
// face the camera, so it never collapses to a line edge-on at θ=90°.
function Post({
  spin,
  index,
  side,
}: {
  spin: MotionValue<number>;
  index: number;
  side: "back" | "front";
}) {
  const offset = index * 120;
  // Counter-rotate out of the ring's spin so the post always faces us.
  const face = useTransform(spin, (v) => -(v + offset));
  // cos θ > 0 means this post is on the camera side of the glass plane.
  const opacity = useTransform(spin, (v) => {
    const c = Math.cos(rad(v + offset));
    return clamp01(((side === "front" ? c : -c) + 0.12) / 0.24);
  });

  return (
    <div
      // Static transform. framer composes translate BEFORE rotate, so a motion
      // `z` + `rotateY` here would collapse all three posts onto the axis.
      style={{
        transform: `rotateY(${offset}deg) translateZ(${RING_R}px)`,
        transformStyle: "preserve-3d",
      }}
      className="absolute left-1/2 top-0 h-full"
    >
      {/* Centring is a margin, not a translate — framer owns this transform. */}
      <motion.div
        aria-hidden="true"
        style={{ rotateY: face, opacity, willChange: "transform, opacity" }}
        className="-ml-[3.5px] h-full w-[7px] rounded-full bg-[linear-gradient(90deg,#8d3646_0%,#c25a6d_38%,#a54052_62%,#6d2b37_100%)] shadow-[0_10px_24px_-12px_rgba(28,25,23,0.45)]"
      />
    </div>
  );
}

// ── A grain in the stream. Falls along local −y, which the flip turns into
// screen-down. Loops as the drain progresses.
function Grain({ d, index }: { d: MotionValue<number>; index: number }) {
  const phase = index / GRAINS.length;
  const t = useTransform(d, (v) => (v * 3 + phase) % 1);
  const y = useTransform(t, [0, 1], [0, -FALL]);
  const opacity = useTransform([d, t], (latest: number[]) => clamp01(latest[0] * 8) * (1 - latest[1]) * 0.9);

  return (
    <motion.span
      aria-hidden="true"
      style={{ y, x: ((index % 3) - 1) * 2.4, willChange: "transform, opacity", opacity }}
      className="absolute left-1/2 top-1/2 -ml-[1.5px] size-[3px] rounded-full bg-[#a54052]"
    />
  );
}

// ── Reduced motion: the hourglass at rest, the countdown spent.
function StaticHourglass() {
  return (
    <section
      id="hourglass"
      aria-labelledby="hourglass-heading"
      className="relative flex min-h-screen w-full flex-col items-center justify-center gap-14 overflow-hidden bg-[#fafaf9] px-6 py-32"
    >
      <h2 id="hourglass-heading" className="sr-only">
        {HOURGLASS.heading}
      </h2>

      <span className="font-mono text-xs uppercase tracking-[0.5em] text-brand">
        {HOURGLASS.eyebrow}
      </span>

      <div className="relative" style={{ width: RIG_W * 0.8, height: RIG_H * 0.8 }}>
        <HourglassGlass />
      </div>

      <p className="sr-only">{HOURGLASS.countdownLabel}</p>
      <StaticOdometer />
    </section>
  );
}

export function Hourglass() {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useReducedMotionPref();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, SPRING_SCROLL);

  const track = isMobile ? 320 : 420;
  const u = (track - 100) / track;
  const k = (n: number) => n * u;
  const base = isMobile ? 0.72 : 1;

  // Arrival → dolly-in → hold → zoom inside. One scale, one timeline. The rig's
  // centre is the neck, so the zoom flies into the stream.
  const scale = useTransform(
    p,
    [0, k(0.06), k(0.28), k(0.86), k(0.96)],
    [0.72 * base, 0.8 * base, base, base, base * 7],
  );
  const rigOpacity = useTransform(p, [0, k(0.06), k(0.88), k(0.96)], [0, 1, 1, 0]);

  // One slow turn. The glass does not move; the posts do.
  const spin = useTransform(p, [k(0.04), k(0.28), k(0.62)], [0, 30, 390]);
  // The specular slides across the glass as the frame turns.
  const specX = useTransform(spin, (v) => Math.sin(rad(v)) * 34);
  const specOpacity = useTransform(spin, (v) => 0.25 + 0.4 * clamp01(Math.cos(rad(v))));

  const flip = useTransform(p, [k(0.66), k(0.76)], [0, 180]);

  // Sand. Both blocks share transform-origin: top, so after the flip the upper
  // one collapses onto the neck and the lower one grows from its base.
  const drain = useTransform(p, [k(0.74), k(0.88)], [0, 1]);
  const localBottomScale = useTransform(drain, [0, 1], [1, 0]);
  const localTopScale = useTransform(drain, [0, 1], [0, 1]);
  const streamOpacity = useTransform(p, [k(0.74), k(0.78), k(0.86), k(0.9)], [0, 1, 1, 0]);

  const seconds = useTransform(p, [k(0.12), k(0.66)], [COUNTDOWN_SECONDS, 0]);
  const eyebrowOpacity = useTransform(p, [k(0.02), k(0.08), k(0.6), k(0.66)], [0, 1, 1, 0]);
  const clockOpacity = useTransform(p, [k(0.08), k(0.14), k(0.68), k(0.74)], [0, 1, 1, 0]);

  // The room warms as the sand starts to run.
  const warmOpacity = useTransform(p, [k(0.66), k(0.78), k(0.92)], [0, 0.85, 0]);
  const moteOpacity = useTransform(p, [k(0.84), k(0.9), k(0.95)], [0, 1, 0]);
  const moteScale = useTransform(p, [k(0.84), k(0.96)], [1, 3.5]);
  // The fog: a solid panel, landing before the unpin so the seam is white-on-white.
  const fogOpacity = useTransform(p, [k(0.88), k(0.95)], [0, 1]);

  if (reduced) return <StaticHourglass />;

  return (
    <section
      ref={ref}
      id="hourglass"
      aria-labelledby="hourglass-heading"
      className={`relative w-full bg-[#fafaf9] ${isMobile ? "h-[320vh]" : "h-[420vh]"}`}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <h2 id="hourglass-heading" className="sr-only">
          {HOURGLASS.heading}
        </h2>
        <p className="sr-only">{HOURGLASS.countdownLabel}</p>

        <div className="relative z-[1] flex h-full w-full flex-col items-center justify-center gap-12 px-6">
          <motion.span
            style={{ opacity: eyebrowOpacity }}
            className="font-mono text-xs uppercase tracking-[0.5em] text-brand"
          >
            {HOURGLASS.eyebrow}
          </motion.span>

          {/* ── the rig: dolly, flip, and the final zoom all live here ── */}
          <motion.div
            style={{ scale, rotateZ: flip, opacity: rigOpacity, willChange: "transform, opacity" }}
            className="relative [perspective:1000px] [transform-style:preserve-3d]"
          >
            <div
              style={{
                width: RIG_W,
                height: RIG_H,
                transform: "rotateX(14deg)",
                transformStyle: "preserve-3d",
              }}
              className="relative"
            >
              {/* back ring (z-0) → sand (z-1) → glass (z-2) → front ring (z-3) */}
              <motion.div
                aria-hidden="true"
                style={{ rotateY: spin }}
                className="absolute inset-0 z-0 [transform-style:preserve-3d]"
              >
                {POSTS.map((i) => (
                  <Post key={`b${i}`} spin={spin} index={i} side="back" />
                ))}
              </motion.div>

              {/* Caps: discs lying flat. The rig's 14° tilt turns them into
                  ellipses. translateX(-50%) rides in the same transform, since
                  an inline transform would overwrite a Tailwind translate. */}
              {[0, 1].map((i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  style={{
                    transform: "translateX(-50%) rotateX(90deg)",
                    transformStyle: "preserve-3d",
                  }}
                  className={`absolute left-1/2 z-0 size-[196px] rounded-[50%] bg-[radial-gradient(circle,#e7e2df_0%,#cfc7c2_70%,#b9afa9_100%)] shadow-[0_10px_28px_-14px_rgba(28,25,23,0.5)] ${
                    i === 0 ? "top-[2px]" : "bottom-[2px]"
                  }`}
                />
              ))}

              {/* Sand. Static clips; only scaleY animates. */}
              <div aria-hidden="true" className="absolute inset-0 z-[1]">
                <div className="absolute left-[17%] top-[8.7%] h-[41.3%] w-[66%] [clip-path:polygon(0%_0%,100%_0%,56%_100%,44%_100%)]">
                  <motion.div
                    style={{ scaleY: localTopScale, transformOrigin: "top", willChange: "transform" }}
                    className={SAND_CLS}
                  />
                </div>
                <div className="absolute bottom-[8.7%] left-[17%] h-[40%] w-[66%] [clip-path:polygon(44%_0%,56%_0%,100%_100%,0%_100%)]">
                  <motion.div
                    style={{ scaleY: localBottomScale, transformOrigin: "top", willChange: "transform" }}
                    className={SAND_CLS}
                  />
                </div>

                {/* The stream runs from the neck along local −y, into the bulb
                    that the flip has just put at the bottom of the screen. */}
                <motion.div
                  style={{ opacity: streamOpacity }}
                  className="absolute bottom-1/2 left-1/2 -ml-px h-[36%] w-[2px] bg-[linear-gradient(0deg,#a54052_0%,rgba(165,64,82,0.12)_100%)]"
                />
                <motion.div style={{ opacity: streamOpacity }} className="absolute inset-0">
                  {GRAINS.map((i) => (
                    <Grain key={i} d={drain} index={i} />
                  ))}
                </motion.div>
              </div>

              <HourglassGlass className="relative z-[2]" />

              {/* The one pure white in the scene. The static centring lives on a
                  wrapper so framer's x is free to slide it. */}
              <div className="pointer-events-none absolute left-1/2 top-[12%] z-[3] h-[30%] -translate-x-1/2">
                <motion.div
                  aria-hidden="true"
                  style={{ x: specX, opacity: specOpacity, willChange: "transform, opacity" }}
                  className="h-full w-[10px] rounded-full bg-white blur-[6px]"
                />
              </div>

              <motion.div
                aria-hidden="true"
                style={{ rotateY: spin }}
                className="absolute inset-0 z-[3] [transform-style:preserve-3d]"
              >
                {POSTS.map((i) => (
                  <Post key={`f${i}`} spin={spin} index={i} side="front" />
                ))}
              </motion.div>
            </div>
          </motion.div>

          <motion.div style={{ opacity: clockOpacity }}>
            <Odometer s={seconds} />
          </motion.div>
        </div>

        {/* ── layers above the rig, inside the same pinned panel ── */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: warmOpacity }}
          className="pointer-events-none absolute inset-0 z-[4] bg-[radial-gradient(circle_at_50%_46%,rgba(201,138,43,0.22),transparent_58%)]"
        />
        <motion.div
          aria-hidden="true"
          style={{ opacity: moteOpacity, scale: moteScale, willChange: "transform, opacity" }}
          className="pointer-events-none absolute inset-0 z-[5]"
        >
          <ParticleField count={isMobile ? 24 : 44} tone="warm" />
        </motion.div>
        <motion.div
          aria-hidden="true"
          style={{ opacity: fogOpacity, willChange: "opacity" }}
          className="pointer-events-none absolute inset-0 z-[6] bg-[#fafaf9]"
        />
      </div>
    </section>
  );
}

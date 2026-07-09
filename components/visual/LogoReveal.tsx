"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { BRAND } from "@/lib/content";
import { EASE_IN_OUT } from "@/lib/motion";

/**
 * The wordmark as the hero centerpiece. Two jobs, cleanly separated per letter:
 *
 *  1. MOUNT REVEAL (inner span) — each letter begins showing its reversed back
 *     face (rotateY 180°) and flips forward, with a brightness/glow keyframe.
 *     Plays once on mount, then rests. Unchanged.
 *
 *  2. SCROLL PORTAL (outer span) — when `flyProgress` is supplied, the camera
 *     flies into the letter "D": the D scales up into its own white counter (a
 *     portal into the next section) while the other letters fade and streak past
 *     the lens. Scroll-synchronized and reversible. The two concerns live on
 *     separate DOM nodes so the mount `animate` transform never fights the
 *     scroll `style` transform.
 */

// Per-letter mount-flip timing.
const FIRST_DELAY = 0.5;
const STAGGER = 0.14;
const FLIP_DURATION = 1.0;

// Mount lighting keyframes, aligned to FILTER_TIMES.
const BACK_LIT = "brightness(0.45) drop-shadow(0 0 0 rgba(79,70,229,0))";
const EDGE_LIT = "brightness(1.18) drop-shadow(0 0 22px rgba(79,70,229,0.45))";
const REST_LIT = "brightness(1) drop-shadow(0 10px 26px rgba(28,25,23,0.18))";
const FILTER_TIMES = [0, 0.55, 1];

// `Array.from` keeps the accented é (a single code point) intact → A s d r é.
const LETTERS = Array.from(BRAND.name);
// The portal letter. Matched case-insensitively so the wordmark's casing can
// change without silently returning -1 and disabling the portal.
const D_INDEX = LETTERS.findIndex((c) => c.toLowerCase() === "d");
// Outward drift for the non-D letters as they streak past the camera.
const SIBLING_X = [-140, -70, 0, 70, 140];

interface FlyLetterProps {
  char: string;
  index: number;
  reduced: boolean;
  isMobile: boolean;
  fp: MotionValue<number>;
}

function FlyLetter({ char, index, reduced, isMobile, fp }: FlyLetterProps) {
  const isD = index === D_INDEX;

  // --- D: accelerating zoom into its counter. Scale is capped (GPU texture
  // limits) — the whiteout in Hero finishes the zoom before the cap shows.
  const dScale = useTransform(
    fp,
    [0.08, 0.3, 0.45, 0.55, 0.62],
    isMobile ? [1, 3, 8, 16, 20] : [1, 3, 9, 18, 24],
  );
  const dZ = useTransform(fp, [0.08, 0.62], [0, isMobile ? 0 : 120]);

  // --- Siblings: fade + drift outward + (desktop) depth whoosh + motion blur.
  const targetX = SIBLING_X[index] ?? 0;
  const sibOpacity = useTransform(fp, [0.08, 0.3], [1, 0]);
  const sibX = useTransform(fp, [0.08, 0.34], [0, isMobile ? targetX / 2 : targetX]);
  const sibZ = useTransform(fp, [0.08, 0.34], [0, isMobile ? 0 : 340]);
  const sibBlurPx = useTransform(fp, [0.08, 0.3], [0, isMobile ? 0 : 8]);
  const sibBlur = useMotionTemplate`blur(${sibBlurPx}px)`;

  const outerStyle = reduced
    ? undefined
    : isD
      ? {
          scale: dScale,
          translateZ: dZ,
          transformPerspective: isMobile ? undefined : 1200,
          transformOrigin: "52% 50%",
          willChange: "transform",
        }
      : {
          opacity: sibOpacity,
          x: sibX,
          translateZ: sibZ,
          filter: sibBlur,
          transformPerspective: isMobile ? undefined : 1200,
          willChange: "transform, opacity, filter",
        };

  return (
    <motion.span
      className="inline-block [transform-style:preserve-3d]"
      style={outerStyle}
    >
      <motion.span
        className="inline-block [backface-visibility:visible] [transform-style:preserve-3d]"
        style={{ transformPerspective: 1000 }}
        initial={reduced ? undefined : { rotateY: 180, filter: BACK_LIT }}
        animate={reduced ? undefined : { rotateY: 0, filter: [BACK_LIT, EDGE_LIT, REST_LIT] }}
        transition={{
          rotateY: {
            duration: FLIP_DURATION,
            delay: FIRST_DELAY + index * STAGGER,
            ease: EASE_IN_OUT,
          },
          filter: {
            duration: FLIP_DURATION,
            delay: FIRST_DELAY + index * STAGGER,
            ease: EASE_IN_OUT,
            times: FILTER_TIMES,
          },
        }}
      >
        {char}
      </motion.span>
    </motion.span>
  );
}

interface LogoRevealProps {
  reduced?: boolean;
  isMobile?: boolean;
  /** Hero's smoothed scroll progress; omit to disable the scroll portal. */
  flyProgress?: MotionValue<number>;
}

export function LogoReveal({ reduced = false, isMobile = false, flyProgress }: LogoRevealProps) {
  // A stable fallback keeps every child's hooks unconditional when no portal.
  const zero = useMotionValue(0);
  const fp = flyProgress ?? zero;

  return (
    <h1 className="font-logo text-[clamp(3rem,13vw,11rem)] font-medium leading-[0.95] tracking-normal text-primary">
      {/* Read as one word by assistive tech; the flipping glyphs are decorative. */}
      <span className="sr-only">{BRAND.name}</span>

      <span aria-hidden="true" className="inline-flex gap-[0.14em] [transform-style:preserve-3d]">
        {LETTERS.map((char, i) => (
          <FlyLetter
            key={`${char}-${i}`}
            char={char}
            index={i}
            reduced={reduced}
            isMobile={isMobile}
            fp={fp}
          />
        ))}
      </span>
    </h1>
  );
}

"use client";

import { motion } from "framer-motion";
import { BRAND } from "@/lib/content";
import { EASE_IN_OUT } from "@/lib/motion";

/**
 * The wordmark as the hero centerpiece. Each letter begins showing its
 * reversed back face (rotateY 180°) and flips forward to reveal its front,
 * one after another. The reversal is the glyph's own backface — no dual-face
 * card needed — so it literally reads as "looking at the back of the letter."
 *
 * A brightness + drop-shadow keyframe supplies the subtle lighting: the letter
 * is dim on its back, catches an indigo highlight as it turns edge-on (~90°),
 * then settles to a grounded soft shadow. Plays once on mount, then rests.
 */

// Per-letter flip timing.
const FIRST_DELAY = 0.5; // let the kicker breathe first
const STAGGER = 0.14; // sequential, elegant — not a rapid cascade
const FLIP_DURATION = 1.0;

// Lighting keyframes, aligned to FILTER_TIMES below.
const BACK_LIT = "brightness(0.45) drop-shadow(0 0 0 rgba(79,70,229,0))";
const EDGE_LIT = "brightness(1.18) drop-shadow(0 0 22px rgba(79,70,229,0.45))";
const REST_LIT = "brightness(1) drop-shadow(0 10px 26px rgba(28,25,23,0.18))";
const FILTER_TIMES = [0, 0.55, 1];

// `Array.from` keeps the accented É (a single code point) intact.
const LETTERS = Array.from(BRAND.name);

export function LogoReveal({ reduced = false }: { reduced?: boolean }) {
  return (
    <h1 className="font-serif text-6xl font-medium leading-none tracking-[0.12em] text-foreground sm:text-8xl lg:text-9xl">
      {/* Read as one word by assistive tech; the flipping glyphs are decorative. */}
      <span className="sr-only">{BRAND.name}</span>

      <span aria-hidden="true" className="inline-flex [transform-style:preserve-3d]">
        {LETTERS.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            className="inline-block [backface-visibility:visible] [transform-style:preserve-3d]"
            style={{ transformPerspective: 1000 }}
            initial={reduced ? undefined : { rotateY: 180, filter: BACK_LIT }}
            animate={reduced ? undefined : { rotateY: 0, filter: [BACK_LIT, EDGE_LIT, REST_LIT] }}
            transition={{
              rotateY: {
                duration: FLIP_DURATION,
                delay: FIRST_DELAY + i * STAGGER,
                ease: EASE_IN_OUT,
              },
              filter: {
                duration: FLIP_DURATION,
                delay: FIRST_DELAY + i * STAGGER,
                ease: EASE_IN_OUT,
                times: FILTER_TIMES,
              },
            }}
          >
            {char}
          </motion.span>
        ))}
      </span>
    </h1>
  );
}

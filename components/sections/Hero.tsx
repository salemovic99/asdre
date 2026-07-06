"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { BRAND } from "@/lib/content";
import { EASE_LUX, SPRING_SCROLL } from "@/lib/motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { ScrollMouse } from "@/components/visual/ScrollMouse";
import { LogoReveal } from "@/components/visual/LogoReveal";
import { Button } from "@/components/ui/button";

/**
 * The overture. No hard object anymore — just the wordmark floating in light,
 * with a soft indigo aura that follows the pointer. Type reveals line-by-line
 * (an editorial clip-up), and as the user scrolls the camera eases forward
 * (subtle scale + blur + fade), handing off to the first chapter.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useReducedMotionPref();
  const { x: mx, y: my } = useMouseParallax();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const p = useSpring(scrollYProgress, SPRING_SCROLL);

  // Dive-in: content eases forward and dissolves.
  const contentScale = useTransform(p, [0, 0.6], [1, 1.12]);
  const opacity = useTransform(p, [0, 0.5], [1, 0]);
  const blurPx = useTransform(p, [0, 0.55], [0, 14]);
  const blur = useMotionTemplate`blur(${blurPx}px)`;
  const cueOpacity = useTransform(p, [0, 0.12], [1, 0]);

  // Pointer-reactive aura (replaces the old orb) — drifts, never a hard shape.
  const auraX = useTransform(mx, [-0.5, 0.5], ["-8%", "8%"]);
  const auraY = useTransform(my, [-0.5, 0.5], ["-6%", "6%"]);
  const auraScale = useSpring(useTransform(p, [0, 0.6], [1, 1.4]), SPRING_SCROLL);

  const words = BRAND.heroHeadline.split(" ");
  // The supporting line begins as the wordmark's last letter finishes flipping.
  const HEADLINE_DELAY = 1.5;

  return (
    <section id="hero" ref={ref} className="relative h-[150vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* soft indigo aura — the modern focal light, tracks the pointer */}
        <motion.div
          aria-hidden="true"
          style={
            reduced
              ? { opacity: 0.5 }
              : { x: auraX, y: auraY, scale: auraScale, opacity }
          }
          className="pointer-events-none absolute top-[42%] left-1/2 size-[70vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.20),rgba(99,102,241,0.06)_45%,transparent_70%)] blur-[60px]"
        />

        {/* soft alpine fog at the base */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,rgba(250,250,249,0.9),transparent)]"
        />

        <motion.div
          style={reduced ? undefined : { scale: contentScale, opacity, filter: blur }}
          className="relative z-10 flex flex-col items-center px-6 text-center"
        >
          {/* kicker with a drawing-in hairline */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: EASE_LUX }}
            className="mb-7 flex items-center gap-3"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.7, ease: EASE_LUX }}
              className="h-px w-8 origin-right bg-brand/50"
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.5em] text-brand">
              {BRAND.tagline}
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.7, ease: EASE_LUX }}
              className="h-px w-8 origin-left bg-brand/50"
            />
          </motion.div>

          {/* the hero — brand wordmark, each letter flips from its back face */}
          <LogoReveal reduced={reduced} />

          {/* supporting headline — editorial clip-up, after the logo settles */}
          <h2 className="mt-8 max-w-[18ch] font-serif text-2xl font-medium leading-tight tracking-tight text-foreground/90 sm:text-3xl lg:text-4xl">
            {words.map((word, i) => (
              <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={reduced ? undefined : { y: "110%" }}
                  animate={reduced ? undefined : { y: "0%" }}
                  transition={{ duration: 0.8, delay: HEADLINE_DELAY + i * 0.07, ease: EASE_LUX }}
                >
                  {word}
                </motion.span>
                {i < words.length - 1 && " "}
              </span>
            ))}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: HEADLINE_DELAY + 0.4, ease: EASE_LUX }}
            className="mt-7 max-w-md text-base text-muted-foreground sm:text-lg"
          >
            {BRAND.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: HEADLINE_DELAY + 0.6, ease: EASE_LUX }}
            className="mt-10"
          >
            <Button
              render={<a href="#about" />}
              className="h-12 rounded-full bg-primary px-8 text-sm font-medium tracking-wide text-primary-foreground transition-all duration-300 hover:bg-primary/85 hover:shadow-[0_16px_40px_-16px_rgba(28,25,23,0.6)]"
            >
              {BRAND.heroCta}
            </Button>
          </motion.div>
        </motion.div>

        {/* modern mouse scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.6, ease: EASE_LUX }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div style={reduced ? undefined : { opacity: cueOpacity }}>
            <ScrollMouse reduced={reduced} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

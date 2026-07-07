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
import { useIsMobile } from "@/hooks/useIsMobile";
import { ScrollMouse } from "@/components/visual/ScrollMouse";
import { LogoReveal } from "@/components/visual/LogoReveal";

/**
 * The overture — the wordmark floating in light with a pointer-tracked indigo
 * aura. On scroll the camera flies INTO the letter "D": the D zooms into its
 * own white counter (a portal) while the other letters and copy streak past,
 * an indigo bloom flares, and a white seam blooms open into the About section.
 * About is the same warm white (#fafaf9), so the handoff is invisible — you
 * travel through the logo into the rest of the site. Fully scroll-driven and
 * reversible; degrades to a plain crossfade under reduced motion.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useReducedMotionPref();
  const isMobile = useIsMobile();
  const { x: mx, y: my } = useMouseParallax();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const p = useSpring(scrollYProgress, SPRING_SCROLL);

  // ── Copy sub-groups (kicker / headline / subtitle / mobile CTA) dissolve as
  //    the dive begins. The logo is deliberately excluded — it runs the portal.
  const textOpacity = useTransform(p, [0.08, 0.28], [1, 0]);
  const textY = useTransform(p, [0.08, 0.32], [0, -24]);
  const textBlurPx = useTransform(p, [0.08, 0.3], [0, 10]);
  const textBlur = useMotionTemplate`blur(${textBlurPx}px)`;
  const cueOpacity = useTransform(p, [0, 0.12], [1, 0]);

  // Pointer-reactive aura → soft light bloom through the aperture.
  const auraX = useTransform(mx, [-0.5, 0.5], ["-8%", "8%"]);
  const auraY = useTransform(my, [-0.5, 0.5], ["-6%", "6%"]);
  const auraOpacity = useTransform(p, [0.08, 0.42], [0.55, 0]);
  const auraScale = useSpring(useTransform(p, [0.08, 0.6], [1, 1.6]), SPRING_SCROLL);

  // Portal overlays: indigo light bloom, then the white seam into About.
  const bloomOpacity = useTransform(p, [0.3, 0.5, 0.62], [0, 0.6, 0]);
  const bloomScale = useTransform(p, [0.3, 0.62], [1, 3.2]);
  const whiteout = useTransform(p, [0.5, 0.6, 0.66, 0.93], [0, 1, 1, 0]);

  // Reduced motion: a plain content crossfade, no pin theatrics.
  const reducedOpacity = useTransform(p, [0, 0.8], [1, 0]);

  const words = BRAND.heroHeadline.split(" ");
  // The supporting line begins as the wordmark's last letter finishes flipping.
  const HEADLINE_DELAY = 1.5;

  // Longer runway on desktop gives the fly-through room; short/none when reduced.
  const trackHeight = reduced ? "h-[100vh]" : isMobile ? "h-[220vh]" : "h-[280vh]";
  // Scroll-driven fade for the copy sub-groups (skipped under reduced motion).
  const textStyle = reduced ? undefined : { opacity: textOpacity, y: textY, filter: textBlur };

  return (
    <section id="hero" ref={ref} className={`relative ${trackHeight}`}>
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* soft indigo aura — focal light + bloom, tracks the pointer */}
        <motion.div
          aria-hidden="true"
          style={
            reduced
              ? { opacity: 0.5 }
              : { x: auraX, y: auraY, scale: auraScale, opacity: auraOpacity }
          }
          className="pointer-events-none absolute top-[42%] left-1/2 size-[70vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.20),rgba(99,102,241,0.06)_45%,transparent_70%)] blur-[60px]"
        />

        {/* soft alpine fog at the base */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,rgba(250,250,249,0.9),transparent)]"
        />

        <motion.div
          style={reduced ? { opacity: reducedOpacity } : undefined}
          className="relative z-10 flex flex-col items-center px-6 text-center"
        >
          {/* kicker — dissolves with the copy as the camera dives */}
          <motion.div style={textStyle}>
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
          </motion.div>

          {/* the hero — brand wordmark; the "D" becomes the scroll portal */}
          <LogoReveal
            reduced={reduced}
            isMobile={isMobile}
            flyProgress={reduced ? undefined : p}
          />

          {/* supporting copy — dissolves as one group; the logo is excluded */}
          <motion.div style={textStyle} className="flex flex-col items-center">
            <h2 className="mt-8 font-serif text-xl font-medium leading-tight tracking-[0.25em] whitespace-nowrap uppercase text-foreground/90 sm:text-2xl md:text-3xl lg:text-4xl">
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
                  {i < words.length - 1 && " "}
                </span>
              ))}
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: HEADLINE_DELAY + 0.4, ease: EASE_LUX }}
              className="mt-8 flex flex-col items-center gap-3.5"
            >
              <span
                aria-hidden="true"
                className="h-px w-12 bg-gradient-to-r from-transparent via-brand/55 to-transparent"
              />
              <p className="max-w-md font-serif text-lg italic leading-relaxed tracking-wide text-foreground/75 sm:text-xl">
                {BRAND.heroSubtitle}
              </p>
            </motion.div>
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

      {/* Portal overlays — rendered OUTSIDE the sticky/transformed layers so
          position:fixed stays glued to the viewport through the sticky unpin.
          The indigo bloom flares as the camera nears the aperture; the white
          seam (#fafaf9) blooms to full over the unpin, then dissolves to reveal
          About rising from pure white. */}
      {!reduced && (
        <>
          <motion.div
            aria-hidden="true"
            style={{ opacity: bloomOpacity, scale: bloomScale, willChange: "opacity, transform" }}
            className="pointer-events-none fixed inset-0 z-[30] mix-blend-screen bg-[radial-gradient(circle_at_50%_48%,rgba(99,102,241,0.55),rgba(99,102,241,0.12)_38%,transparent_62%)]"
          />
          <motion.div
            aria-hidden="true"
            style={{ opacity: whiteout, willChange: "opacity" }}
            className="pointer-events-none fixed inset-0 z-[75] bg-[#fafaf9]"
          />
        </>
      )}
    </section>
  );
}

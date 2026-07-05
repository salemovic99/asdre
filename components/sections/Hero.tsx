"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { BRAND } from "@/lib/content";
import { EASE_LUX, SPRING_SCROLL } from "@/lib/motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { GlassOrb } from "@/components/visual/Shapes";
import { Button } from "@/components/ui/button";

/**
 * The overture. A floating glass orb centered over the brand mark; as the user
 * scrolls the camera flies *into* the orb (scale + blur + fade), handing off to
 * the first chapter. The orb responds subtly to the pointer.
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

  // Dive-in: content scales up and dissolves; orb travels a touch further.
  const contentScale = useTransform(p, [0, 0.6], [1, 1.35]);
  const orbScale = useTransform(p, [0, 0.6], [1, 1.9]);
  const opacity = useTransform(p, [0, 0.5], [1, 0]);
  const blurPx = useTransform(p, [0, 0.55], [0, 18]);
  const blur = useMotionTemplate`blur(${blurPx}px)`;
  const cueOpacity = useTransform(p, [0, 0.12], [1, 0]);

  // Pointer parallax on the orb.
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), SPRING_SCROLL);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), SPRING_SCROLL);
  const driftX = useTransform(mx, [-0.5, 0.5], [-18, 18]);
  const driftY = useTransform(my, [-0.5, 0.5], [-12, 12]);

  return (
    <section id="hero" ref={ref} className="relative h-[150vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* soft alpine fog at the base */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,rgba(250,250,249,0.9),transparent)]"
        />

        <motion.div
          style={reduced ? undefined : { scale: contentScale, opacity, filter: blur }}
          className="relative flex flex-col items-center px-6 text-center"
        >
          {/* Floating orb behind the wordmark */}
          <motion.div
            style={
              reduced
                ? undefined
                : { scale: orbScale, x: driftX, y: driftY, rotateX, rotateY, transformPerspective: 1000 }
            }
            className="pointer-events-none absolute -top-[42%] left-1/2 -translate-x-1/2 [transform-style:preserve-3d]"
          >
            <GlassOrb className="w-[62vw] max-w-[440px] sm:w-[46vw]" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: EASE_LUX }}
            className="relative z-10 mb-6 font-mono text-[11px] uppercase tracking-[0.5em] text-brand"
          >
            {BRAND.tagline}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.65, ease: EASE_LUX }}
            className="relative z-10 max-w-[16ch] font-serif text-5xl font-medium leading-[0.98] tracking-tight text-foreground sm:text-7xl lg:text-8xl"
          >
            {BRAND.heroHeadline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.85, ease: EASE_LUX }}
            className="relative z-10 mt-7 max-w-md text-base text-muted-foreground sm:text-lg"
          >
            {BRAND.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 1.05, ease: EASE_LUX }}
            className="relative z-10 mt-10"
          >
            <Button
              render={<a href="#about" />}
              className="h-12 rounded-full bg-primary px-8 text-sm font-medium tracking-wide text-primary-foreground hover:bg-primary/85"
            >
              {BRAND.heroCta}
            </Button>
          </motion.div>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          style={reduced ? undefined : { opacity: cueOpacity }}
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground"
          aria-hidden="true"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.4em]">Scroll</span>
          <motion.span
            animate={reduced ? undefined : { y: [0, 7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="size-4" />
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}

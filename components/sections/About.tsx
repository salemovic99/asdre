"use client";

import { motion } from "framer-motion";
import { ABOUT } from "@/lib/content";
import { EASE_LUX, VIEWPORT_ONCE } from "@/lib/motion";
import { FadeIn } from "@/components/motion/FadeIn";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";

function ChapterEyebrow({ index, label }: { index: string; label: string }) {
  return (
    <div className="mb-10 flex items-center gap-4">
      <span className="font-mono text-xs tracking-[0.4em] text-brand">{index}</span>
      <span className="h-px w-12 bg-border" />
      <span className="font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

/** Layered alpine silhouettes for parallax depth. */
function Alps() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[46vh]">
      <Parallax speed={0.5} className="absolute inset-x-0 bottom-0">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="h-[46vh] w-full">
          <path d="M0 320 L0 190 L280 70 L520 200 L760 60 L1040 210 L1280 110 L1440 200 L1440 320 Z" fill="#e8ecf0" opacity="0.8" />
        </svg>
      </Parallax>
      <Parallax speed={0.28} className="absolute inset-x-0 bottom-0">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="h-[40vh] w-full">
          <path d="M0 320 L0 240 L240 140 L480 250 L720 130 L1000 250 L1220 170 L1440 250 L1440 320 Z" fill="#d6d3d1" opacity="0.85" />
        </svg>
      </Parallax>
      <Parallax speed={0.12} className="absolute inset-x-0 bottom-0">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="h-[30vh] w-full">
          <path d="M0 320 L0 280 L360 210 L680 285 L980 205 L1260 280 L1440 240 L1440 320 Z" fill="#c4c1bf" opacity="0.7" />
        </svg>
      </Parallax>
    </div>
  );
}

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden py-32 sm:py-40"
    >
      <Alps />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 sm:px-10">
        <FadeIn>
          <ChapterEyebrow index="01" label={ABOUT.question} />
        </FadeIn>

        <h2 id="about-heading" className="sr-only">
          About ASDRÉ
        </h2>

        {/* Cinematic founding story, revealed line by line */}
        <div className="space-y-3 sm:space-y-4">
          {ABOUT.story.map((line, i) => (
            <Reveal
              key={i}
              as="p"
              text={line}
              delay={i * 0.04}
              className="font-serif text-[1.7rem] font-medium leading-[1.25] tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]"
              tokenClassName={i === 1 || i === 2 ? "text-brand" : undefined}
            />
          ))}
        </div>

        <FadeIn delay={0.1} className="mt-16 max-w-2xl">
          <p className="text-lg leading-relaxed text-secondary-foreground/80">{ABOUT.closing}</p>
        </FadeIn>

        <FadeIn delay={0.15} className="mt-8 max-w-2xl">
          <p className="text-base leading-relaxed text-muted-foreground">{ABOUT.feeling}</p>
        </FadeIn>

        {/* Two-collection tease */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.9, ease: EASE_LUX }}
          className="mt-20 grid gap-6 sm:grid-cols-2"
        >
          {[
            { name: "LÉMAN", note: "Refined everyday essentials." },
            { name: "RIVIERA", note: "Elevated, timeless elegance." },
          ].map((c) => (
            <a
              key={c.name}
              href="#collections"
              className="group rounded-3xl border border-border/60 bg-card/40 p-7 backdrop-blur-sm transition-colors hover:border-brand/40"
            >
              <span className="font-serif text-2xl tracking-[0.2em] text-foreground">{c.name}</span>
              <span className="mt-2 block text-sm text-muted-foreground">{c.note}</span>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

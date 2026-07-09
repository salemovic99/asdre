"use client";

import { VISION } from "@/lib/content";
import { SectionShell } from "@/components/layout/SectionShell";
import { Reveal } from "@/components/motion/Reveal";
import { FadeIn } from "@/components/motion/FadeIn";

export function Vision() {
  return (
    <SectionShell
      id="vision"
      labelledBy="vision-heading"
      trackVh={200}
      scaleRange={[0.9, 1, 1.18]}
      blurRange={[8, 0, 0, 12]}
      depth={200}
    >
      <div className="flex w-full max-w-4xl flex-col items-center text-center">
        <FadeIn className="mb-10">
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-brand">
            02 — {VISION.eyebrow}
          </span>
        </FadeIn>

        <Reveal
          as="h2"
          text={VISION.statement}
          stagger={0.05}
          className="font-serif text-3xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
          tokenClassName="brand-gradient-text"
        />
        <span id="vision-heading" className="sr-only">
          Vision
        </span>
      </div>
    </SectionShell>
  );
}

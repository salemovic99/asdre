"use client";

import { VALUES } from "@/lib/content";
import { SectionShell } from "@/components/layout/SectionShell";
import { Reveal } from "@/components/motion/Reveal";
import { FadeIn } from "@/components/motion/FadeIn";

export function Values() {
  return (
    <SectionShell
      id="values"
      labelledBy="values-heading"
      trackVh={200}
      scaleRange={[0.9, 1, 1.2]}
      blurRange={[9, 0, 0, 12]}
      depth={220}
    >
      <div className="flex w-full max-w-3xl flex-col items-center text-center">
        <FadeIn className="mb-14">
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-brand">
            04 — {VALUES.eyebrow}
          </span>
        </FadeIn>

        <Reveal
          as="h2"
          text={VALUES.value.title}
          stagger={0.06}
          className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        />
        <span id="values-heading" className="sr-only">
          Values
        </span>

        <FadeIn delay={0.15} className="mt-8 max-w-md">
          <p className="text-lg leading-relaxed text-muted-foreground">{VALUES.value.body}</p>
        </FadeIn>
      </div>
    </SectionShell>
  );
}

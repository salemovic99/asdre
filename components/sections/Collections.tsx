"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { COLLECTIONS, type Collection } from "@/lib/content";
import { EASE_LUX, SPRING_SOFT, VIEWPORT_ONCE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/FadeIn";
import { Reveal } from "@/components/motion/Reveal";
import { FloatingObject } from "@/components/motion/FloatingObject";
import { Sculpture } from "@/components/visual/Shapes";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import { useIsMobile } from "@/hooks/useIsMobile";

/** A rotatable sculpture — follows the pointer across the card. */
function RotatableSculpture({ tone }: { tone: "cool" | "warm" }) {
  const { reduced } = useReducedMotionPref();
  const isMobile = useIsMobile();
  const interactive = !reduced && !isMobile;

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const srx = useSpring(rotateX, SPRING_SOFT);
  const sry = useSpring(rotateY, SPRING_SOFT);

  if (!interactive) {
    return (
      <FloatingObject rotateDuration={reduced ? 0 : 26} spin="y" amplitude={10}>
        <Sculpture tone={tone} className="h-[36vh] max-h-[320px] w-auto" />
      </FloatingObject>
    );
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
      <Sculpture tone={tone} className="h-[36vh] max-h-[320px] w-auto" />
    </motion.div>
  );
}

function CollectionPanel({ collection, delay }: { collection: Collection; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 1, delay, ease: EASE_LUX }}
    >
      <Card
        className={cn(
          "group relative flex h-full flex-col items-center gap-8 overflow-hidden rounded-[2rem] border-border/60 p-9 text-center backdrop-blur-md sm:p-12",
          collection.tone === "cool"
            ? "bg-[linear-gradient(160deg,rgba(238,241,246,0.9),rgba(255,255,255,0.6))]"
            : "bg-[linear-gradient(160deg,rgba(247,237,224,0.9),rgba(255,255,255,0.6))]",
        )}
      >
        {/* tonal glow */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute -top-1/3 left-1/2 size-[120%] -translate-x-1/2 rounded-full blur-3xl transition-opacity duration-700 group-hover:opacity-90",
            collection.tone === "cool"
              ? "bg-[radial-gradient(circle,rgba(99,102,241,0.14),transparent_60%)]"
              : "bg-[radial-gradient(circle,rgba(201,138,43,0.16),transparent_60%)]",
          )}
        />

        <div className="relative flex min-h-[36vh] items-center justify-center">
          <RotatableSculpture tone={collection.tone} />
        </div>

        <div className="relative flex flex-col items-center">
          <span className="font-mono text-xs tracking-[0.4em] text-brand">
            {collection.index}
          </span>
          <h3 className="mt-3 font-serif text-4xl tracking-[0.18em] text-foreground sm:text-5xl">
            {collection.name}
          </h3>
          <p className="mt-4 max-w-xs text-sm font-medium text-secondary-foreground">
            {collection.tagline}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
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
      </Card>
    </motion.div>
  );
}

export function Collections() {
  return (
    <section
      id="collections"
      aria-labelledby="collections-heading"
      className="relative w-full py-32 sm:py-40"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <div className="mb-16 flex flex-col items-center text-center">
          <FadeIn className="mb-6">
            <span className="font-mono text-xs uppercase tracking-[0.5em] text-brand">
              05 — Collections
            </span>
          </FadeIn>
          <Reveal
            as="h2"
            text="Two Worlds, One House."
            className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-6xl"
          />
          <span id="collections-heading" className="sr-only">
            Collections
          </span>
          <FadeIn delay={0.1} className="mt-6 max-w-xl">
            <p className="text-base text-muted-foreground">
              Each ASDRÉ piece is made from carefully selected premium fabrics — quality felt
              before it&rsquo;s seen.
            </p>
          </FadeIn>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {COLLECTIONS.map((collection, i) => (
            <CollectionPanel key={collection.name} collection={collection} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}

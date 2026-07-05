"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { MapPin, Mail } from "lucide-react";
import { CONTACT } from "@/lib/content";
import { EASE_LUX, SPRING_SOFT, VIEWPORT_ONCE } from "@/lib/motion";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import { useIsMobile } from "@/hooks/useIsMobile";

export function Contact() {
  const { reduced } = useReducedMotionPref();
  const isMobile = useIsMobile();
  const interactive = !reduced && !isMobile;

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const srx = useSpring(rotateX, SPRING_SOFT);
  const sry = useSpring(rotateY, SPRING_SOFT);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-32"
    >
      <div className="mb-14 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.5em] text-brand">
          07 — Contact
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 1, ease: EASE_LUX }}
        className="[perspective:1200px]"
      >
        <motion.div
          className="glass w-[min(90vw,420px)] rounded-[2rem] p-9 text-center [transform-style:preserve-3d] sm:p-11"
          style={interactive ? { rotateX: srx, rotateY: sry } : undefined}
          onPointerMove={
            interactive
              ? (e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 16);
                  rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
                }
              : undefined
          }
          onPointerLeave={
            interactive
              ? () => {
                  rotateX.set(0);
                  rotateY.set(0);
                }
              : undefined
          }
        >
          <h2
            id="contact-heading"
            className="font-serif text-3xl font-medium tracking-[0.3em] text-foreground"
          >
            ASDRÉ
          </h2>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            {CONTACT.eyebrow}
          </p>

          <Separator className="my-7 bg-border/70" />

          <div className="flex items-center justify-center gap-2 text-sm text-secondary-foreground">
            <MapPin className="size-4 text-brand" aria-hidden="true" />
            <span>{CONTACT.location}</span>
          </div>

          <ul className="mt-6 flex flex-col gap-3">
            {CONTACT.emails.map((email) => (
              <li key={email}>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:text-brand"
                >
                  <Mail className="size-3.5" aria-hidden="true" />
                  {email}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      <div className="mt-16 text-center">
        <Reveal
          as="p"
          text={CONTACT.closing}
          stagger={0.08}
          className="font-serif text-2xl italic tracking-tight text-foreground/70 sm:text-3xl"
        />
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
          © {new Date().getFullYear()} ASDRÉ — Designed For Forever
        </p>
      </div>
    </section>
  );
}

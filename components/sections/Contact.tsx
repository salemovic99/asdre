"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Check, Copy, Mail, MapPin } from "lucide-react";
import { CONTACT, BRAND } from "@/lib/content";
import { SPRING_SOFT } from "@/lib/motion";
import { Reveal } from "@/components/motion/Reveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { ParticleField } from "@/components/visual/Shapes";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * The closing screen — a dark, cinematic finale that doubles as the footer.
 * An indigo spotlight follows the cursor over a near-black field of drifting
 * particles; the statement drifts with the pointer; email rows are magnetic and
 * offer both a mailto link and a copy-to-clipboard button. Degrades gracefully:
 * no magnetism/parallax under reduced motion or on touch, but copy still works.
 */

// Magnetic wrapper — pulls its child toward the cursor. Inert when disabled.
function Magnetic({
  children,
  disabled,
  className,
}: {
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING_SOFT);
  const sy = useSpring(y, SPRING_SOFT);

  if (disabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className={className}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function Contact() {
  const { reduced } = useReducedMotionPref();
  const isMobile = useIsMobile();
  const interactive = !reduced && !isMobile;

  // Cursor-tracked spotlight (delta from section center; rests centered).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, SPRING_SOFT);
  const smy = useSpring(my, SPRING_SOFT);

  // Pointer-reactive drift for the statement.
  const { x: pmx, y: pmy } = useMouseParallax();
  const headX = useTransform(pmx, [-0.5, 0.5], [-14, 14]);
  const headY = useTransform(pmy, [-0.5, 0.5], [-10, 10]);

  // Copy-to-clipboard state.
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copyEmail(email: string) {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const ta = document.createElement("textarea");
        ta.value = email;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      setCopied(email);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(null), 1600);
    } catch {
      // clipboard blocked — the mailto link remains available
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      onPointerMove={
        interactive
          ? (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              mx.set(e.clientX - r.left - r.width / 2);
              my.set(e.clientY - r.top - r.height / 2);
            }
          : undefined
      }
      onPointerLeave={
        interactive
          ? () => {
              mx.set(0);
              my.set(0);
            }
          : undefined
      }
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0c0a09] px-6 py-32 text-[#fafaf9]"
    >
      {/* cursor-tracked indigo spotlight (rests centered) */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <motion.div
          aria-hidden="true"
          style={interactive ? { x: smx, y: smy } : undefined}
          className="size-[620px] max-w-[90vw] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.20),transparent_65%)] blur-[80px]"
        />
      </div>

      {/* drifting particle field */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        animate={reduced ? undefined : { y: [0, -18, 0] }}
        transition={reduced ? undefined : { duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <ParticleField count={isMobile ? 20 : 40} />
      </motion.div>

      {/* faint tagline marquee behind the footer */}
      {interactive && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[10%] z-0 overflow-hidden"
        >
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="px-10 font-serif text-[8vw] font-medium uppercase tracking-tight text-white/[0.035]"
              >
                {BRAND.tagline}
              </span>
            ))}
          </motion.div>
        </div>
      )}

      {/* content */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        <FadeIn>
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-[#6366f1]">
            07 — Contact
          </span>
        </FadeIn>

        <h2 id="contact-heading" className="sr-only">
          Contact
        </h2>

        <motion.div style={interactive ? { x: headX, y: headY } : undefined} className="mt-8">
          <Reveal
            as="p"
            text={CONTACT.lead}
            splitBy="word"
            stagger={0.08}
            className="font-serif text-[clamp(3rem,11vw,8rem)] font-medium leading-[0.95] tracking-tight text-[#fafaf9]"
          />
        </motion.div>

        <FadeIn delay={0.2} className="mt-6">
          <p className="font-serif text-[clamp(1.1rem,3vw,1.75rem)] italic text-white/60">
            {CONTACT.closing}
          </p>
        </FadeIn>

        <div className="mt-12 flex w-full max-w-md flex-col gap-3">
          {CONTACT.emails.map((email, i) => (
            <FadeIn key={email} delay={0.1 + i * 0.06} className="w-full">
              <Magnetic disabled={!interactive} className="w-full">
                <div className="group flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] py-2.5 pr-2.5 pl-5 backdrop-blur-md transition-colors hover:border-[#4f46e5]/50 max-md:backdrop-blur-none">
                  <a
                    href={`mailto:${email}`}
                    className="flex-1 truncate text-left font-mono text-sm text-white/80 transition-colors group-hover:text-white focus-visible:text-white focus-visible:outline-none"
                  >
                    {email}
                  </a>
                  <button
                    type="button"
                    onClick={() => copyEmail(email)}
                    aria-label={copied === email ? "Copied" : "Copy email address"}
                    className="flex size-10 shrink-0 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {copied === email ? (
                        <motion.span
                          key="check"
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          <Check className="size-4 text-[#6366f1]" aria-hidden="true" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          <Copy className="size-4" aria-hidden="true" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                  <a
                    href={`mailto:${email}`}
                    aria-label={`Email ${email}`}
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-[#4f46e5] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
                  >
                    <Mail className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </Magnetic>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4} className="mt-16">
          <div className="flex flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 sm:flex-row sm:gap-6">
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-3.5 text-[#6366f1]" aria-hidden="true" />
              {CONTACT.location}
            </span>
            <span className="hidden text-white/20 sm:inline">·</span>
            <span>© {new Date().getFullYear()} ASDRÉ — Designed For Forever</span>
          </div>
        </FadeIn>
      </div>

      {/* screen-reader announcement for copy */}
      <span aria-live="polite" className="sr-only">
        {copied ? `Copied ${copied}` : ""}
      </span>
    </section>
  );
}

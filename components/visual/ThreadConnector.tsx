"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

/**
 * The thread across the Patience → About seam.
 *
 * Patience ends with a structural 100vh of dead scroll: its sticky child has to
 * slide out, and because both sides of the seam are #0c0a09 that slide is
 * invisible. Rather than shrink it — the strip is always exactly one viewport,
 * whatever the track height — this fills it. A dashed wine line draws downward
 * out of where the last line stood, a lit tip descends ahead of the reader, and
 * when it lands it blooms outward just as About's ambient glow rises out of it.
 *
 * Two things make it cheap:
 *
 * 1. The dashes are never scaled. Scaling a repeating gradient stretches its
 *    pattern, and every other reveal (height, mask-image, stroke-dashoffset)
 *    repaints per frame. Instead the rail is drawn at full length and a solid
 *    #0c0a09 cover is retracted off it — the same "hide it with a solid, never
 *    animate a colour" move the iris uses. The cover is invisible because the
 *    room behind it is exactly that colour.
 *
 * 2. It is a `fixed` sibling of Patience's sticky child, not a descendant —
 *    the pattern Hero already uses for its portal overlays. Viewport-anchored,
 *    so the tip falls on screen while the strip scrolls up beneath it, and out
 *    of reach of the sticky panel's overflow-hidden.
 */

/** Rail length, in vh. The tip travels exactly this far. */
const LINE_VH = 44;

export function ThreadConnector({ p, u }: { p: MotionValue<number>; u: number }) {
  // Anchored to the unpin point so the timing holds on both breakpoints.
  const t0 = u - 0.02; // line 2 has cleared; the thread appears
  const t1 = u + (1 - u) * 0.72; // the tip lands
  const t2 = u + (1 - u) * 0.98; // the bloom is spent

  const opacity = useTransform(p, [t0, t0 + 0.03, t1 + 0.02, t2], [0, 1, 1, 0]);

  // Retracting the cover uncovers the rail from the top down.
  const coverScaleY = useTransform(p, [t0, t1], [1, 0]);

  const tipY = useTransform(p, [t0, t1], ["0vh", `${LINE_VH}vh`]);
  const tipScale = useTransform(p, [t0, t1], [1, 1.35]);

  const bloomScale = useTransform(p, [t1 - 0.02, t2], [1, 26]);
  const bloomOpacity = useTransform(p, [t1, t1 + 0.04, t2], [0.9, 0.55, 0]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity, willChange: "opacity" }}
      // z-40 so it paints over About's z-auto panel as About pins beneath the
      // bloom, but under the grain (z-60) and the nav (z-70).
      className="pointer-events-none fixed inset-0 z-[40]"
    >
      {/* Static centring. Nothing framer transforms may carry a Tailwind
          translate — the inline transform would overwrite it. */}
      <div
        className="absolute left-1/2 top-[28vh] w-[2px] -translate-x-1/2"
        style={{ height: `${LINE_VH}vh` }}
      >
        {/* the rail, drawn at full length and never scaled */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,#c25a6d_0_5px,transparent_5px_13px)]" />

        {/* the cover, retracting downward off the rail */}
        <motion.div
          style={{ scaleY: coverScaleY, transformOrigin: "bottom", willChange: "transform" }}
          className="absolute inset-0 bg-[#0c0a09]"
        />

        {/* The tip, falling ahead of the reader. Both centring translates ride
            on the wrapper; framer owns the transform on the dot itself. */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            style={{ y: tipY, scale: tipScale, willChange: "transform" }}
            className="size-[7px] rounded-full bg-[#c25a6d] shadow-[0_0_18px_6px_rgba(194,90,109,0.45)]"
          />
        </div>

        {/* where it lands, the bloom that becomes About's glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <motion.div
            style={{ scale: bloomScale, opacity: bloomOpacity, willChange: "transform, opacity" }}
            className="size-[36px] rounded-full bg-[radial-gradient(circle,rgba(194,90,109,0.55),rgba(165,64,82,0.18)_45%,transparent_70%)]"
          />
        </div>
      </div>
    </motion.div>
  );
}

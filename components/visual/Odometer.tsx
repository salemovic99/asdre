"use client";

import {
  motion,
  useTransform,
  useVelocity,
  useSpring,
  useMotionTemplate,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A mechanical countdown drum, driven by scroll rather than by time.
 *
 * Each wheel is a vertical strip of `mod` cells plus a duplicate of cell 0 at
 * the end. That duplicate is what makes the wrap invisible: at position `mod`
 * and at position `0` the same glyph is under the window, so the strip can
 * silently reset.
 *
 * The subtle part is the carry. A naive continuous `(s / base) % mod` rolls the
 * tens wheels at a tenth of the speed of the ones wheel, which leaves them
 * permanently stopped halfway between two digits — unreadable. A real counter
 * holds a digit still and flips it only as the wheel below carries. So only the
 * seconds-ones wheel is a linear ramp; every higher wheel sits flat on its
 * integer and rolls inside a narrow window centred on each carry boundary.
 *
 * Every wheel is a pure function of the same `s`, so carries cannot drift apart.
 */

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** Opening value: 00:59:59. */
export const COUNTDOWN_SECONDS = 3599;

/** Width of the carry window, in digit-steps. Centred on the boundary. */
const ROLL = 0.18;
const HALF = ROLL / 2;

/** Velocity (cells/sec) at which the roll blur saturates. */
const MAX_V = 6;
/** Blur stays a hint. Past ~3px it smears rather than suggests. */
const MAX_BLUR = 2.5;

/**
 * A wheel's starting `x` can land inside its own carry window and render
 * half-flipped on the very first frame — s=3599 is 1s below the 60-minute
 * boundary, 1s below the next minute, and 1s below the next ten seconds. Pin
 * each wheel to the middle of its opening digit's plateau. Every wheel's true
 * digit is constant above this point, so nothing is lost.
 */
const capFor = (base: number) => Math.floor(COUNTDOWN_SECONDS / base) + 0.49;

/**
 * Continuous wheel position, in cells.
 *
 * The carry is *centred* on the boundary — half the flip before, half after —
 * so a wheel never systematically leads or lags the value below it. A trailing
 * roll would show `00:01:59` at s=59, and `00:59:50` at s=2990.
 */
export function drumPos(s: number, base: number, mod: number, continuous: boolean): number {
  const x = Math.min(s / base, capFor(base));

  let rolled: number;
  if (continuous) {
    rolled = x;
  } else {
    const n = Math.round(x);
    const e = x - n;
    rolled = n - 1 + smoothstep(clamp01((e + HALF) / ROLL));
    // x=0 sits exactly on a boundary. Without this the resting 00:00:00 would
    // hold every wheel permanently half-flipped.
    if (rolled < 0) rolled = 0;
  }
  // Guard the spring's overshoot into negatives.
  return ((rolled % mod) + mod) % mod;
}

interface WheelProps {
  /** Seconds remaining, continuous, 3599 → 0. */
  s: MotionValue<number>;
  base: number;
  mod: number;
  continuous: boolean;
  blurred: boolean;
}

function Wheel({ s, base, mod, continuous, blurred }: WheelProps) {
  // mod distinct digits, then a duplicate of the first — the invisible seam.
  const cells = [...Array.from({ length: mod }, (_, i) => i), 0];

  const pos = useTransform(s, (v) => drumPos(v, base, mod, continuous));
  // One cell is exactly 1em, so the drum scales with the clamp() font size.
  const y = useTransform(pos, (v) => `${-v}em`);

  const rawV = useVelocity(pos);
  const speed = useSpring(rawV, { stiffness: 300, damping: 40 });
  const blur = useTransform(speed, (v) =>
    blurred ? (Math.min(Math.abs(v), MAX_V) / MAX_V) * MAX_BLUR : 0,
  );
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <span className="relative block h-[1em] w-[0.62em] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_22%,#000_78%,transparent)]">
      <motion.span style={{ y, filter, willChange: "transform" }} className="block">
        {cells.map((d, i) => (
          <span key={i} className="block h-[1em] text-center leading-none tabular-nums">
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/** Static, never blinking — a blinking colon reads as a cheap alarm clock. */
function Colon() {
  return <span className="mx-[0.1em] leading-none text-brand/40 tabular-nums">:</span>;
}

const FACE_CLS =
  "flex items-center font-mono font-light tracking-tight text-foreground text-[clamp(2.25rem,8vw,5rem)] [text-shadow:0_1px_0_rgba(12,10,9,0.04),0_0_22px_rgba(165,64,82,0.10)]";

/** The end state, for reduced motion. No wheels, no velocity, no filters. */
export function StaticOdometer({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn(FACE_CLS, className)}>
      <span className="tabular-nums">00</span>
      <Colon />
      <span className="tabular-nums">00</span>
      <Colon />
      <span className="tabular-nums">00</span>
    </div>
  );
}

/**
 * `HH:MM:SS`, counting 00:59:59 → 00:00:00. Hours never move, so they are a
 * plain string rather than two dead wheels.
 */
export function Odometer({
  s,
  blurred = true,
  className,
}: {
  s: MotionValue<number>;
  blurred?: boolean;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn(FACE_CLS, className)}>
      <span className="tabular-nums">00</span>
      <Colon />
      <Wheel s={s} base={600} mod={6} continuous={false} blurred={blurred} />
      <Wheel s={s} base={60} mod={10} continuous={false} blurred={blurred} />
      <Colon />
      <Wheel s={s} base={10} mod={6} continuous={false} blurred={blurred} />
      {/* The ones wheel changes every ~0.5px of scroll — a continuous ramp,
          which is what a real timer's fastest drum looks like. */}
      <Wheel s={s} base={1} mod={10} continuous blurred={blurred} />
    </div>
  );
}

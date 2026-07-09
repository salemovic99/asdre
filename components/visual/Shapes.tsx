"use client";

import { cn } from "@/lib/utils";

/**
 * Abstract, premium geometry rendered with pure CSS/SVG gradients — no WebGL.
 * Each shape is a self-contained, theme-aware "sculpture" for a chapter.
 */

/** Hero — a floating glass sphere with soft refraction and an wine core. */
export function GlassOrb({ className }: { className?: string }) {
  return (
    <div className={cn("relative aspect-square", className)}>
      {/* ambient glow */}
      <div className="absolute inset-[-18%] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.28),transparent_60%)] blur-2xl" />
      {/* the sphere */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(38%_38%_at_34%_28%,#ffffff_0%,rgba(255,255,255,0.65)_18%,rgba(232,236,240,0.5)_44%,rgba(212,211,209,0.35)_70%,rgba(28,25,23,0.10)_100%)] shadow-[0_40px_120px_-30px_rgba(28,25,23,0.45)] ring-1 ring-white/50 backdrop-blur-sm">
        {/* inner wine caustic */}
        <div className="absolute inset-[16%] rounded-full bg-[radial-gradient(circle_at_66%_70%,rgba(79,70,229,0.35),transparent_58%)] blur-md" />
        {/* specular highlight */}
        <div className="absolute left-[22%] top-[16%] h-[26%] w-[34%] rounded-full bg-white/70 blur-md" />
        {/* rim light */}
        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/40" />
      </div>
    </div>
  );
}

/** Values — a faceted crystal. */
export function Crystal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 240"
      className={cn("overflow-visible", className)}
      role="img"
      aria-label="A faceted crystal"
    >
      <defs>
        <linearGradient id="crys-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e8ecf0" />
        </linearGradient>
        <linearGradient id="crys-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e8ecf0" />
          <stop offset="1" stopColor="#c9c7f2" />
        </linearGradient>
        <linearGradient id="crys-c" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#a54052" stopOpacity="0.55" />
          <stop offset="1" stopColor="#c25a6d" stopOpacity="0.15" />
        </linearGradient>
        <filter id="crys-shadow" x="-40%" y="-20%" width="180%" height="150%">
          <feDropShadow dx="0" dy="26" stdDeviation="24" floodColor="#1c1917" floodOpacity="0.22" />
        </filter>
      </defs>
      <g filter="url(#crys-shadow)">
        <polygon points="100,6 150,70 100,120 50,70" fill="url(#crys-a)" />
        <polygon points="150,70 100,234 100,120" fill="url(#crys-c)" />
        <polygon points="50,70 100,234 100,120" fill="url(#crys-b)" />
        <polygon points="100,6 150,70 100,120 50,70" fill="none" stroke="#ffffff" strokeOpacity="0.7" />
        <polygon points="50,70 100,120 100,234 150,70" fill="none" stroke="#1c1917" strokeOpacity="0.06" />
      </g>
    </svg>
  );
}

/** Vision/Mission — an infinite ring (timelessness). */
export function InfiniteRing({ className }: { className?: string }) {
  return (
    <div className={cn("relative aspect-square", className)}>
      <div className="absolute inset-[-14%] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.18),transparent_62%)] blur-2xl" />
      <div className="absolute inset-0 rounded-full [background:conic-gradient(from_210deg,#e8ecf0,#ffffff_18%,#d6d3d1_38%,#c7c9f0_52%,#ffffff_74%,#e8ecf0)] shadow-[0_30px_90px_-30px_rgba(28,25,23,0.4)]">
        <div className="absolute inset-[18%] rounded-full bg-background shadow-[inset_0_2px_20px_rgba(28,25,23,0.12)]" />
        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/60" />
      </div>
    </div>
  );
}

/** Collections — an abstract flowing sculpture (cool = LÉMAN, warm = RIVIERA). */
export function Sculpture({
  tone = "cool",
  className,
}: {
  tone?: "cool" | "warm";
  className?: string;
}) {
  const from = tone === "cool" ? "#eef1f6" : "#f7ede0";
  const mid = tone === "cool" ? "#c9cdf1" : "#f0d3a6";
  const accent = tone === "cool" ? "#a54052" : "#c98a2b";
  const gid = `scl-${tone}`;
  return (
    <svg
      viewBox="0 0 220 260"
      className={cn("overflow-visible", className)}
      role="img"
      aria-label={`${tone === "cool" ? "LÉMAN" : "RIVIERA"} sculpture`}
    >
      <defs>
        <linearGradient id={`${gid}-a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="0.6" stopColor={mid} />
          <stop offset="1" stopColor={accent} stopOpacity="0.5" />
        </linearGradient>
        <filter id={`${gid}-s`} x="-30%" y="-20%" width="160%" height="150%">
          <feDropShadow dx="0" dy="24" stdDeviation="22" floodColor="#1c1917" floodOpacity="0.2" />
        </filter>
      </defs>
      <path
        filter={`url(#${gid}-s)`}
        fill={`url(#${gid}-a)`}
        d="M110 6c46 0 74 40 74 92 0 40-20 58-20 92 0 34-22 62-54 62s-54-24-54-58c0-38-24-52-24-98C32 46 64 6 110 6Z"
      />
      <path
        fill="#ffffff"
        fillOpacity="0.5"
        d="M96 40c22-10 44 4 44 30 0 22-16 30-16 54 0-26-40-30-40-58 0-12 4-21 12-26Z"
      />
    </svg>
  );
}

/**
 * Soft floating particles. Positions are deterministic (index-derived) to avoid
 * hydration mismatch. Motion is applied by the parent via FloatingObject / CSS;
 * these are the static marks.
 *
 * `tone` picks the field the dots have to survive on: "light" is the original
 * white-on-dark (About, Patience); "warm" is wine-on-warm-white, where a glow
 * would be invisible and has to become a soft halo instead.
 */
export function ParticleField({
  count = 42,
  tone = "light",
  className,
}: {
  count?: number;
  tone?: "light" | "warm";
  className?: string;
}) {
  const warm = tone === "warm";
  const dots = Array.from({ length: count }, (_, i) => {
    // deterministic pseudo-scatter
    const x = (i * 61.803) % 100;
    const y = (i * 38.197 + (i % 5) * 7) % 100;
    const size = 1 + ((i * 13) % 5) * 0.6;
    const opacity = 0.15 + ((i * 7) % 10) / 22;
    return { x, y, size, opacity, key: i };
  });
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {dots.map((d) => (
        <span
          key={d.key}
          className={cn("absolute rounded-full", warm ? "bg-[#a54052]" : "bg-white")}
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            opacity: warm ? d.opacity + 0.18 : d.opacity,
            boxShadow: warm
              ? "0 0 6px rgba(165,64,82,0.35)"
              : "0 0 6px rgba(255,255,255,0.6)",
          }}
        />
      ))}
    </div>
  );
}

/**
 * A subtle alpine ridge silhouette for the dark "Swiss Alps" scene. Layered
 * peaks fade from wine-tinted dark up into the void, following the house
 * gradient + soft-shadow convention.
 */
export function MountainSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 420"
      preserveAspectRatio="xMidYMax meet"
      className={cn("h-auto w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ridge-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a54052" stopOpacity="0.35" />
          <stop offset="1" stopColor="#0c0a09" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="ridge-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1830" stopOpacity="0.95" />
          <stop offset="1" stopColor="#0c0a09" stopOpacity="1" />
        </linearGradient>
      </defs>
      {/* far ridge */}
      <path
        d="M0 420 L0 250 L230 120 L430 235 L640 95 L880 240 L1080 130 L1290 210 L1440 150 L1440 420 Z"
        fill="url(#ridge-back)"
      />
      {/* near ridge */}
      <path
        d="M0 420 L0 320 L280 200 L520 330 L760 190 L1010 320 L1230 235 L1440 315 L1440 420 Z"
        fill="url(#ridge-front)"
      />
    </svg>
  );
}

# ASDRÉ — Designed For Forever

An immersive, cinematic storytelling website for **ASDRÉ**, a quiet-luxury fashion house inspired by Swiss design and timeless style. Rather than a conventional landing page, the experience is a single vertical journey where the user appears to **dive through portals into a floating geometric object**, discovering the brand's story one deeper layer at a time.

> _Quiet Luxury · Swiss Minimalism · Timeless · Calm · Made For You_

---

## The Experience

The site is one continuous scroll composed of eight chapters. Sections never break hard — each dissolves into the next as the "camera" flies through it (scale + blur + depth), so the whole thing reads like descending deeper into the ASDRÉ world.

| # | Chapter | Answers | Signature moment |
|---|---------|---------|------------------|
| 00 | **Hero** | Welcome to ASDRÉ | Floating glass orb, mouse-reactive; camera dives *into* it on scroll |
| 01 | **About** | Who are we? | Founding story revealed word-by-word over parallax alpine silhouettes |
| 02 | **Vision** | Where are we going? | One statement over a slowly rotating infinite ring |
| 03 | **Mission** | Why were we created? | Self-drawing fabric-fold lines + animated pillars |
| 04 | **Values** | What do we believe? | A single value — _Attention to Detail_ — with a floating faceted crystal |
| 05 | **Collections** | What do we create? | **LÉMAN** (cool) & **RIVIERA** (warm) with pointer-rotatable sculptures |
| 06 | **Coming Soon** | What comes next? | Dark immersive room, particles, spotlight, countdown placeholder |
| 07 | **Contact** | Why should you care? | Minimal floating glass business card that tilts to the pointer |

Fixed wayfinding sits above it all: a minimal top bar with the full chapter index (Sheet), a whisper-thin scroll progress bar, and a vertical chapter rail.

---

## Tech Stack

- **Next.js 16** (App Router, Turbopack, standalone output)
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first `@theme` tokens — no `tailwind.config`)
- **shadcn/ui** (base-nova / Base UI primitives) for every UI component
- **Framer Motion** for all animation (scroll-driven, springs, reveals)
- **Lenis** for cinematic inertial smooth-scroll
- **Lucide React** icons · **next/font** (Playfair Display · Inter · JetBrains Mono)

> The 3D "dive" is achieved with **CSS 3D transforms driven by Framer Motion scroll APIs** — no WebGL/Three.js and no GSAP. This keeps the experience at 60fps and lightweight on mobile.

---

## Design System

| Token | Value | Use |
|-------|-------|-----|
| Background | `#FAFAF9` | Warm white canvas |
| Foreground | `#0C0A09` | Near-black text |
| Primary | `#1C1917` | Buttons, strong marks |
| Muted / Border | `#E8ECF0` / `#D6D3D1` | Surfaces, dividers |
| **Brand (indigo)** | `#4F46E5` / soft `#6366F1` | Small accents, glows, focus rings |

- **Typography** — Playfair Display (serif display headings), Inter (sans body), JetBrains Mono (uppercase tracked labels & chapter numbers).
- **Style** — very subtle _Liquid Glass_ (glassmorphism), soft gradients, film-grain overlay, blur crossfades, massive whitespace, Swiss grid.
- Fixed **warm-white brand** (no dark mode); a class-scoped `dark` variant is overridden so OS dark-mode never alters the palette.

All tokens live in [`app/globals.css`](app/globals.css) under `@theme`, so every shadcn component inherits the brand automatically.

---

## Architecture

```
app/
  layout.tsx          # Server: 3 fonts, metadata + viewport, grain overlay, <Providers>
  page.tsx            # Server: renders <StoryExperience/>
  providers.tsx       # Client: MotionConfig + reduced-motion context + Lenis + Tooltip
  globals.css         # Tailwind v4 tokens, glass/grain utilities
components/
  ui/                 # shadcn/ui components
  layout/             # StoryExperience, SectionShell, AmbientBackground, GrainOverlay
  navigation/         # ChapterNav (Sheet), ChapterProgress rail, ReduceMotionToggle
  sections/           # Hero, About, Vision, Mission, Values, Collections, ComingSoon, Contact
  motion/             # FadeIn, Reveal, Parallax, SectionTransition, FloatingObject, ScrollProgress
  visual/             # Shapes.tsx — GlassOrb, Crystal, InfiniteRing, Sculpture, ParticleField
hooks/                # useReducedMotionPref, useIsMobile, useMouseParallax,
                      #   useSectionScroll, useActiveChapter, useLenis
lib/                  # utils (cn), chapters, content (all copy), motion (easings/springs)
```

`app/layout.tsx` and `app/page.tsx` stay Server Components; all interactivity lives under one client tree (`StoryExperience`). Reusable motion primitives (`components/motion/*`) each consult the reduced-motion preference and degrade gracefully.

### The portal transition

Each pinned chapter is a tall scroll runway (`~180vh`) holding a sticky full-viewport panel. Per-section `useScroll` progress (spring-smoothed) drives `scale → blur → opacity → translateZ`, so the outgoing section flies toward the camera while the next emerges from depth. This lives in [`components/motion/SectionTransition.tsx`](components/motion/SectionTransition.tsx), productized via [`SectionShell`](components/layout/SectionShell.tsx).

---

## Accessibility & Performance

- **Reduced motion, three layers:** global `MotionConfig reducedMotion="user"` (auto-respects the OS setting) + a **user toggle** in the nav (persisted, forces reduction site-wide) + per-component static branches for infinite loops. Mouse-parallax and endless float/spin are disabled entirely when reduced. A CSS `@media (prefers-reduced-motion)` floor backs it up.
- **Performance:** animates only `transform` / `opacity` / `filter`; `will-change` scoped to active elements; blur capped and gated off on mobile; perspective/`translateZ` flattened on mobile; deterministic particle positions (no hydration mismatch).
- **Semantics:** landmark `<nav>` / `<main>` / `<section aria-labelledby>`, sequential headings, skip link, focus-visible indigo rings, keyboard-navigable chapter rail, and text reveals expose full text to screen readers via `aria-label`.
- **Responsive:** mobile-first, tuned at 375 / 768 / 1024 / 1440; shorter runways and fewer effects on small screens.

---

## Getting Started

> **Requires Node.js ≥ 20.9** (Next.js 16). If your machine is on an older Node, use the Docker workflow below.

```bash
npm install        # .npmrc sets legacy-peer-deps for React 19
npm run dev        # http://localhost:3000
```

Scripts:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build (standalone output) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (flat config) |
| `npx tsc --noEmit` | Type-check |

---

## Docker

A multi-stage, non-root, standalone image is included — it brings its own Node 22, so the **host Node version is irrelevant**.

```bash
docker build -t asdre .
docker run --rm -p 3000:3000 asdre
# → http://localhost:3000
```

Stages: `deps` (cached `npm ci`) → `builder` (`next build`) → `runner` (copies `.next/standalone` + `.next/static` + `public`, runs as `nextjs:nodejs`, with a `HEALTHCHECK`). See [`Dockerfile`](Dockerfile) and [`.dockerignore`](.dockerignore).

---

## Content

All brand copy is centralized in [`lib/content.ts`](lib/content.ts) and chapter metadata in [`lib/chapters.ts`](lib/chapters.ts) — edit those to revise wording without touching components.

**Contact** — Riyadh · Waleed@Asdré.com · Faisal@Asdré.com · Info@Asdré.com

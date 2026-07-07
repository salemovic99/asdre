# ASDRÉ — Designed For Forever

An immersive, cinematic storytelling website for **ASDRÉ**, a quiet-luxury fashion house inspired by Swiss design and timeless style. Rather than a conventional landing page, the experience is a single vertical journey of pinned, scroll-driven chapters — each a distinct cinematic set-piece (a portal dive, a flight through deep space, a horizontal camera pan, a word-by-word illumination) — that reveal the brand's story one deeper layer at a time.

> _Quiet Luxury · Swiss Minimalism · Timeless · Calm · Made For You_

---

## The Experience

The site is one continuous scroll composed of eight chapters. Sections never break hard — most dissolve into the next as the "camera" flies through them (scale + blur + depth), while several run their own bespoke pinned rigs, so the whole thing reads like descending deeper into the ASDRÉ world. The chapters also breathe light → dark → light: a warm-white overture, a dark deep-space About, a light middle (Vision · Mission · Values · Collections), then a dark Coming Soon + Contact close.

| # | Chapter | Answers | Signature moment |
|---|---------|---------|------------------|
| 00 | **Hero** | Welcome to ASDRÉ | 3D letter-flip wordmark + pointer-reactive indigo aura; the camera flies *into* the letter **D** as a portal into About |
| 01 | **About** | Who are we? | **Dark** flight through deep space — the founding story streams past as typographic beats (`translateZ` + depth blur) over a starfield, landing on the ASDRÉ logo + collection teasers |
| 02 | **Vision** | Where are we going? | A single serif statement resolving through the portal dive |
| 03 | **Mission** | Why were we created? | Self-drawing fabric-fold lines + animated pillars |
| 04 | **Values** | What do we believe? | _Attention to Detail_ — the statement inks in word-by-word as you scroll, key words glowing indigo |
| 05 | **Collections** | What do we create? | Pinned horizontal camera pan from **LÉMAN** (cool) to **RIVIERA** (warm) as the light shifts cool → warm |
| 06 | **Coming Soon** | What comes next? | **Dark** finale — cursor spotlight, drifting particles, a shimmering countdown |
| 07 | **Contact** | Why should you care? | **Dark** cinematic close — cursor spotlight, particle field, magnetic email rows (mailto + copy-to-clipboard) |

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
- Fixed **warm-white brand** (no OS dark mode); a class-scoped `dark` variant is overridden so OS dark-mode never alters the palette. Individual chapters (**About · Coming Soon · Contact**) deliberately use a near-black `#0C0A09` canvas for contrast — set with explicit colors, not a theme switch.

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
  visual/             # LogoReveal, ScrollMouse, Shapes (ParticleField, MountainSilhouette, Sculpture, glass primitives)
hooks/                # useReducedMotionPref, useIsMobile, useMouseParallax,
                      #   useSectionScroll, useActiveChapter, useLenis
lib/                  # utils (cn), chapters, content (all copy), motion (easings/springs)
```

`app/layout.tsx` and `app/page.tsx` stay Server Components; all interactivity lives under one client tree (`StoryExperience`). Reusable motion primitives (`components/motion/*`) each consult the reduced-motion preference and degrade gracefully.

### Pinned scroll rigs

Every chapter is a tall scroll runway holding a sticky full-viewport panel, with spring-smoothed `useScroll` progress driving the motion. **Vision** and **Mission** use the shared "portal dive" — [`SectionTransition`](components/motion/SectionTransition.tsx) productized via [`SectionShell`](components/layout/SectionShell.tsx) — where `scale → blur → opacity → translateZ` flies the outgoing panel toward the camera while the next emerges from depth. **Hero**, **About**, **Values**, **Collections**, **Coming Soon** and **Contact** each implement a bespoke rig on the same idiom: the letter-**D** portal, the deep-space beat flight, the word-illumination scrub, and the cool → warm horizontal pan. All read raw scroll via [`useSectionScroll`](hooks/useSectionScroll.ts) and degrade to static layouts under reduced motion.

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

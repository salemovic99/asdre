/**
 * All brand copy in one place. Sections read from here so language stays
 * consistent and easy to revise.
 */

export const BRAND = {
  name: "ASdré",
  tagline: "Made For You",
  heroHeadline: "Designed For Forever.",
  heroSubtitle: "Quiet Luxury Inspired by Switzerland.",
  heroCta: "Explore Our Story",
} as const;

/**
 * The founding story, told as a dark "camera flying through 3D space" journey.
 * The visible per-beat copy lives in About.tsx's BEATS table (presentational);
 * this holds the framing copy, the screen-reader prose, and the finale.
 */
export const ABOUT = {
  index: "01",
  question: "Who are we?",
  heading: "About ASDRÉ",
  a11yStory:
    "ASDRÉ was founded by a Saudi and an Egyptian student who met while studying in Leysin, in the heart of the Swiss Alps. Inspired by Swiss design, timeless style, and exceptional quality, they set out to bring quiet luxury into everyday life. We believe true luxury isn’t defined by loud logos or passing trends. It is defined by timeless design, lasting comfort, and pieces you’ll wear forever. When someone hears ASDRÉ, we want them to picture a feeling — calm, refined, and considered. A brand where quality is felt before it is seen.",
  finale: {
    logo: "Asdré",
    line: "A brand where quality is felt before it is seen.",
    cards: [
      { name: "LÉMAN", subtitle: "Refined everyday essentials.", from: "left" },
      { name: "RIVIERA", subtitle: "Elevated, timeless elegance.", from: "right" },
    ],
  },
} as const;

export const VISION = {
  eyebrow: "Vision",
  question: "Where are we going?",
  statement:
    "To become a global quiet-luxury brand that people build their entire wardrobe around.",
} as const;

/**
 * The countdown chapter — the emotional bridge out of the hero. The timer
 * carries the message; there is almost no copy by design.
 */
export const HOURGLASS = {
  eyebrow: "The Countdown",
  heading: "Craftsmanship cannot be rushed",
  /** The odometer is decorative; this is what assistive tech is told instead. */
  countdownLabel: "A countdown to the beginning of the story, animating as you scroll.",
} as const;

/**
 * The held breath between the hero dive and the founding story. Not a
 * "coming soon" page — a moment of stillness that earns the wait.
 */
export const PATIENCE = {
  eyebrow: "Interlude",
  heading: "We Are In Development",
  line1: "Every timeless masterpiece begins with patience.",
  line2:
    "ASDRÉ is currently crafting every detail with care. True luxury cannot be rushed.",
} as const;

export const MISSION = {
  eyebrow: "Mission",
  question: "Why were we created?",
  statement:
    "To create timeless, high-quality clothing that feels luxurious in everyday life —",
  pillars: ["Simplicity", "Comfort", "Refinement", "Authentic connection"],
} as const;

export const VALUES = {
  eyebrow: "Values",
  question: "What do we believe?",
  value: {
    title: "Attention to Detail",
    body: "Every seam, every fabric, every finish — considered. The difference you feel before you can name it.",
  },
} as const;

export interface Collection {
  name: string;
  index: string;
  tagline: string;
  description: string;
  palette: string;
  notes: string[];
  tone: "cool" | "warm";
}

export const COLLECTIONS: Collection[] = [
  {
    name: "LÉMAN",
    index: "I",
    tagline: "Refined everyday essentials.",
    description:
      "Inspired by Switzerland — glass, mountains, and the clarity of morning light.",
    palette: "Cool tones · glass · alpine calm",
    notes: ["Morning light", "Still water", "Snow-clean lines"],
    tone: "cool",
  },
  {
    name: "RIVIERA",
    index: "II",
    tagline: "Elevated pieces inspired by timeless elegance.",
    description:
      "Mediterranean luxury — warm sunset, golden light, and the reflection of the sea.",
    palette: "Warm tones · gold · coastal ease",
    notes: ["Golden hour", "Sea reflections", "Sun-warmed stone"],
    tone: "warm",
  },
];

export const COMING_SOON = {
  eyebrow: "Coming Soon",
  headline: "We’re crafting something timeless.",
  body: [
    "ASDRÉ is currently in development as we carefully refine every detail of our collections and brand experience.",
    "We believe true luxury cannot be rushed, and we’re committed to launching only when everything reflects the quality and standards we stand for.",
    "Thank you for your patience — we can’t wait to welcome you soon.",
  ],
} as const;

export const CONTACT = {
  eyebrow: "Contact",
  question: "Why should you care?",
  lead: "Let’s talk.",
  location: "Riyadh",
  emails: ["Waleed@Asdré.com", "Faisal@Asdré.com", "Info@Asdré.com"],
  closing: "Welcome to ASDRÉ.",
} as const;

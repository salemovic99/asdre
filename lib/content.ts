/**
 * All brand copy in one place. Sections read from here so language stays
 * consistent and easy to revise.
 */

export const BRAND = {
  name: "ASDRÉ",
  tagline: "Made For You",
  heroHeadline: "Designed For Forever.",
  heroSubtitle: "Quiet Luxury Inspired by Switzerland.",
  heroCta: "Explore Our Story",
} as const;

export const ABOUT = {
  index: "01",
  question: "Who are we?",
  heading: "About ASDRÉ",
  /** The founding story, told one cinematic line at a time. */
  lines: [
    { text: "ASDRÉ was founded by a Saudi and an Egyptian student." },
    { text: "They met while studying in Leysin, nestled in the heart of the Swiss Alps." },
    { text: "Inspired by Swiss design, timeless style, and exceptional craftsmanship…" },
    { text: "They set out to create a brand that brings quiet luxury into everyday life." },
    { text: "We believe true luxury isn’t defined by loud logos or passing trends." },
    { text: "It is defined by timeless design, lasting comfort, and pieces you’ll wear forever." },
    { text: "When someone hears ASDRÉ…" },
    { text: "We don’t want them to picture a logo." },
    { text: "We want them to picture a feeling." },
    { text: "Calm.", accent: true },
    { text: "Refined.", accent: true },
    { text: "Considered.", accent: true },
    { text: "A brand where quality is felt before it is seen." },
  ],
  /** The permanent finale — two collections revealed from opposite sides. */
  finale: [
    { name: "LÉMAN", subtitle: "Refined everyday essentials.", from: "left" },
    { name: "RIVIERA", subtitle: "Elevated, timeless elegance.", from: "right" },
  ],
} as const;

export const VISION = {
  eyebrow: "Vision",
  question: "Where are we going?",
  statement:
    "To become a global quiet-luxury brand that people build their entire wardrobe around.",
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
  location: "Riyadh",
  emails: ["Waleed@Asdré.com", "Faisal@Asdré.com", "Info@Asdré.com"],
  closing: "Welcome to ASDRÉ.",
} as const;

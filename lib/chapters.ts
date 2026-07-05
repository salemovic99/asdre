/**
 * The single source of truth for the story's chapters, in scroll order.
 * Drives the navigation, the progress indicator, and the ambient
 * per-chapter background environment.
 */

export type ChapterId =
  | "hero"
  | "about"
  | "vision"
  | "mission"
  | "values"
  | "collections"
  | "coming-soon"
  | "contact";

export interface Chapter {
  id: ChapterId;
  /** Two-digit index shown as a mono label, e.g. "01". */
  index: string;
  /** Short nav / progress label. */
  label: string;
  /** The single question this chapter answers. */
  question: string;
  /** Ambient environment tone: light warm-white or a dark immersive room. */
  tone: "light" | "dark";
}

export const CHAPTERS: Chapter[] = [
  { id: "hero", index: "00", label: "Enter", question: "Welcome to ASDRÉ.", tone: "light" },
  { id: "about", index: "01", label: "About", question: "Who are we?", tone: "light" },
  { id: "vision", index: "02", label: "Vision", question: "Where are we going?", tone: "light" },
  { id: "mission", index: "03", label: "Mission", question: "Why were we created?", tone: "light" },
  { id: "values", index: "04", label: "Values", question: "What do we believe?", tone: "light" },
  {
    id: "collections",
    index: "05",
    label: "Collections",
    question: "What do we create?",
    tone: "light",
  },
  {
    id: "coming-soon",
    index: "06",
    label: "Coming Soon",
    question: "What comes next?",
    tone: "dark",
  },
  { id: "contact", index: "07", label: "Contact", question: "Why should you care?", tone: "light" },
];

/** Chapters that appear in the nav (Hero/Enter is the top, reachable via logo). */
export const NAV_CHAPTERS = CHAPTERS.filter((c) => c.id !== "hero");

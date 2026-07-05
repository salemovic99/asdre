"use client";

import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { ChapterNav } from "@/components/navigation/ChapterNav";
import { ChapterProgress } from "@/components/navigation/ChapterProgress";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Vision } from "@/components/sections/Vision";
import { Mission } from "@/components/sections/Mission";
import { Values } from "@/components/sections/Values";
import { Collections } from "@/components/sections/Collections";
import { ComingSoon } from "@/components/sections/ComingSoon";
import { Contact } from "@/components/sections/Contact";

/**
 * The single client tree for the entire ASDRÉ experience: living background,
 * fixed wayfinding, and the eight story chapters composed in scroll order.
 */
export function StoryExperience() {
  return (
    <>
      <AmbientBackground />
      <ScrollProgress />
      <ChapterNav />
      <ChapterProgress />

      <main id="story" className="relative">
        <Hero />
        <About />
        <Vision />
        <Mission />
        <Values />
        <Collections />
        <ComingSoon />
        <Contact />
      </main>
    </>
  );
}

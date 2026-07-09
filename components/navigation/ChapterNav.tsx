"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_CHAPTERS } from "@/lib/chapters";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ReduceMotionToggle } from "@/components/navigation/ReduceMotionToggle";

/**
 * Minimal sticky top bar: brand wordmark + motion toggle + a menu that opens
 * the full chapter index. Transparent over the hero, settling into glass once
 * the story begins.
 */
export function ChapterNav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-[68] transition-colors duration-500",
        scrolled
          ? "border-b border-border/50 bg-background/60 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-10">
        <a
          href="#hero"
          aria-label="Asdré — top of story"
          className="font-logo text-3xl font-normal leading-none tracking-normal text-foreground transition-opacity hover:opacity-70"
        >
          Asdré
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <ReduceMotionToggle />

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  className="h-9 gap-2 rounded-full px-3 text-xs font-medium uppercase tracking-[0.2em] text-foreground/80 hover:text-foreground"
                />
              }
            >
              <Menu className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Menu</span>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-full gap-0 border-border/60 bg-background/95 backdrop-blur-2xl sm:max-w-md"
            >
              <SheetHeader className="p-8 pb-4">
                <SheetTitle className="font-logo text-2xl tracking-normal">
                  Asdré
                </SheetTitle>
                <SheetDescription className="font-mono text-[11px] uppercase tracking-[0.3em]">
                  The Chapters
                </SheetDescription>
              </SheetHeader>

              <nav aria-label="Chapters" className="flex flex-col px-4 pb-8">
                {NAV_CHAPTERS.map((chapter) => (
                  <SheetClose
                    key={chapter.id}
                    render={
                      <a
                        href={`#${chapter.id}`}
                        className="group flex items-baseline gap-4 rounded-2xl px-4 py-4 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                      />
                    }
                  >
                    <span className="font-mono text-xs tracking-[0.3em] text-brand">
                      {chapter.index}
                    </span>
                    <span className="flex flex-col">
                      <span className="font-serif text-xl text-foreground">
                        {chapter.label}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {chapter.question}
                      </span>
                    </span>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}

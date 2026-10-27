import type { Metadata } from "next";
import { moments } from "@/content/lifestyle";
import { Section } from "@/components/layout/section";
import { MarginNotes } from "@/components/torch/marginalia";
import { Gallery } from "@/components/lifestyle/gallery";

export const metadata: Metadata = {
  title: "The Gazette of Moments",
  description: "A roll of captured instants, culinary adventures and creative endeavours.",
};

export default function LifestylePage() {
  return (
    <main className="py-6">
      <Section
        title="Personal Chronicles"
        heading="THE GAZETTE OF MOMENTS"
        tagline="A curated collection of captured instants, culinary adventures, and creative endeavors from my personal chronicle"
        decorativeText="LIFE"
        headingAs="h1"
      >
        <MarginNotes
          notes={[
            { at: { top: "0.5rem", left: "0" }, rotate: -5, font: "hand", children: "Roll 14 · two frames missing" },
            { at: { top: "4rem", right: "0" }, rotate: 3, font: "mono", size: "text-xs", hue: "blue", children: "SURVEILLANCE · OFF THE BOOKS" },
            { at: { top: "20rem", left: "0" }, rotate: 4, font: "hand", hue: "violet", children: "the photographer is the subject" },
            { at: { top: "40rem", right: "0" }, rotate: -3, font: "hand", children: "check the timestamps · they lie" },
            { at: { bottom: "12rem", left: "0.5rem" }, rotate: 6, font: "hand", hue: "violet", children: "↗ frame 23 · who took this?" },
            { at: { bottom: "3rem", right: "1rem" }, rotate: -2, font: "mono", size: "text-xs", hue: "blue", children: "DEVELOPER · D-76 · 8 MIN · REUSED" },
          ]}
        />
        <Gallery moments={moments} />
      </Section>
    </main>
  );
}

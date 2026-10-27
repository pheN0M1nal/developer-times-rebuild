import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { MarginNotes } from "@/components/torch/marginalia";
import { WatchFace } from "@/components/desk/pomodoro/watch-face";
import { DeskBack } from "@/components/desk/desk-back";

export const metadata: Metadata = {
  title: "Pocket-Watch Pomodoro",
  description: "Twenty-five minutes of inquiry, five of recess, a long pause after the fourth round — and a chime when the hand comes round.",
};

export default function PomodoroPage() {
  return (
    <main className="py-6">
      <DeskBack no="002" />
      <Section
        title="Investigation Bureau • Internal Apparatus"
        heading="Pocket-Watch Pomodoro"
        tagline="Strikes the hour for the focused inquirer — twenty-five minutes of inquiry, five of recess, with a long pause after the fourth round."
        decorativeText="WATCH"
        headingAs="h1"
      >
        <MarginNotes
          notes={[
            { at: { top: "1rem", left: "0" }, rotate: -5, font: "hand", children: "the watch runs slow when used right" },
            { at: { top: "6rem", right: "0" }, rotate: 3, font: "mono", size: "text-xs", hue: "blue", children: "SYNCED · GMT · OFF BY 2 SEC" },
            { at: { top: "16rem", left: "0" }, rotate: 4, font: "hand", hue: "violet", children: "tick · they synchronize too" },
            { at: { bottom: "8rem", right: "0" }, rotate: -4, font: "hand", children: "↘ don't look away yet" },
            { at: { bottom: "2rem", left: "0" }, rotate: 3, font: "mono", size: "text-xs", hue: "blue", children: "KEEP THE WATCH WOUND · ALWAYS" },
          ]}
        />
        <WatchFace />
        <p className="mt-6 text-center font-serif italic text-sm text-muted-foreground">
          Leave this page and the watch follows you in the corner. Close the tab and it keeps time anyway — it remembers when it was started.
        </p>
      </Section>
    </main>
  );
}

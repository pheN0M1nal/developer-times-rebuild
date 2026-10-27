import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { MarginNotes } from "@/components/torch/marginalia";
import { WirelessSet } from "@/components/desk/wireless/wireless-set";
import { DeskBack } from "@/components/desk/desk-back";

export const metadata: Metadata = {
  title: "The Bureau Wireless",
  description: "A 1930s valve receiver for the Detective's Desk — tune the band by hand, watch the meters, and let the room fill in around you.",
};

export default function WirelessPage() {
  return (
    <main className="py-6">
      <DeskBack no="003" />
      <Section
        title="Investigation Bureau • Internal Apparatus"
        heading="The Bureau Wireless"
        tagline="A valve receiver of the period: hand-tuned across the band, metered at the output, and honest about the hiss between stations."
        decorativeText="WAVES"
        className="max-w-6xl"
        headingAs="h1"
      >
        <MarginNotes
          notes={[
            { at: { top: "1rem", left: "0" }, rotate: -5, font: "hand", children: "the eye closes when you're on it" },
            { at: { top: "6rem", right: "0" }, rotate: 3, font: "mono", size: "text-xs", hue: "blue", children: "MAINS 230V · 50 c/s · EARTH TO PIPE" },
            { at: { top: "22rem", left: "0" }, rotate: 4, font: "hand", hue: "violet", children: "something answers on 118" },
            { at: { top: "40rem", right: "0" }, rotate: -4, font: "hand", children: "↙ valves warm · then it listens back" },
            { at: { bottom: "14rem", left: "0" }, rotate: 3, font: "hand", hue: "violet", children: "who tuned it away from Jazz Hour?" },
            { at: { bottom: "4rem", right: "0" }, rotate: -2, font: "mono", size: "text-xs", hue: "blue", children: "DO NOT LEAVE IT ON OVERNIGHT" },
          ]}
        />
        <WirelessSet />
      </Section>
    </main>
  );
}

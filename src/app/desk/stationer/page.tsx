import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Cabinet } from "@/components/desk/stationer/cabinet";
import { DeskBack } from "@/components/desk/desk-back";

export const metadata: Metadata = {
  title: "The Stationer's Cabinet",
  description: "Set a letter in one of four hands, engross a deed of gift, or lay out a posy sheet from a drawer of eighteen pressed specimens.",
};

export default function StationerPage() {
  return (
    <main className="py-6">
      <div className="print:hidden">
        <DeskBack no="006" />
      </div>
      <Section
        title="Investigation Bureau • Stationery Cupboard"
        heading="The Stationer's Cabinet"
        tagline="Set a letter in one of four hands, engross a deed of gift, or lay out a posy sheet from the specimen drawer — and take any of them away as paper."
        decorativeText="PRESS"
        className="max-w-6xl print:max-w-none"
        headingAs="h1"
      >
        <Cabinet />
      </Section>
    </main>
  );
}

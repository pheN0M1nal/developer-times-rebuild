import type { Metadata } from "next";
import { peaks, records } from "@/content/records";
import { VinylJournal } from "@/components/locker/vinyl-journal";

export const metadata: Metadata = {
  title: "Vinyl Records | The Evidence Locker",
  description: "Records from the Evidence Locker — catalogued, annotated, and open for listening. Some are still sealed.",
};

export default function VinylPage() {
  // Waveform peaks are computed here, at build time, and shipped as data.
  const wave = Object.fromEntries(records.map((r) => [r.id, peaks(r)]));
  return (
    <main className="py-8">
      <VinylJournal peaks={wave} />
    </main>
  );
}

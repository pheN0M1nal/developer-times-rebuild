import type { Metadata } from "next";
import { Turntable } from "@/components/desk/turntable/turntable";
import { DeskBack } from "@/components/desk/desk-back";

export const metadata: Metadata = {
  title: "The Turntable",
  description: "A full-screen turntable with generated surface noise, a tonearm you can drag, and a rack of listener-supported stations.",
};

export default function TurntablePage() {
  return (
    <main className="py-6">
      <DeskBack no="004" />
      <div className="mx-auto mt-8 max-w-[1400px] px-4 sm:px-8">
        <Turntable />
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import { Darkroom } from "@/components/desk/darkroom/darkroom";
import { DeskBack } from "@/components/desk/desk-back";

export const metadata: Metadata = {
  title: "The Darkroom",
  description: "Develop a photograph on seventeen film stocks from 1904 to 2009, set the strength, and print it at full resolution. Nothing is uploaded.",
};

export default function DarkroomPage() {
  return (
    <main className="py-6">
      <DeskBack no="005" />
      <div className="mx-auto mt-8 max-w-[1400px] px-4 sm:px-8">
        <Darkroom />
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import { TextureLab } from "@/components/locker/lab";

export const metadata: Metadata = {
  title: "Texture Lab | The Evidence Locker",
  description: "Material reference for the Evidence Locker: surfaces, edges, ink, fittings and motion.",
  robots: { index: false },
};

export default function LabPage() {
  return (
    <main className="py-10">
      <TextureLab />
    </main>
  );
}

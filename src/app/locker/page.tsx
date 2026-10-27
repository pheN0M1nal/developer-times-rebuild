import type { Metadata } from "next";
import { LockerHub } from "@/components/locker/hub";

export const metadata: Metadata = {
  title: "The Evidence Locker",
  description: "A catalog of recovered materials: case files, exhibits, audio evidence, incident reports and the archive behind them.",
};

export default function LockerPage() {
  return (
    <main className="py-8">
      <LockerHub />
    </main>
  );
}

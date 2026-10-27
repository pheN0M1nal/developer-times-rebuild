import type { Metadata } from "next";
import { PostcardJournal } from "@/components/locker/postcard-journal";

export const metadata: Metadata = {
  title: "Postcards | The Evidence Locker",
  description: "Postcards from the Evidence Locker — catalogued, annotated, and open for reading.",
};

export default function PostcardsPage() {
  return (
    <main className="py-8">
      <PostcardJournal />
    </main>
  );
}

import type { Metadata } from "next";
import { PostRoom } from "@/components/desk/stationer/post-room";

export const metadata: Metadata = {
  title: "A letter",
  description: "A letter written at the stationer's cabinet and sent as a link. It lives in the link and nowhere else.",
  robots: { index: false },
};

export default function PostPage() {
  return (
    <main className="px-4 py-16">
      <p className="text-center type-label text-[0.62rem] text-muted-foreground tracking-[0.4em]">The Post Room</p>
      <div className="mt-10">
        <PostRoom />
      </div>
    </main>
  );
}

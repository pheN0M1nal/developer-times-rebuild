"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {}
      }}
      className="type-label text-[0.6rem] text-[#b9ad95] hover:text-white cursor-pointer"
    >
      {done ? "Copied" : label}
    </button>
  );
}

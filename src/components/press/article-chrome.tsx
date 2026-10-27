"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Share row: plain links to the networks, plus copy-to-clipboard. */
export function ShareRow({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => setUrl(window.location.href), []);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const item = "border border-foreground/60 px-2 py-1 font-grotesk text-[0.65rem] uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors cursor-pointer";
  return (
    <div className="flex flex-wrap gap-2">
      <a className={item} href={`https://twitter.com/intent/tweet?url=${u}&text=${t}`} target="_blank" rel="noreferrer">
        Twitter
      </a>
      <a className={item} href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noreferrer">
        LinkedIn
      </a>
      <a className={item} href={`https://www.reddit.com/submit?url=${u}&title=${t}`} target="_blank" rel="noreferrer">
        Reddit
      </a>
      <button
        type="button"
        className={item}
        aria-label="Copy link to clipboard"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {}
        }}
      >
        {copied ? "Copied" : "Copy Link"}
      </button>
    </div>
  );
}

/** Contents built from the article's own h2s, with the current one marked. */
export function TableOfContents({ target }: { target: string }) {
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const root = document.getElementById(target);
    if (!root) return;
    const hs = Array.from(root.querySelectorAll("h2[id]")) as HTMLElement[];
    setItems(hs.map((h) => ({ id: h.id, text: h.textContent ?? "" })));
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    hs.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [target]);

  if (!items.length) return null;
  return (
    <nav aria-label="Contents" className="border-l border-foreground/15 pl-4">
      <button type="button" className="lg:cursor-default flex w-full items-center justify-between font-grotesk text-xs uppercase tracking-widest" onClick={() => setOpen((o) => !o)}>
        Contents <span className="lg:hidden">{open ? "−" : "+"}</span>
      </button>
      <ul className={cn("mt-3 space-y-2.5 font-grotesk text-sm", open ? "block" : "hidden lg:block")}>
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className={cn("block pl-3 transition-colors", active === i.id ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
              {i.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

import Link from "next/link";
import { persona } from "@/content/site";

export const metadata = { title: "Page Not Found" };

export default function NotFound() {
  const year = new Date().getFullYear();
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center border-y-4 border-double border-foreground/70 py-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Evening Dispatch • Est. {year} • Special Bulletin
        </p>
        <h1 className="font-serif font-black text-4xl md:text-6xl mt-2">THE DEVELOPER TIMES</h1>
      </div>
      <p className="mt-10 text-center font-serif text-xl tracking-[0.4em] text-[var(--rust)]">EXTRA! EXTRA!</p>
      <h2 className="mt-4 text-center font-serif font-bold text-3xl md:text-5xl leading-tight">MYSTERIOUS PAGE DISAPPEARS</h2>
      <p className="mt-3 text-center font-serif italic text-muted-foreground">Breaking: Link Vanishes Without a Trace</p>
      <div className="mt-10 md:columns-2 gap-10 font-sans text-[0.95rem] leading-relaxed text-foreground/85 [column-rule:1px_solid_color-mix(in_oklab,var(--foreground)_20%,transparent)]">
        <p className="drop-cap">
          In the shadowy alleys of the internet, a lone hyperlink was last seen heading towards the archives. Witnesses claim it was swallowed by the
          void — a glitch in the great server migration, or perhaps the cunning work of rogue code.
        </p>
        <p className="mt-4">
          “It&apos;s unlike any case I&apos;ve cracked,” reported Chief Inspector <span className="font-mono">Debug</span>. “No warning. No digital
          crumbs. Just pure nothingness.” The desk sergeant has filed it under unsolved, between the missing semicolon of 2019 and the cache that
          never cleared.
        </p>
      </div>
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <Link href="/" className="px-6 py-3 border border-foreground/70 font-serif uppercase tracking-wider text-sm hover:bg-foreground hover:text-background transition-colors">
          ← Return to Front Page
        </Link>
        <a href={`mailto:${persona.email}`} className="px-6 py-3 border border-foreground/30 font-serif uppercase tracking-wider text-sm hover:border-foreground transition-colors">
          Contact the Editor
        </a>
      </div>
      <p className="mt-12 text-center font-serif italic text-xs text-muted-foreground">
        Editor&apos;s Note: This edition went to press with the mystery unsolved. The hunt continues...
      </p>
    </main>
  );
}

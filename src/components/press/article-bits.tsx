import { Highlighter } from "@/components/ui/highlighter";
import { asset } from "@/lib/utils";

export function Figure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-10">
      <div className="border border-foreground/30 p-2 bg-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(src)} alt={alt} className="w-full h-auto grayscale-[30%] sepia-[20%]" loading="lazy" />
      </div>
      {caption && <figcaption className="mt-2 text-center font-serif italic text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

export function Underline({ children, iterations = 2 }: { children: React.ReactNode; iterations?: number }) {
  return (
    <Highlighter action="underline" color="#c2410c" iterations={iterations} strokeWidth={1.6} padding={1}>
      {children}
    </Highlighter>
  );
}

export function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <aside className="my-10 py-6 border-y-2 border-double border-foreground/40 text-center">
      <p className="font-serif italic text-2xl md:text-3xl leading-snug text-foreground">“{children}”</p>
    </aside>
  );
}

export function Evidence({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="my-8 border border-dashed border-foreground/40 p-5 bg-foreground/[0.02]">
      <div className="type-label text-[0.6rem] text-muted-foreground mb-2">{title}</div>
      <div className="font-sans text-sm text-foreground/85 leading-relaxed [&_p]:my-2">{children}</div>
    </div>
  );
}

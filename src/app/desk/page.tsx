import Link from "next/link";
import type { Metadata } from "next";
import { tools } from "@/content/desk";
import { Section } from "@/components/layout/section";
import { MarginNotes } from "@/components/torch/marginalia";
import { ToolIcon } from "@/components/desk/tool-icon";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "The Detective's Desk",
  description: "Six working instruments: an invoice apparatus, a pocket-watch Pomodoro, a valve wireless, a turntable, a darkroom and a stationer's cabinet. All of them run in the browser.",
};

export default function DeskPage() {
  return (
    <main className="py-6">
      <Section
        title="Investigation Bureau • Est. 2019 • Volume IV"
        heading="The Detective's Desk"
        tagline="A bench of working apparatus for focused inquiry — a valve wireless, a turntable, a darkroom, a pocket-watch Pomodoro, a stationer's cabinet and an issuing machine for invoices."
        decorativeText="DESK"
        className="max-w-6xl"
        headingAs="h1"
      >
        <MarginNotes
          notes={[
            { at: { top: "0.5rem", left: "0" }, rotate: -5, font: "hand", children: "who has the cabinet key?" },
            { at: { top: "4rem", right: "0" }, rotate: 3, font: "mono", size: "text-xs", hue: "blue", children: "BUREAU OPEN · ALL HRS · WATCHED" },
            { at: { top: "18rem", right: "-0.5rem" }, rotate: -4, font: "hand", hue: "violet", children: "someone changed the dial" },
            { at: { bottom: "3rem", left: "0" }, rotate: 3, font: "mono", size: "text-xs", hue: "blue", children: "DO NOT DISTURB · NOT ALONE" },
          ]}
        />
        <div className="flex items-baseline justify-between border-b border-foreground/20 pb-3">
          <h2 className="type-label text-foreground/80 tracking-[0.4em]">Available Apparatus</h2>
          <p className="hidden sm:block font-serif italic text-sm text-muted-foreground">{tools.length} instruments · every one of them runs here, in this browser</p>
        </div>
        <ul className="mt-5 grid gap-5 md:grid-cols-6">
          {tools.map((t) => (
            <li key={t.slug} className={cn("md:col-span-2", t.wide && "md:col-span-3")}>
              <Link
                href={`/desk/${t.slug}/`}
                className="group flex h-full flex-col border border-foreground/20 border-t-2 bg-foreground/[0.015] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-18px_#140c04aa]"
                style={{ borderTopColor: t.tint }}
              >
                <div className="flex items-start justify-between">
                  <span className="type-label text-[0.6rem] text-muted-foreground tracking-[0.3em]">Bureau Tool No. {t.no}</span>
                  <span style={{ color: t.tint }}>
                    <ToolIcon kind={t.icon} className="h-10 w-10" />
                  </span>
                </div>
                <h3 className="mt-3 font-serif font-bold text-lg text-foreground">{t.title}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-foreground/80">{t.blurb}</p>
                <p className="mt-3 font-serif italic text-sm text-muted-foreground">{t.aside}</p>
                <div className="mt-auto pt-5 flex items-end justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {t.tags.map((tag) => (
                      <span key={tag} className="border border-foreground/25 px-1.5 py-0.5 font-typewriter text-[0.55rem] uppercase tracking-wider text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="type-label text-[0.6rem] tracking-[0.3em] group-hover:underline" style={{ color: t.tint }}>
                    Open ›
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 border-t border-dotted border-foreground/30 pt-5 font-serif italic text-sm text-muted-foreground">
          Everything on this bench is a working instrument rather than a picture of one. The sound is synthesised or streamed live, and the photographs
          are developed in the page and never leave it.
        </p>
        <p className="mt-2 type-label text-[0.58rem] text-muted-foreground">Bureau open · all hours · unattended</p>
      </Section>
    </main>
  );
}

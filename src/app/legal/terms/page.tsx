import type { Metadata } from "next";
import { persona } from "@/content/site";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Publication Terms",
  description: "How the words, pictures and code in The Developer Times may be used.",
};

function Heading({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <h2 className="mt-10 mb-4 border-b border-foreground/20 pb-3 font-serif font-bold text-xl uppercase tracking-wide">
      {n}. {children}
    </h2>
  );
}

export default function TermsPage() {
  return (
    <main className="py-6">
      <Section
        title={`Legal Department • Est. ${persona.established.year} • Official Notice`}
        heading="PUBLICATION TERMS & CONDITIONS"
        tagline="Official decree regarding the use, reproduction, and distribution of The Developer Times materials"
        decorativeText="LEGAL"
        headingSize="large"
        headingAs="h1"
      >
        <div className="border border-foreground/25 p-6 sm:p-8 font-sans text-[0.95rem] leading-relaxed text-foreground/90">
          <div className="text-center border-b border-foreground/20 pb-5">
            <p className="gilt-rule type-label text-[0.65rem] text-muted-foreground !text-muted-foreground">Notice to Readers • Legal Department</p>
            <p className="mt-3 font-serif tracking-[0.2em] uppercase">Official Legal Notice</p>
            <p className="font-typewriter text-xs text-muted-foreground">The Developer Times Publishing House — Est. {persona.established.year}</p>
          </div>

          <Heading n="I">Copyright &amp; Ownership</Heading>
          <p className="drop-cap text-justify">
            Articles, case studies, photographs and written materials published in The Developer Times belong to their author. This edition is a
            challenge rebuild, and every name, quote and figure in it is a placeholder standing in for the real thing.
          </p>
          <p className="mt-4 text-justify">
            The photographs are generated, the people quoted are invented, and the records on the shelf were never pressed. Any resemblance to
            persons living, dead, or currently on call is entirely coincidental.
          </p>

          <Heading n="II">Kindly Requested</Heading>
          <div className="border border-foreground/20 bg-foreground/[0.04] p-5">
            <p className="type-label text-[0.62rem] text-muted-foreground border-b border-foreground/15 pb-2">Courtesies of the house</p>
            <ul className="mt-3 space-y-2 font-serif">
              {[
                "Quote briefly, and say where the quote came from",
                "Do not present this portfolio, its words or its pictures as your own",
                "Replace the placeholder content before publishing a copy anywhere",
                "Be kind to the SomaFM stations: they are listener supported",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden>✦</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <Heading n="III">Third-Party Material</Heading>
          <p className="text-justify">
            Fonts are used under the SIL Open Font License. Live radio on the desk is streamed from SomaFM and remains theirs; Spotify embeds play
            under Spotify&apos;s own terms. Nothing on the desk uploads your files: invoices, letters and photographs are made in your browser and stay
            there.
          </p>

          <Heading n="IV">Privacy</Heading>
          <p className="text-justify">
            The site keeps a few small notes in your browser&apos;s storage — the theme you chose, whether the torch is lit, which secrets you have
            found, and the state of the pocket-watch. They never leave your device. Clear your site data and the bureau forgets you were here.
          </p>

          <Heading n="V">Correspondence</Heading>
          <p className="text-justify">
            For anything else, write to{" "}
            <a href={`mailto:${persona.email}`} className="underline underline-offset-4">
              {persona.email}
            </a>{" "}
            with the subject line “Legal Inquiry”.
          </p>

          <p className="mt-10 border-t border-foreground/20 pt-5 text-center font-serif italic text-sm text-muted-foreground">
            “Protecting good faith since the dawn of the digital age.” — The Legal Department
          </p>
        </div>
      </Section>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTorch } from "@/components/providers/torch";
import { Highlighter } from "@/components/ui/highlighter";
import { BlurFade } from "@/components/ui/blur-fade";

type Props = {
  id?: string;
  title: React.ReactNode;
  heading: React.ReactNode;
  tagline: React.ReactNode;
  decorativeText: string;
  children?: React.ReactNode;
  className?: string;
  decorativeTextClassName?: string;
  headingSize?: "small" | "large";
  fullWidth?: boolean;
  animateHeader?: boolean;
  headingAs?: "h1" | "h2" | "h3";
};

/**
 * The newspaper section: kicker, headline, italic tagline, a hairline rule,
 * and an enormous faded word set behind it. Under the torch the faded word
 * gets a hand-drawn orange circle.
 */
export function Section({
  id,
  title,
  heading,
  tagline,
  decorativeText,
  children,
  className,
  decorativeTextClassName,
  headingSize = "small",
  fullWidth = false,
  animateHeader = false,
  headingAs,
}: Props) {
  const { torchEnabled } = useTorch();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const H = headingAs ?? (headingSize === "large" ? "h2" : "h3");
  const headingClass = cn(
    "font-bold font-serif text-foreground",
    headingSize === "large" ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl",
  );

  const kicker = <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-grotesk">{title}</div>;
  const head = <H className={headingClass}>{heading}</H>;
  const tag = <div className="text-xs text-muted-foreground mt-2 italic font-serif">“{tagline}”</div>;

  const decorative = (
    <div
      aria-hidden
      className={cn(
        "uppercase absolute leading-none font-bold font-serif text-foreground/10 md:text-foreground/5 -z-10 select-none pointer-events-none",
        "text-[86px] sm:text-[150px] md:text-[200px]",
        fullWidth ? "-top-10 right-0 md:-right-2" : "top-10 sm:top-0 right-0",
        decorativeTextClassName,
      )}
    >
      {mounted && torchEnabled ? (
        <Highlighter action="circle" color="#FF9800" strokeWidth={1.5} animationDuration={600} iterations={2} padding={2}>
          <span>{decorativeText}</span>
        </Highlighter>
      ) : (
        <span>{decorativeText}</span>
      )}
    </div>
  );

  return (
    <section id={id} className={cn("py-12 relative mx-auto", !fullWidth && "max-w-5xl px-4 sm:px-6", className)}>
      <div className={cn("text-center mb-12 border-b border-foreground/20 pb-6", fullWidth && "max-w-3xl mx-auto px-4 sm:px-6 relative")}>
        {animateHeader ? (
          <>
            <BlurFade delay={0.05} duration={0.5}>
              {kicker}
            </BlurFade>
            <BlurFade delay={0.18} duration={0.55}>
              {head}
            </BlurFade>
            <BlurFade delay={0.32} duration={0.5}>
              {tag}
            </BlurFade>
          </>
        ) : (
          <>
            {kicker}
            {head}
            {tag}
          </>
        )}
        {fullWidth && decorative}
      </div>
      {children}
      {!fullWidth && decorative}
    </section>
  );
}

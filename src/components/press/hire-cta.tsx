"use client";

import { useHireMode } from "@/components/providers/hire-mode";
import { persona } from "@/content/site";
import { VintageButton } from "@/components/ui/vintage-button";

/** Shown only in hire mode (`?available=1`). */
export function HireCta() {
  const on = useHireMode();
  if (!on) return null;
  return (
    <div className="mt-10 p-5 border border-foreground/30 bg-background/80 text-center">
      <div className="font-serif text-lg">Need a seasoned engineer for your next investigation?</div>
      <div className="text-sm text-muted-foreground">Payments, product engineering, and calm backends — book a consultation.</div>
      <div className="mt-4">
        <VintageButton asChild variant="default">
          <a href={`mailto:${persona.email}?subject=${encodeURIComponent("A case for the bureau")}`}>Schedule an Interview</a>
        </VintageButton>
      </div>
      <div className="mt-2 text-[10px] sm:text-xs text-muted-foreground font-sans italic">Hot off the press: 20 minutes to headline your idea.</div>
    </div>
  );
}

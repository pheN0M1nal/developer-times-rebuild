import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { MarginNotes } from "@/components/torch/marginalia";
import { InvoiceForm } from "@/components/desk/invoices/invoice-form";
import { DeskBack } from "@/components/desk/desk-back";

export const metadata: Metadata = {
  title: "Casefile Invoices",
  description: "Issue invoices in bureau livery: line items, tax, discount, a logo or a seal, exported as a PDF in your browser.",
};

export default function InvoicesPage() {
  return (
    <main className="py-6">
      <DeskBack no="001" />
      <Section
        title="Investigation Bureau • Internal Ledger"
        heading="Casefile Invoices"
        tagline="A confidential register of work rendered, retainers honoured, and mysteries resolved."
        decorativeText="LEDGER"
        headingAs="h1"
      >
        <MarginNotes
          notes={[
            { at: { top: "1rem", left: "0" }, rotate: -5, font: "hand", children: "client: unnamed · suspicious" },
            { at: { top: "6rem", right: "0" }, rotate: 3, font: "mono", size: "text-xs", hue: "blue", children: "LEDGER · — 1 item · count again" },
            { at: { top: "26rem", left: "0" }, rotate: 4, font: "hand", hue: "violet", children: "↗ verify the totals twice" },
            { at: { bottom: "10rem", right: "0" }, rotate: -3, font: "hand", children: "amount blank · ask why" },
            { at: { bottom: "2rem", left: "30%" }, rotate: 2, font: "mono", size: "text-xs", hue: "blue", children: "RECONCILE · LEDGER PP. 42 · BURN COPY" },
          ]}
        />
        <InvoiceForm />
      </Section>
    </main>
  );
}

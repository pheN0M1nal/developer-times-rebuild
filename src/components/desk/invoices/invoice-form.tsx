"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { playSfx } from "@/lib/audio";
import { cn } from "@/lib/utils";
import { CURRENCIES, blankInvoice, lineTotal, money, totals, type Invoice, type Party } from "./types";

const KEY = "casefile-invoice-v1";

const input =
  "w-full border border-foreground/30 bg-transparent px-3 py-2 font-serif text-[0.95rem] placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground/70";
const label = "mb-1.5 block font-grotesk text-[0.68rem] uppercase tracking-[0.25em] text-foreground/80";

function PartyFields({ title, value, onChange, who }: { title: string; value: Party; onChange: (p: Party) => void; who: string }) {
  const set = (k: keyof Party) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...value, [k]: e.target.value });
  return (
    <fieldset className="space-y-1.5">
      <legend className={label}>{title}</legend>
      <input className={input} placeholder={`${who} name (required)`} value={value.name} onChange={set("name")} aria-label={`${title} name`} />
      <input className={input} placeholder="Company / title (optional)" value={value.company} onChange={set("company")} aria-label={`${title} company`} />
      <input className={input} placeholder="Email (required)" type="email" value={value.email} onChange={set("email")} aria-label={`${title} email`} />
      <input className={input} placeholder="Website (optional)" value={value.website} onChange={set("website")} aria-label={`${title} website`} />
      <textarea className={cn(input, "h-[4.5rem] resize-none")} placeholder="Address / City / Country (optional)" value={value.address} onChange={set("address")} aria-label={`${title} address`} />
    </fieldset>
  );
}

export function InvoiceForm() {
  // Dates are filled in after mount so the static HTML never disagrees with the browser.
  const [inv, setInv] = useState<Invoice>(() => ({ ...blankInvoice(), number: "", issueDate: "" }));
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setInv(raw ? { ...blankInvoice(), ...JSON.parse(raw) } : blankInvoice());
    } catch {
      setInv(blankInvoice());
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(inv));
    } catch {}
  }, [inv, loaded]);

  const t = totals(inv);
  const set = <K extends keyof Invoice>(k: K, v: Invoice[K]) => setInv((x) => ({ ...x, [k]: v }));
  const setLine = (i: number, patch: Partial<Invoice["items"][number]>) =>
    setInv((x) => ({ ...x, items: x.items.map((l, j) => (j === i ? { ...l, ...patch } : l)) }));

  const onLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => set("logo", String(r.result));
    r.readAsDataURL(f);
  };

  const exportPdf = async () => {
    const missing = [!inv.from.name && "your name", !inv.from.email && "your email", !inv.to.name && "the client's name", !inv.to.email && "the client's email"].filter(Boolean);
    if (missing.length) {
      setProblem(`Before it can be issued, fill in ${missing.join(", ")}.`);
      return;
    }
    setProblem(null);
    setBusy(true);
    try {
      const [{ pdf }, { InvoicePdf }] = await Promise.all([import("@react-pdf/renderer"), import("./invoice-pdf")]);
      const blob = await pdf(<InvoicePdf inv={inv} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${inv.number || "invoice"}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      playSfx("stamp", 0.4);
    } catch (err) {
      setProblem(`The press jammed: ${(err as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-typewriter text-xs text-muted-foreground">Kept in this browser only · Nothing is filed anywhere else</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setInv(blankInvoice())} className="border border-foreground/30 px-4 py-2.5 font-serif text-sm uppercase tracking-wider hover:bg-foreground/5 cursor-pointer">
            New Sheet
          </button>
          <button type="button" onClick={exportPdf} disabled={busy} className="bg-foreground px-6 py-3 font-serif text-sm uppercase tracking-wider text-background hover:opacity-90 disabled:opacity-60 cursor-pointer">
            {busy ? "Setting type…" : "Export PDF"}
          </button>
        </div>
      </div>
      {problem && <p className="mt-3 border-l-2 border-[var(--rust)] pl-3 font-serif text-sm text-[var(--rust)]">{problem}</p>}

      <div className="mt-6 border border-foreground/30 p-5 sm:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_1fr_0.85fr]">
          <PartyFields title="Bill From" who="Your" value={inv.from} onChange={(p) => set("from", p)} />
          <PartyFields title="Bill To" who="Client" value={inv.to} onChange={(p) => set("to", p)} />
          <div className="space-y-3">
            <div>
              <label className={label} htmlFor="inv-no">Invoice No.</label>
              <input id="inv-no" className={input} value={inv.number} onChange={(e) => set("number", e.target.value)} placeholder="Invoice ID" />
            </div>
            <div>
              <label className={label} htmlFor="inv-issue">Issue Date</label>
              <input id="inv-issue" type="date" className={input} value={inv.issueDate} onChange={(e) => set("issueDate", e.target.value)} />
            </div>
            <div>
              <label className={label} htmlFor="inv-due">Due Date (optional)</label>
              <input id="inv-due" type="date" className={input} value={inv.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
            </div>
            <div>
              <label className={label} htmlFor="inv-cur">Currency</label>
              <select id="inv-cur" className={input} value={inv.currency} onChange={(e) => set("currency", e.target.value as Invoice["currency"])}>
                {CURRENCIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-foreground/20 pt-6">
          <p className={label}>Scope of Investigation</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="bg-foreground text-background font-serif text-sm">
                  <th className="px-3 py-3 text-left">Description</th>
                  <th className="w-28 px-3 py-3 text-right">Qty / Hours / Days</th>
                  <th className="w-32 px-3 py-3 text-right">Rate ({inv.currency})</th>
                  <th className="w-32 px-3 py-3 text-right">Line Total</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {inv.items.map((l, i) => (
                  <tr key={i} className="border-b border-foreground/15 align-top">
                    <td className="p-2">
                      <textarea className={cn(input, "h-14 resize-none")} placeholder="Description of work" value={l.desc} onChange={(e) => setLine(i, { desc: e.target.value })} aria-label={`Line ${i + 1} description`} />
                    </td>
                    <td className="p-2">
                      <input type="number" min={0} step="0.25" className={cn(input, "text-right")} value={l.qty || ""} placeholder="0" onChange={(e) => setLine(i, { qty: Number(e.target.value) })} aria-label={`Line ${i + 1} quantity`} />
                    </td>
                    <td className="p-2">
                      <input type="number" min={0} step="0.01" className={cn(input, "text-right")} value={l.rate || ""} placeholder="0.00" onChange={(e) => setLine(i, { rate: Number(e.target.value) })} aria-label={`Line ${i + 1} rate`} />
                    </td>
                    <td className="p-2">
                      <div className="border border-foreground/15 px-3 py-2 text-right font-typewriter text-sm">{money(lineTotal(l), inv.currency)}</div>
                    </td>
                    <td className="p-2">
                      {inv.items.length > 1 && (
                        <button type="button" onClick={() => set("items", inv.items.filter((_, j) => j !== i))} className="mt-2 p-1 text-muted-foreground hover:text-[var(--rust)] cursor-pointer" aria-label={`Remove line ${i + 1}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="font-grotesk italic text-xs text-muted-foreground">Add as many lines as needed. Empty lines are left off the printed sheet.</p>
            <button type="button" onClick={() => set("items", [...inv.items, { desc: "", qty: 0, rate: 0 }])} className="inline-flex items-center gap-1.5 font-serif text-sm uppercase tracking-wider hover:underline cursor-pointer">
              <Plus className="h-4 w-4" /> Add Line
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 border-t border-foreground/20 pt-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className={label} htmlFor="inv-notes">Notes to Client</label>
              <textarea id="inv-notes" className={cn(input, "h-20 resize-none")} value={inv.notes} onChange={(e) => set("notes", e.target.value)} />
            </div>
            <div>
              <label className={label} htmlFor="inv-terms">Terms Note (optional)</label>
              <input id="inv-terms" className={input} value={inv.terms} onChange={(e) => set("terms", e.target.value)} />
            </div>
            <div>
              <p className={label}>Branding</p>
              <div className="flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 border border-dashed border-foreground/40 px-4 py-2 font-serif text-sm hover:bg-foreground/5">
                  <Upload className="h-4 w-4" /> {inv.logo ? "Replace logo" : "Logo (optional)"}
                  <input type="file" accept="image/png,image/jpeg,image/svg+xml" className="sr-only" onChange={onLogo} />
                </label>
                {inv.logo && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={inv.logo} alt="Your logo" className="h-10 w-auto border border-foreground/15 bg-white p-1" />
                    <button type="button" onClick={() => set("logo", "")} className="p-1 text-muted-foreground hover:text-foreground cursor-pointer" aria-label="Remove logo">
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
              <p className="mt-1.5 font-grotesk italic text-xs text-muted-foreground">Leave blank to use the default seal.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className={label}>Summary</p>
              <div className="border border-foreground/20 p-4 font-serif">
                <div className="flex justify-between py-1">
                  <span>Subtotal</span>
                  <span className="font-typewriter">
                    {inv.currency} {money(t.subtotal, inv.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <label htmlFor="inv-tax">Tax (optional)</label>
                  <span className="flex items-center gap-1">
                    <input id="inv-tax" type="number" min={0} max={100} className={cn(input, "w-20 py-1 text-right")} value={inv.taxPct || ""} placeholder="0" onChange={(e) => set("taxPct", Number(e.target.value))} />%
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <label htmlFor="inv-disc">Discount (optional)</label>
                  <span className="flex items-center gap-1">
                    <input id="inv-disc" type="number" min={0} max={100} className={cn(input, "w-20 py-1 text-right")} value={inv.discountPct || ""} placeholder="0" onChange={(e) => set("discountPct", Number(e.target.value))} />%
                  </span>
                </div>
                <div className="mt-2 flex justify-between border-t-2 border-foreground pt-2 text-lg font-bold">
                  <span>Total</span>
                  <span className="font-typewriter">
                    {inv.currency} {money(t.total, inv.currency)}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <label className={label} htmlFor="inv-sign">Signature</label>
              <input id="inv-sign" className={cn(input, "font-pen text-2xl")} placeholder={inv.from.name || "Your name, in a pen"} value={inv.signature} onChange={(e) => set("signature", e.target.value)} />
            </div>
            <div>
              <label className={label} htmlFor="inv-remit">Remittance Details</label>
              <textarea id="inv-remit" className={cn(input, "h-20 resize-none font-typewriter text-sm")} placeholder="Bank, account name, reference…" value={inv.remittance} onChange={(e) => set("remittance", e.target.value)} />
            </div>
          </div>
        </div>
        <p className="mt-8 border-t border-dotted border-foreground/30 pt-4 text-center font-typewriter text-[0.65rem] text-muted-foreground">
          Internal use • Casefile Invoices • Generated via The Developer Times desk apparatus
        </p>
      </div>
    </div>
  );
}

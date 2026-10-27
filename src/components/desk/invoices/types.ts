export type Party = { name: string; company: string; email: string; website: string; address: string };
export type Line = { desc: string; qty: number; rate: number };
export type Currency = "USD" | "EUR" | "AUD" | "PKR" | "CAD";

export type Invoice = {
  from: Party;
  to: Party;
  number: string;
  issueDate: string;
  dueDate: string;
  currency: Currency;
  items: Line[];
  notes: string;
  terms: string;
  taxPct: number;
  discountPct: number;
  logo: string; // data URL, never uploaded
  signature: string;
  remittance: string;
};

export const CURRENCIES: Currency[] = ["USD", "EUR", "AUD", "PKR", "CAD"];

const emptyParty: Party = { name: "", company: "", email: "", website: "", address: "" };

export function blankInvoice(): Invoice {
  const d = new Date();
  const iso = d.toISOString().slice(0, 10);
  return {
    from: { ...emptyParty },
    to: { ...emptyParty },
    number: `CF-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-01`,
    issueDate: iso,
    dueDate: "",
    currency: "USD",
    items: [{ desc: "", qty: 0, rate: 0 }],
    notes: "Heartfelt thanks for choosing to work together.",
    terms: "Inclusive of any payment processing or transaction charges.",
    taxPct: 0,
    discountPct: 0,
    logo: "",
    signature: "",
    remittance: "",
  };
}

export const lineTotal = (l: Line) => (Number(l.qty) || 0) * (Number(l.rate) || 0);

export function totals(inv: Invoice) {
  const subtotal = inv.items.reduce((a, l) => a + lineTotal(l), 0);
  const discount = subtotal * ((Number(inv.discountPct) || 0) / 100);
  const tax = (subtotal - discount) * ((Number(inv.taxPct) || 0) / 100);
  return { subtotal, discount, tax, total: subtotal - discount + tax };
}

export function money(n: number, currency: Currency) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: currency === "PKR" ? 0 : 2, maximumFractionDigits: currency === "PKR" ? 0 : 2 }).format(n || 0);
}

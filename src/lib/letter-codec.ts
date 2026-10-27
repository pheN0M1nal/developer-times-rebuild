"use client";

// A sealed letter lives entirely in the link: JSON → deflate-raw →
// base64url, prefixed with a version ("1." compressed, "0." plain).
// It goes in the URL hash, so it is never sent to any server.

export type Hand = "pen" | "pencil" | "typewriter" | "copperplate";

export type Letter = {
  v: 1;
  hand: Hand;
  size: number;
  dateline: string;
  salutation: string;
  to: string;
  body: string;
  valediction: string;
  signed: string;
  deed?: { gift: string };
  posy?: string[]; // specimen ids
  reply?: boolean;
};

function b64url(bytes: Uint8Array) {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string) {
  const b = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));
  const out = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) out[i] = b.charCodeAt(i);
  return out;
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const res = new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream));
  return new Uint8Array(await res.arrayBuffer());
}

export async function encodeLetter(letter: Letter): Promise<string> {
  const raw = new TextEncoder().encode(JSON.stringify(letter));
  if (typeof CompressionStream !== "function") return `0.${b64url(raw)}`;
  try {
    return `1.${b64url(await pipe(raw, new CompressionStream("deflate-raw")))}`;
  } catch {
    return `0.${b64url(raw)}`;
  }
}

export async function decodeLetter(token: string): Promise<Letter | null> {
  try {
    const [v, data] = [token.slice(0, 1), token.slice(2)];
    let bytes = fromB64url(data);
    if (v === "1") bytes = await pipe(bytes, new DecompressionStream("deflate-raw"));
    const obj = JSON.parse(new TextDecoder().decode(bytes));
    return obj && obj.v === 1 ? (obj as Letter) : null;
  } catch {
    return null;
  }
}

export const HANDS: { id: Hand; label: string; note: string; font: string; scale: number }[] = [
  { id: "pen", label: "Pen", note: "An ordinary hand, and the one to use for a letter", font: "var(--font-caveat)", scale: 1.25 },
  { id: "pencil", label: "Pencil", note: "Soft, quick, and a little slanted — for notes not meant to last", font: "var(--font-pencil)", scale: 1.05 },
  { id: "typewriter", label: "Typewriter", note: "The office machine, ribbon going grey", font: "var(--font-worn)", scale: 0.9 },
  { id: "copperplate", label: "Copperplate", note: "The formal hand, for deeds and declarations", font: "var(--font-pen)", scale: 1.3 },
];

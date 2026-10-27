import localFont from "next/font/local";

// Every face is self-hosted from src/fonts (SIL Open Font License), so the
// build never needs to reach a font CDN.

export const playfair = localFont({
  variable: "--font-playfair",
  display: "swap",
  src: [
    { path: "../fonts/playfair-display-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/playfair-display-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/playfair-display-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/playfair-display-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../fonts/playfair-display-latin-700-italic.woff2", weight: "700", style: "italic" },
    { path: "../fonts/playfair-display-latin-800-normal.woff2", weight: "800", style: "normal" },
    { path: "../fonts/playfair-display-latin-900-normal.woff2", weight: "900", style: "normal" },
  ],
});

export const baskerville = localFont({
  variable: "--font-baskerville",
  display: "swap",
  src: [
    { path: "../fonts/libre-baskerville-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/libre-baskerville-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/libre-baskerville-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

export const courier = localFont({
  variable: "--font-courier",
  display: "swap",
  src: [
    { path: "../fonts/courier-prime-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/courier-prime-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/courier-prime-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

export const geistMono = localFont({
  variable: "--font-geist-mono",
  display: "swap",
  src: [
    { path: "../fonts/GeistMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/GeistMono-Medium.woff2", weight: "500", style: "normal" },
  ],
});

export const kalam = localFont({
  variable: "--font-kalam",
  display: "swap",
  preload: false,
  src: [
    { path: "../fonts/kalam-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../fonts/kalam-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/kalam-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

export const caveat = localFont({
  variable: "--font-caveat-face",
  display: "swap",
  preload: false,
  src: [
    { path: "../fonts/caveat-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/caveat-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/caveat-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/caveat-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

export const specialElite = localFont({
  variable: "--font-special-elite",
  display: "swap",
  preload: false,
  src: [{ path: "../fonts/special-elite-latin-400-normal.woff2", weight: "400", style: "normal" }],
});

export const pinyon = localFont({
  variable: "--font-pinyon",
  display: "swap",
  preload: false,
  src: [{ path: "../fonts/pinyon-script-latin-400-normal.woff2", weight: "400", style: "normal" }],
});

export const dancing = localFont({
  variable: "--font-dancing",
  display: "swap",
  preload: false,
  src: [
    { path: "../fonts/dancing-script-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/dancing-script-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/dancing-script-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

export const laBelleAurore = localFont({
  variable: "--font-belle-aurore",
  display: "swap",
  preload: false,
  src: [{ path: "../fonts/la-belle-aurore-latin-400-normal.woff2", weight: "400", style: "normal" }],
});

export const amiri = localFont({
  variable: "--font-amiri",
  display: "swap",
  preload: false,
  src: [
    { path: "../fonts/amiri-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/amiri-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/amiri-arabic-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

export const fontVariables = [
  playfair,
  baskerville,
  courier,
  geistMono,
  kalam,
  caveat,
  specialElite,
  pinyon,
  dancing,
  laBelleAurore,
  amiri,
]
  .map((f) => f.variable)
  .join(" ");

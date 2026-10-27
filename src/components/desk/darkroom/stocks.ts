// Seventeen film stocks, 1904–2009. Names are generic descriptions, not
// trademarks; every look is a handful of numbers run through develop().

export type Curve = [number, number][]; // points in 0..1

export type Stock = {
  id: string;
  name: string;
  year: number;
  note: string;
  mono?: [number, number, number]; // channel weights for black & white
  tone?: [number, number, number]; // multiply after the curves
  saturation?: number;
  curves?: { r?: Curve; g?: Curve; b?: Curve; rgb?: Curve };
  fade?: number; // lifts the blacks
  halation?: { threshold: number; radius: number; amount: number; tint: [number, number, number] };
  grain?: { amount: number; size: number };
  vignette?: number;
  frame?: "instant";
};

/** An S-curve of the given strength. */
const s = (k: number): Curve => [
  [0, 0],
  [0.25, 0.25 - k],
  [0.75, 0.75 + k],
  [1, 1],
];

export const STOCKS: Stock[] = [
  { id: "bromide", name: "Bromide", year: 1904, note: "Warm-black paper print; soft shoulders", mono: [0.3, 0.55, 0.15], tone: [1.06, 0.98, 0.84], curves: { rgb: s(0.04) }, fade: 0.05, grain: { amount: 0.07, size: 1.8 }, vignette: 0.35 },
  { id: "ortho", name: "Orthochromatic", year: 1912, note: "Blind to red: skies white, lips dark", mono: [0.04, 0.4, 0.56], curves: { rgb: s(0.07) }, grain: { amount: 0.08, size: 1.6 }, vignette: 0.3 },
  { id: "nitrate", name: "Nitrate", year: 1926, note: "Hard silver, blown highlights, a glow round the lamps", mono: [0.33, 0.47, 0.2], curves: { rgb: s(0.11) }, halation: { threshold: 0.78, radius: 5, amount: 0.22, tint: [1, 1, 1] }, grain: { amount: 0.07, size: 1.7 }, vignette: 0.25 },
  { id: "two-strip", name: "Two-Strip", year: 1935, note: "Red and cyan only — every green goes to slate", tone: [1, 0.9, 0.92], saturation: 0.85, curves: { r: [[0, 0.02], [0.5, 0.55], [1, 1]], g: [[0, 0.04], [0.5, 0.42], [1, 0.88]], b: [[0, 0.06], [0.5, 0.46], [1, 0.86]], rgb: s(0.05) }, grain: { amount: 0.05, size: 1.6 } },
  { id: "three-strip", name: "Three-Strip", year: 1939, note: "Dye-transfer colour, louder than life", saturation: 1.55, curves: { r: [[0, 0], [0.5, 0.52], [1, 1]], b: [[0, 0.04], [0.15, 0.16], [0.5, 0.5], [1, 1]], rgb: s(0.12) }, halation: { threshold: 0.72, radius: 8, amount: 0.26, tint: [1, 0.82, 0.62] }, grain: { amount: 0.05, size: 1.6 } },
  { id: "newsprint", name: "Newsprint", year: 1948, note: "Wire-photo grey, coarse as the paper it ran on", mono: [0.3, 0.59, 0.11], curves: { rgb: s(0.14) }, fade: 0.08, tone: [1, 0.98, 0.93], grain: { amount: 0.16, size: 2.6 }, vignette: 0.2 },
  { id: "slide", name: "Slide 25", year: 1955, note: "Deep reds, dense blacks, the holiday projector", saturation: 1.3, tone: [1.04, 1, 0.94], curves: { rgb: s(0.1), b: [[0, 0], [0.5, 0.47], [1, 0.96]] }, grain: { amount: 0.03, size: 1.2 }, vignette: 0.2 },
  { id: "peel-apart", name: "Peel-Apart", year: 1963, note: "Instant colour, cyan in the shadows", saturation: 0.9, curves: { b: [[0, 0.12], [0.5, 0.52], [1, 0.95]], g: [[0, 0.06], [1, 0.98]], rgb: s(0.03) }, fade: 0.06, grain: { amount: 0.04, size: 1.4 }, vignette: 0.25 },
  { id: "square-instant", name: "Square Instant", year: 1972, note: "Milky blacks, warm skin, a frame you can write on", saturation: 0.85, tone: [1.06, 1.0, 0.88], curves: { rgb: [[0, 0.1], [0.5, 0.52], [1, 0.94]] }, fade: 0.08, grain: { amount: 0.04, size: 1.5 }, vignette: 0.3, frame: "instant" },
  { id: "sun-faded", name: "Sun-Faded", year: 1977, note: "Left on the dashboard all summer: magenta and lemon", saturation: 0.7, tone: [1.08, 0.96, 0.9], curves: { r: [[0, 0.12], [1, 1]], b: [[0, 0.1], [1, 0.86]] }, fade: 0.14, grain: { amount: 0.05, size: 1.6 } },
  { id: "gold", name: "Gold 200", year: 1984, note: "Drugstore colour negative, warm and forgiving", saturation: 1.1, tone: [1.06, 1.02, 0.9], curves: { rgb: s(0.04) }, grain: { amount: 0.05, size: 1.5 }, vignette: 0.18 },
  { id: "single-use", name: "Single Use", year: 1989, note: "Plastic lens, on-camera flash, dark corners", saturation: 1.2, curves: { rgb: s(0.08) }, halation: { threshold: 0.8, radius: 4, amount: 0.14, tint: [1, 0.9, 0.8] }, grain: { amount: 0.08, size: 1.8 }, vignette: 0.6 },
  { id: "poolside", name: "Poolside", year: 1995, note: "Teal water, cream concrete, a long afternoon", saturation: 1.05, tone: [0.96, 1.02, 1.04], curves: { r: [[0, 0.04], [0.5, 0.5], [1, 0.97]], g: [[0, 0.05], [1, 1]], b: [[0, 0.1], [0.5, 0.55], [1, 1]] }, fade: 0.05, grain: { amount: 0.04, size: 1.4 } },
  { id: "tungsten", name: "Tungsten", year: 1996, note: "Balanced for lamps; daylight turns blue", saturation: 0.95, tone: [0.88, 0.98, 1.14], curves: { rgb: s(0.05) }, halation: { threshold: 0.75, radius: 6, amount: 0.18, tint: [1, 0.7, 0.5] }, grain: { amount: 0.06, size: 1.6 } },
  { id: "cross-process", name: "Cross-Process", year: 1999, note: "Slide film in negative chemistry: yellow highlights, green shadows", saturation: 1.35, curves: { r: [[0, 0], [0.5, 0.58], [1, 1]], g: [[0, 0.04], [0.5, 0.56], [1, 1]], b: [[0, 0.18], [0.5, 0.4], [1, 0.72]], rgb: s(0.12) }, grain: { amount: 0.06, size: 1.5 }, vignette: 0.25 },
  { id: "expired", name: "Expired", year: 2004, note: "Ten years past its date in a warm drawer", saturation: 0.75, tone: [1.04, 0.95, 1.02], curves: { g: [[0, 0.1], [1, 0.9]], rgb: [[0, 0.12], [0.5, 0.5], [1, 0.9]] }, fade: 0.1, grain: { amount: 0.1, size: 2 }, vignette: 0.35 },
  { id: "pocket-phone", name: "Pocket Phone", year: 2009, note: "Two megapixels, auto everything, proud of it", saturation: 1.3, tone: [1, 1.02, 1.04], curves: { rgb: s(0.09) }, grain: { amount: 0.05, size: 2.2 }, vignette: 0.15 },
];

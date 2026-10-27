export type Tool = {
  no: string;
  slug: string;
  title: string;
  blurb: string;
  aside: string;
  tags: string[];
  tint: string;
  icon: "invoice" | "watch" | "wireless" | "turntable" | "darkroom" | "stationer";
  wide?: boolean;
};

export const tools: Tool[] = [
  {
    no: "001",
    slug: "casefile-invoices",
    title: "Invoice Issuance Apparatus",
    blurb: "Generate client-ready invoices in bureau livery — line items, terms and a serial, set and ready to send.",
    aside: "Nothing is filed anywhere but your machine.",
    tags: ["Documents", "Exports PDF"],
    tint: "#3f6a8a",
    icon: "invoice",
  },
  {
    no: "002",
    slug: "pomodoro",
    title: "Pocket-Watch Pomodoro",
    blurb: "Time the inquiry — twenty-five minutes at a stretch, with a recess to follow, and a chime when the hand comes round.",
    aside: "Keeps running while you work elsewhere on the paper.",
    tags: ["Timer", "Chimes"],
    tint: "#9a5a22",
    icon: "watch",
  },
  {
    no: "003",
    slug: "wireless-set",
    title: "The Bureau Wireless",
    blurb: "A valve receiver with meters. Tune eleven carriers by hand, then build the room around them — rain, hearth, street, the clock on the mantel.",
    aside: "Six house stations composed in the browser, five live carriers from SomaFM.",
    tags: ["Sound", "Mixing panel", "Live"],
    tint: "#7a5a2a",
    icon: "wireless",
  },
  {
    no: "004",
    slug: "turntable",
    title: "The Turntable",
    blurb: "Drop the needle on a station, or patch your own Spotify in. Six pressings to choose from, full screen, with the crackle underneath.",
    aside: "Surface noise is synthesised, not a loop.",
    tags: ["Sound", "Full screen"],
    tint: "#5e4a80",
    icon: "turntable",
    wide: true,
  },
  {
    no: "005",
    slug: "darkroom",
    title: "The Darkroom",
    blurb: "Develop a photograph on seventeen film stocks, 1904 to 2009 — disposable flash, cross-process, tungsten — with grain, halation and an instant frame you can write on.",
    aside: "Runs entirely in the browser. Nothing is uploaded.",
    tags: ["Photographs", "Downloads"],
    tint: "#923719",
    icon: "darkroom",
    wide: true,
  },
  {
    no: "006",
    slug: "stationer",
    title: "The Stationer's Cabinet",
    blurb: "Set a letter in one of four hands, enclose a deed of gift, or lay out a posy sheet from a drawer of pressed specimens — then seal it into a link.",
    aside: "The flowers are drawn by a generator, not photographed.",
    tags: ["Documents", "Prints", "Links"],
    tint: "#4a6a4a",
    icon: "stationer",
  },
];

// Postcards in the album. The towns, senders and publishers are invented;
// the pictures are the site's generated scenes, printed as photochroms.

export type Postcard = {
  id: string;
  city: string;
  region: string;
  caption: string;
  image: string;
  tint: string; // photochrom wash
  publisher: string;
  year: number;
  postmark: string;
  message: string;
  signed: string;
  margin: string;
  process: string;
  route: { x: number; y: number };
};

export const postcards: Postcard[] = [
  {
    id: "PC-01",
    city: "Kestrel Bay",
    region: "The Harbour Coast",
    caption: "The levee at evening, with the mail packet standing out",
    image: "/images/scenes/harbour-dusk.jpg",
    tint: "#c58a4a",
    publisher: "Gull & Lantern Co.",
    year: 1919,
    postmark: "14 MAR 1919",
    message:
      "Found the band you asked after. They play from nine until the lamps go out, and the cornet is louder than the room. Nobody here writes anything down — I have had to learn it twice.",
    signed: "The Night Editor",
    margin: "The sender never says which band. Two of the records on the shelf were cut within a mile of this pier.",
    process: "Photochrom — the negative separated onto four litho stones, one ink each",
    route: { x: 12, y: 62 },
  },
  {
    id: "PC-02",
    city: "Ironwood",
    region: "The Mill Towns",
    caption: "The exchange building after dark, every window working",
    image: "/images/scenes/city-night.jpg",
    tint: "#4a5a7a",
    publisher: "Owl Electric Press",
    year: 1924,
    postmark: "02 NOV 1924",
    message:
      "The telephone girls have a dance band now. They practise in the switch room after the last shift and the operators upstairs complain about the brass. I think you would like it.",
    signed: "O.V.",
    margin: "Initials only. The bandleader on record four signs his letters the same way.",
    process: "Hand-tinted collotype on a velvet stock",
    route: { x: 34, y: 30 },
  },
  {
    id: "PC-03",
    city: "Three Arches",
    region: "The River Crossing",
    caption: "Morning over the old bridge, before the carts",
    image: "/images/scenes/bridge-dawn.jpg",
    tint: "#9a7a6a",
    publisher: "Gull & Lantern Co.",
    year: 1921,
    postmark: "21 JUN 1921",
    message: "Crossed at dawn. The river is higher than last year and the toll man swears it is our fault. Back by the end of the month, if the trains allow.",
    signed: "M.",
    margin: "The same M. who never recorded again?",
    process: "Photochrom with a gold-leaf sky, since rubbed away",
    route: { x: 52, y: 52 },
  },
  {
    id: "PC-04",
    city: "Hollow Ridge",
    region: "The High Country",
    caption: "The five ridges seen from the observatory road",
    image: "/images/scenes/mountain-mist.jpg",
    tint: "#7a8a90",
    publisher: "Summit Views Ltd.",
    year: 1925,
    postmark: "09 AUG 1925",
    message: "No signal, no post office, no piano for forty miles. I have written three tunes in the hotel ledger. The manager is not pleased.",
    signed: "F.A.",
    margin: "Three tunes in a hotel ledger. One of them became record seven.",
    process: "Duotone half-tone, two impressions",
    route: { x: 70, y: 22 },
  },
  {
    id: "PC-05",
    city: "Saltmarsh",
    region: "The Low Coast",
    caption: "Low tide, and one walker who did not want to be photographed",
    image: "/images/scenes/beach.jpg",
    tint: "#6a8aa0",
    publisher: "Summit Views Ltd.",
    year: 1927,
    postmark: "30 MAY 1927",
    message: "The night club burned its fuses again. We finished the session by torch. The engineer says it is the best take we have done. I could not see a thing.",
    signed: "D.O.",
    margin: "This is the torchlight session. The postmark is the day after.",
    process: "Real photograph, silver gelatin, sepia toned",
    route: { x: 84, y: 64 },
  },
  {
    id: "PC-06",
    city: "Port Lantern",
    region: "End of the Line",
    caption: "Platform four, where the railway gives up",
    image: "/images/scenes/railway.jpg",
    tint: "#b06a3a",
    publisher: "Gull & Lantern Co.",
    year: 1929,
    postmark: "?? ??? 1929",
    message: "Left the crate at the locker. You will know which one. Do not play it until you have found the rest.",
    signed: "—",
    margin: "No signature. The postmark is smudged on purpose, I think.",
    process: "Photochrom, unfinished — only three of four stones printed",
    route: { x: 94, y: 40 },
  },
];

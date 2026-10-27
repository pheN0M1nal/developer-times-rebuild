// The specimen drawer: eighteen pressed flowers, each drawn by a generator
// from these numbers. Meanings follow the old language of flowers.

export type Specimen = {
  id: string;
  ord: number;
  name: string;
  latin: string;
  meaning: string;
  petals: number;
  shape: "round" | "pointed" | "bell" | "spray" | "ray";
  petal: string; // petal colour
  centre: string;
  layers: number;
  size: number; // head radius, 10–26
  lean: number; // stem curve, -1..1
  leaves: number;
};

export const specimens: Specimen[] = [
  { id: "forget-me-not", ord: 1, name: "Forget-me-not", latin: "Myosotis", meaning: "True love; remember me", petals: 5, shape: "round", petal: "#6f8fb8", centre: "#e9c76a", layers: 1, size: 11, lean: 0.3, leaves: 2 },
  { id: "rosemary", ord: 2, name: "Rosemary", latin: "Salvia rosmarinus", meaning: "Remembrance", petals: 3, shape: "spray", petal: "#8a8fbf", centre: "#5d6b4a", layers: 1, size: 14, lean: -0.2, leaves: 6 },
  { id: "daisy", ord: 3, name: "Daisy", latin: "Bellis perennis", meaning: "Innocence; loyal love", petals: 18, shape: "ray", petal: "#f3ead8", centre: "#d9a63a", layers: 1, size: 18, lean: 0.15, leaves: 2 },
  { id: "violet", ord: 4, name: "Violet", latin: "Viola odorata", meaning: "Faithfulness; modesty", petals: 5, shape: "round", petal: "#6b4a8a", centre: "#e8d27a", layers: 1, size: 13, lean: -0.4, leaves: 3 },
  { id: "red-rose", ord: 5, name: "Red Rose", latin: "Rosa", meaning: "Love, plainly", petals: 7, shape: "round", petal: "#9a2f2a", centre: "#6a1d1a", layers: 3, size: 20, lean: 0.1, leaves: 3 },
  { id: "yellow-rose", ord: 6, name: "Yellow Rose", latin: "Rosa", meaning: "Friendship; a fresh start", petals: 7, shape: "round", petal: "#d9b14a", centre: "#a8802a", layers: 3, size: 19, lean: -0.1, leaves: 3 },
  { id: "lavender", ord: 7, name: "Lavender", latin: "Lavandula", meaning: "Devotion; calm", petals: 4, shape: "spray", petal: "#8a6fb0", centre: "#6a5a8a", layers: 1, size: 18, lean: 0.25, leaves: 2 },
  { id: "bluebell", ord: 8, name: "Bluebell", latin: "Hyacinthoides", meaning: "Constancy; humility", petals: 4, shape: "bell", petal: "#4f6aa8", centre: "#3a4a7a", layers: 1, size: 16, lean: 0.6, leaves: 2 },
  { id: "sweet-pea", ord: 9, name: "Sweet Pea", latin: "Lathyrus odoratus", meaning: "Thank you for a lovely time", petals: 2, shape: "round", petal: "#c97a9a", centre: "#9a4a6a", layers: 2, size: 14, lean: -0.5, leaves: 2 },
  { id: "marigold", ord: 10, name: "Marigold", latin: "Calendula", meaning: "Warmth; grief, gently held", petals: 22, shape: "ray", petal: "#d97a2a", centre: "#9a4a1a", layers: 2, size: 18, lean: 0.05, leaves: 3 },
  { id: "white-clover", ord: 11, name: "White Clover", latin: "Trifolium repens", meaning: "Think of me", petals: 14, shape: "pointed", petal: "#efe6d4", centre: "#cfc2a4", layers: 2, size: 12, lean: 0.35, leaves: 3 },
  { id: "chamomile", ord: 12, name: "Chamomile", latin: "Matricaria", meaning: "Energy in adversity", petals: 14, shape: "ray", petal: "#f6efe0", centre: "#e0b23a", layers: 1, size: 13, lean: -0.3, leaves: 4 },
  { id: "poppy", ord: 13, name: "Poppy", latin: "Papaver rhoeas", meaning: "Consolation; sleep", petals: 4, shape: "round", petal: "#c2412a", centre: "#2a1a14", layers: 1, size: 21, lean: 0.4, leaves: 2 },
  { id: "honeysuckle", ord: 14, name: "Honeysuckle", latin: "Lonicera", meaning: "Bonds of love", petals: 5, shape: "spray", petal: "#e8c88a", centre: "#c9884a", layers: 1, size: 16, lean: -0.6, leaves: 3 },
  { id: "snowdrop", ord: 15, name: "Snowdrop", latin: "Galanthus", meaning: "Hope; consolation", petals: 3, shape: "bell", petal: "#f2f0e8", centre: "#8aa86a", layers: 1, size: 12, lean: 0.7, leaves: 2 },
  { id: "cornflower", ord: 16, name: "Cornflower", latin: "Centaurea cyanus", meaning: "Hope in love", petals: 9, shape: "pointed", petal: "#3f64b0", centre: "#2a3a6a", layers: 2, size: 16, lean: 0.2, leaves: 3 },
  { id: "heather", ord: 17, name: "Heather", latin: "Calluna vulgaris", meaning: "Admiration; good luck", petals: 6, shape: "spray", petal: "#b06a9a", centre: "#7a3a6a", layers: 1, size: 17, lean: -0.15, leaves: 5 },
  { id: "ivy", ord: 18, name: "Ivy", latin: "Hedera helix", meaning: "Fidelity; friendship", petals: 5, shape: "pointed", petal: "#4f6a3a", centre: "#3a4a2a", layers: 1, size: 18, lean: 0.5, leaves: 6 },
];

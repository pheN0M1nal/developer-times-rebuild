// The Gazette of Moments. Every "photograph" is generated (see public/images/scenes).

export type Moment = { src: string; title: string; caption: string; category: "Travels" | "Kitchen" | "Studio" | "Streets"; frame: number };

export const moments: Moment[] = [
  { src: "/images/scenes/harbour-dusk.jpg", title: "Harbour, Dusk", caption: "The ferry left without me. I stayed for the light.", category: "Travels", frame: 3 },
  { src: "/images/scenes/still-life.jpg", title: "Second Cup", caption: "Proof that the first one was not enough.", category: "Kitchen", frame: 7 },
  { src: "/images/scenes/city-night.jpg", title: "Night Shift", caption: "Every lit window is somebody's deploy.", category: "Streets", frame: 11 },
  { src: "/images/scenes/mountain-mist.jpg", title: "Ridge Lines", caption: "Five layers of hills, like a good surface recipe.", category: "Travels", frame: 14 },
  { src: "/images/scenes/venetian-blinds.jpg", title: "The Office", caption: "Where the case notes get written.", category: "Studio", frame: 19 },
  { src: "/images/scenes/rain-street.jpg", title: "Lamplight", caption: "Walked home the long way to finish a thought.", category: "Streets", frame: 22 },
  { src: "/images/scenes/railway.jpg", title: "Platform Four", caption: "The 18:40, which is always the 18:52.", category: "Travels", frame: 23 },
  { src: "/images/scenes/forest-light.jpg", title: "Light Shafts", caption: "No signal for an afternoon. Recommended.", category: "Travels", frame: 27 },
  { src: "/images/scenes/desk-lamp.jpg", title: "After Hours", caption: "The draft that became the first press clipping.", category: "Studio", frame: 31 },
  { src: "/images/scenes/beach.jpg", title: "Low Tide", caption: "A long walk to decide something small.", category: "Travels", frame: 35 },
  { src: "/images/scenes/bridge-dawn.jpg", title: "Three Arches", caption: "Early start, slow coffee, good bridge.", category: "Streets", frame: 36 },
  { src: "/images/scenes/lantern-market.jpg", title: "Night Market", caption: "Out of focus on purpose. Mostly.", category: "Kitchen", frame: 40 },
];

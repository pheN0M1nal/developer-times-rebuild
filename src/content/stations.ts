// Live carriers are SomaFM streams: listener-supported and advertising-free.
// If you leave them on, donate at somafm.com.

export type LiveStation = { id: string; name: string; stream: string; page: string; sleeve: string; blurb: string };

export const somafm: LiveStation[] = [
  { id: "lounge", name: "Lounge", stream: "https://ice1.somafm.com/illstreet-128-mp3", page: "https://somafm.com/illstreet/", sleeve: "#8a2f22", blurb: "Vintage lounge and exotica for the room this desk is sitting in." },
  { id: "secret-agent", name: "Secret Agent", stream: "https://ice1.somafm.com/secretagent-128-mp3", page: "https://somafm.com/secretagent/", sleeve: "#1f3b52", blurb: "Spy-film soundtrack for the unsolved case; more or less the brief for this whole paper." },
  { id: "sonic-universe", name: "Sonic Universe", stream: "https://ice1.somafm.com/sonicuniverse-128-mp3", page: "https://somafm.com/sonicuniverse/", sleeve: "#4a3566", blurb: "Transcendent jazz, the start of something rather than the whole of it." },
  { id: "seven-inch", name: "Seven Inch", stream: "https://ice1.somafm.com/7soul-128-mp3", page: "https://somafm.com/7soul/", sleeve: "#5d2b3f", blurb: "Soul from the original 45s; every track was a record before it was a stream." },
  { id: "left-coast", name: "Left Coast", stream: "https://ice1.somafm.com/seventies-128-mp3", page: "https://somafm.com/seventies/", sleeve: "#6b4a1f", blurb: "Seventies rock for when the case is closed and nobody needs the atmosphere kept up." },
];

export const spotifyShelf = [
  { id: "jazz-classics", label: "Jazz Classics", uri: "playlist/37i9dQZF1DXbITWG1ZJKYt" },
  { id: "late-night-jazz", label: "Late Night Jazz", uri: "playlist/37i9dQZF1DX4wta20PHgwo" },
  { id: "coffee-table-jazz", label: "Coffee Table Jazz", uri: "playlist/37i9dQZF1DWVqfgj8NZEp1" },
];

/** Accepts open.spotify.com links or spotify: URIs; returns "kind/id" or null. */
export function parseSpotify(input: string) {
  const s = input.trim();
  const m = s.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(playlist|album|track|episode|show)\/([A-Za-z0-9]+)/) ?? s.match(/^spotify:(playlist|album|track|episode|show):([A-Za-z0-9]+)$/);
  return m ? `${m[1]}/${m[2]}` : null;
}

export const VINYL_COLOURS = [
  { id: "black", label: "Black", base: "#141210", groove: "#1e1b18" },
  { id: "emerald", label: "Emerald", base: "#0d3a2a", groove: "#14503a" },
  { id: "white", label: "White", base: "#e9e4d8", groove: "#d8d2c4" },
  { id: "root-beer", label: "Root beer", base: "#3a1c0e", groove: "#542a16" },
  { id: "oxblood", label: "Oxblood", base: "#3a0e12", groove: "#56161c" },
  { id: "cobalt", label: "Cobalt", base: "#0e1f4a", groove: "#162c66" },
] as const;

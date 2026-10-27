import { readFile } from "node:fs/promises";
import path from "node:path";

/** Words in the MDX source at ~220 wpm, rounded up. Runs at build time only. */
export async function readingMinutes(slug: string) {
  try {
    const src = await readFile(path.join(process.cwd(), "src/content/press", `${slug}.mdx`), "utf8");
    const words = src.replace(/<[^>]+>/g, " ").replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 220));
  } catch {
    return 1;
  }
}

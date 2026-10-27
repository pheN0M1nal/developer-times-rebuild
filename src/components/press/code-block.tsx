import { isValidElement } from "react";
import { createHighlighter, type Highlighter } from "shiki";
import { lampBlack } from "./code-theme";
import { CopyButton } from "./copy-button";

let highlighter: Promise<Highlighter> | null = null;
function getHighlighter() {
  highlighter ??= createHighlighter({
    themes: [lampBlack],
    langs: ["ts", "tsx", "js", "json", "bash", "css", "diff", "sql", "python"],
  });
  return highlighter;
}

type CodeProps = { className?: string; children?: React.ReactNode };

/** MDX `pre`: highlighted at build time, so no highlighter ships to the browser. */
export async function CodeBlock({ children }: { children?: React.ReactNode }) {
  const codeEl = isValidElement<CodeProps>(children) ? children : null;
  const raw = String(codeEl?.props.children ?? "").replace(/\n$/, "");
  const lang = (codeEl?.props.className ?? "").replace("language-", "") || "txt";
  const hl = await getHighlighter();
  const known = hl.getLoadedLanguages().includes(lang);
  const html = hl.codeToHtml(raw, { lang: known ? lang : "text", theme: "lamp-black" });

  return (
    <figure className="my-8 rounded-sm border border-foreground/20 overflow-hidden shadow-[0_12px_30px_-18px_#140c04aa]">
      <figcaption className="flex items-center justify-between bg-[#14110e] px-4 py-2 border-b border-white/10">
        <span className="type-label text-[0.6rem] text-[#b9ad95]">Exhibit · {lang}</span>
        <CopyButton text={raw} />
      </figcaption>
      <div
        className="code-pre text-[0.82rem] leading-relaxed overflow-x-auto [&_pre]:p-4 [&_pre]:!bg-[#1a1612] font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}

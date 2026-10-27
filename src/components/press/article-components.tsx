import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "./code-block";
import { Figure, Underline, PullQuote, Evidence } from "./article-bits";

function slug(children: React.ReactNode) {
  return String(Array.isArray(children) ? children.join("") : children)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const articleComponents: MDXComponents = {
  h2: ({ children }) => (
    <h2 id={slug(children)} className="font-serif font-bold text-2xl md:text-3xl text-foreground mt-12 mb-4 scroll-mt-28">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={slug(children)} className="font-serif font-semibold text-xl text-foreground mt-8 mb-3 scroll-mt-28">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="font-sans text-[0.98rem] leading-[1.85] text-foreground/85 my-5">{children}</p>,
  ul: ({ children }) => <ul className="my-5 space-y-2 pl-5 list-['✦__'] marker:text-foreground/60 font-sans text-foreground/85">{children}</ul>,
  ol: ({ children }) => <ol className="my-5 space-y-2 pl-5 list-decimal font-sans text-foreground/85">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
  a: ({ children, href }) => (
    <a href={href} className="underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-8 border-l-2 border-foreground/40 pl-5 font-serif italic text-lg text-foreground/80">{children}</blockquote>
  ),
  hr: () => <hr className="my-10 border-0 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />,
  code: ({ children }) => <code className="font-mono text-[0.85em] px-1 py-0.5 rounded bg-foreground/[0.07] text-foreground">{children}</code>,
  pre: CodeBlock,
  Figure,
  Underline,
  PullQuote,
  Evidence,
};

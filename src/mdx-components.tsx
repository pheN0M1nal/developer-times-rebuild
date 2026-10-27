import type { MDXComponents } from "mdx/types";
import { articleComponents } from "@/components/press/article-components";

export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return { ...articleComponents, ...components };
}

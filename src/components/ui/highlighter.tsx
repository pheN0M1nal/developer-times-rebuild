"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";
import type { RoughAnnotation, RoughAnnotationType } from "rough-notation/lib/model";

type Props = {
  children: React.ReactNode;
  action?: RoughAnnotationType;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number | [number, number];
  multiline?: boolean;
  show?: boolean;
  className?: string;
};

/** A hand-drawn circle, underline or highlighter stroke around its children. */
export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  show = true,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !show) return;
    let a: RoughAnnotation | null = annotate(el, {
      type: action,
      color,
      strokeWidth,
      animationDuration,
      iterations,
      padding,
      multiline,
    });
    a.show();
    const ro = new ResizeObserver(() => {
      a?.hide();
      a?.show();
    });
    ro.observe(document.body);
    return () => {
      ro.disconnect();
      a?.remove();
      a = null;
    };
  }, [action, color, strokeWidth, animationDuration, iterations, padding, multiline, show]);

  return (
    <span ref={ref} className={className ?? "relative inline-block bg-transparent"}>
      {children}
    </span>
  );
}

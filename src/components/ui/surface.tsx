import { cn, hash } from "@/lib/utils";

export type SurfaceVariant = "parchment" | "parchment-light" | "manila" | "leather" | "void" | "index-card";

type Props = {
  /** Seeds tilt, grain offset and stain placement: same id, same sheet, every render. */
  id: string;
  variant?: SurfaceVariant;
  edge?: "clean" | "deckle" | "torn";
  lift?: "none" | "soft" | "raised" | "deep";
  tilt?: number; // max degrees either way
  foxed?: boolean;
  as?: "div" | "article" | "section" | "aside" | "li";
  className?: string;
  contentClassName?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/**
 * The five-layer paper recipe: base fill, fibre grain, mottling, edge burn,
 * lift. The edge filter goes on the sheet, never on the text above it.
 */
export function Surface({
  id,
  variant = "parchment",
  edge = "clean",
  lift = "soft",
  tilt = 0,
  foxed = false,
  as: Tag = "div",
  className,
  contentClassName,
  style,
  children,
}: Props) {
  const h = hash(id);
  const r = (shift: number) => ((h >>> shift) & 0xff) / 255;
  const vars = {
    "--surface-tilt": tilt ? `${((r(0) * 2 - 1) * tilt).toFixed(2)}deg` : "0deg",
    "--surface-grain-x": `${Math.round(r(8) * 240)}px`,
    "--surface-grain-y": `${Math.round(r(16) * 240)}px`,
    "--surface-mottle-x": `${Math.round(12 + r(4) * 30)}%`,
    "--surface-mottle-y": `${Math.round(8 + r(12) * 26)}%`,
  } as React.CSSProperties;

  return (
    <Tag
      className={cn("surface", className)}
      data-variant={variant}
      data-edge={edge === "clean" ? undefined : edge}
      data-lift={lift === "none" ? undefined : lift}
      data-foxed={foxed ? "true" : undefined}
      style={{ ...vars, ...style }}
    >
      <div className="surface__sheet" aria-hidden />
      <div className={cn("surface__content", contentClassName)}>{children}</div>
    </Tag>
  );
}

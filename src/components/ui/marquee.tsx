import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
  duration?: string;
  gap?: string;
  className?: string;
  fade?: boolean;
};

/**
 * Renders its children `repeat` times in a row and slides the whole row by
 * one copy's width, so the loop has no seam.
 */
export function Marquee({
  children,
  reverse = false,
  pauseOnHover = true,
  vertical = false,
  repeat = 4,
  duration = "40s",
  gap = "1rem",
  className,
  fade = true,
}: Props) {
  return (
    <div
      className={cn("group flex overflow-hidden p-2", vertical ? "flex-col" : "flex-row", className)}
      style={
        {
          "--duration": duration,
          "--gap": gap,
          gap: "var(--gap)",
          maskImage: fade
            ? vertical
              ? "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)"
              : "linear-gradient(to right, transparent, black 12%, black 88%, transparent)"
            : undefined,
        } as React.CSSProperties
      }
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0 || undefined}
          className={cn(
            "flex shrink-0 justify-around",
            vertical ? "flex-col animate-marquee-vertical" : "flex-row animate-marquee",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
          )}
          style={{ gap: "var(--gap)" }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

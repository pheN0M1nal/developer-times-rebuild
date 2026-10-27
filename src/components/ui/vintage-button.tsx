import { Children, cloneElement, isValidElement } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  variant?: "default" | "solid" | "quiet";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * A letterpress button: a ruled box with an offset second rule behind it
 * that darkens on hover, as if the plate pressed harder.
 */
export function VintageButton({ children, className, asChild, variant = "default", ...rest }: Props) {
  const face = cn(
    "relative inline-flex items-center justify-center gap-2 font-serif text-sm tracking-wider uppercase border cursor-pointer px-8 py-3 transition-all duration-300",
    variant === "default" && "bg-background/95 border-foreground/30 group-hover:bg-foreground/5",
    variant === "solid" && "bg-foreground text-background border-foreground group-hover:opacity-90",
    variant === "quiet" && "bg-transparent border-foreground/20 px-5 py-2 text-xs group-hover:bg-foreground/5",
    className,
  );

  let inner: React.ReactNode;
  if (asChild && isValidElement<{ className?: string }>(Children.only(children))) {
    const child = Children.only(children) as React.ReactElement<{ className?: string }>;
    inner = cloneElement(child, { className: cn(face, child.props.className) });
  } else {
    inner = (
      <button type="button" className={face} {...rest}>
        {children}
      </button>
    );
  }

  return (
    <div className="relative inline-block group">
      <div className="absolute -bottom-1 -right-1 w-full h-full border-r border-b border-foreground/20 group-hover:border-foreground/40 transition-all duration-300 pointer-events-none" />
      {inner}
    </div>
  );
}

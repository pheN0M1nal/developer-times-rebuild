"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  offset?: number;
  direction?: "up" | "down" | "left" | "right";
  inView?: boolean;
  blur?: string;
};

/** Fades and un-blurs its children into place, optionally when scrolled into view. */
export function BlurFade({
  children,
  className,
  delay = 0,
  duration = 0.4,
  offset = 6,
  direction = "down",
  inView = false,
  blur = "6px",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-50px" });
  const axis = direction === "left" || direction === "right" ? "x" : "y";
  const sign = direction === "right" || direction === "down" ? -1 : 1;
  const variants: Variants = {
    hidden: { [axis]: sign * offset, opacity: 0, filter: `blur(${blur})` },
    visible: { [axis]: 0, opacity: 1, filter: "blur(0px)" },
  };
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={!inView || seen ? "visible" : "hidden"}
      variants={variants}
      transition={{ delay: 0.04 + delay, duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

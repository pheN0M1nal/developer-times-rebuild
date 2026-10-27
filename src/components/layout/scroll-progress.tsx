"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** The thin ember rule across the top that fills as you read. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 50, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400"
      style={{ scaleX }}
    />
  );
}

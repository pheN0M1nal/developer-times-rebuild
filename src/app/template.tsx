"use client";

import { motion } from "framer-motion";

/** Every route arrives like a page lifted from the press: a short un-blur. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(4px)", y: 6 }}
      // `filter` is cleared at the end: any filter makes this wrapper the
      // containing block for position:fixed children (overlays, full screen).
      animate={{ opacity: 1, filter: "blur(0px)", y: 0, transitionEnd: { filter: "none" } }}
      transition={{ duration: 0.45, ease: [0.22, 0.68, 0.28, 1] }}
    >
      {children}
    </motion.div>
  );
}

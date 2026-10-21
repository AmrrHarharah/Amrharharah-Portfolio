"use client";
import { motion } from "framer-motion";
// Judul section: tiap kata naik dari balik mask.
export default function Heading({ children }: { children: string }) {
  return (
    <h2 className="mb-12 flex flex-wrap gap-x-[0.25em] font-serif text-5xl md:text-7xl">
      {children.split(" ").map((w, i) => (
        <span key={i} className="overflow-hidden pb-[0.1em]">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              duration: 0.8,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

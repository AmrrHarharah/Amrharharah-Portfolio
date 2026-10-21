"use client";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
// Pita teks: bergeser mengikuti scroll dan miring sesuai kecepatan scroll.
export default function Marquee({ text }: { text: string }) {
  const { scrollY } = useScroll();
  const v = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const skew = useTransform(v, [-3000, 3000], [-10, 10]);
  const x = useTransform(scrollY, (y) => `${-((y * 0.04) % 25)}%`);
  return (
    <div className="overflow-hidden bg-accent py-6 text-paper" aria-hidden>
      <motion.div style={{ skewX: skew }}>
        <motion.div
          style={{ x }}
          className="flex w-max whitespace-nowrap font-serif text-6xl md:text-8xl"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="px-6">
              {text}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

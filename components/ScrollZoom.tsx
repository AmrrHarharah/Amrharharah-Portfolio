"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
// Panel kecil membesar sampai memenuhi layar saat di-scroll.
export default function ScrollZoom() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.7], [0.3, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.7], [48, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.45, 0.75], [0, 1]);
  return (
    <div ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 grid h-screen place-items-center overflow-hidden">
        <motion.div
          style={{ scale, borderRadius: radius }}
          className="grid h-screen w-screen place-items-center bg-gradient-to-br from-accent via-[#46604f] to-[#141614] text-white"
        >
          <motion.p
            style={{ opacity: textOpacity }}
            className="max-w-3xl px-6 text-center font-serif text-4xl md:text-7xl"
          >
            Kode yang Clean, Web yang terasa Active.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
export default function ParallaxImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <div
      ref={ref}
      className="relative aspect-[4/5] overflow-hidden rounded-[2rem]"
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale: 1.2 }}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

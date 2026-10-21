"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { ArrowUp } from "lucide-react";
// Tombol kembali ke atas dengan cincin progres scroll.
export default function BackToTop() {
  const [show, setShow] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const href = usePathname() === "/" ? "#home" : "#";
  useMotionValueEvent(scrollY, "change", (v) => {
    const f = document.getElementById("kontak");
    const atFooter = f
      ? v > document.documentElement.scrollHeight - innerHeight - f.offsetHeight
      : false;
    setShow(v > 800 && !atFooter);
  });
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={href}
          aria-label="Kembali ke atas"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-30 grid h-12 w-12 place-items-center rounded-full bg-paper/80 text-ink shadow-lg backdrop-blur"
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="#ddd9ce"
              strokeWidth="2"
            />
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="#5d7f6c"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <ArrowUp size={18} />
        </motion.a>
      )}
    </AnimatePresence>
  );
}

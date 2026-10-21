"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
// Titik kursor lembut yang membesar saat berada di atas link/tombol.
export default function Cursor() {
  const x = useMotionValue(-100),
    y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 320, damping: 30, mass: 0.5 }),
    sy = useSpring(y, { stiffness: 320, damping: 30, mass: 0.5 });
  const [big, setBig] = useState(false),
    [fine, setFine] = useState(false);
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    setFine(true);
    const mv = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setBig(!!(e.target as HTMLElement).closest?.("a,button"));
    };
    addEventListener("pointermove", mv);
    return () => removeEventListener("pointermove", mv);
  }, [x, y]);
  if (!fine) return null;
  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[90] mix-blend-difference"
      aria-hidden
    >
      <motion.div
        animate={{ scale: big ? 3 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="-ml-2 -mt-2 h-4 w-4 rounded-full bg-white"
      />
    </motion.div>
  );
}

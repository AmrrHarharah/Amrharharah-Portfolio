"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
// Titik kursor lembut; membesar di atas link/tombol dan menampilkan label dari atribut data-cursor.
export default function Cursor() {
  const x = useMotionValue(-100),
    y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 320, damping: 30, mass: 0.5 }),
    sy = useSpring(y, { stiffness: 320, damping: 30, mass: 0.5 });
  const [big, setBig] = useState(false),
    [label, setLabel] = useState(""),
    [fine, setFine] = useState(false);
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    setFine(true);
    const mv = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      x.set(e.clientX);
      y.set(e.clientY);
      setBig(!!t.closest?.("a,button"));
      setLabel(t.closest?.("[data-cursor]")?.getAttribute("data-cursor") ?? "");
    };
    addEventListener("pointermove", mv);
    return () => removeEventListener("pointermove", mv);
  }, [x, y]);
  if (!fine) return null;
  const none = label === "none"; // di atas baris proyek: titik disembunyikan, gambar preview yang tampil
  const d = none ? 0 : label ? 84 : big ? 48 : 16;
  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[90] mix-blend-difference"
      aria-hidden
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ width: d, height: d }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="grid place-items-center overflow-hidden rounded-full bg-white text-xs font-semibold text-black"
        >
          {none ? "" : label}
        </motion.div>
      </div>
    </motion.div>
  );
}

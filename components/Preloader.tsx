"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { me } from "@/lib/site";
// Intro hanya tampil sekali per sesi; kunjungan berikutnya langsung masuk.
export default function Preloader() {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<"words" | "open" | "done">("words");
  useEffect(() => {
    if (sessionStorage.getItem("intro-seen")) setPhase("done");
    else document.body.classList.add("locked");
  }, []);
  useEffect(() => {
    if (phase !== "words") return;
    if (i >= me.words.length - 1) {
      const t = setTimeout(() => setPhase("open"), 650);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setI(i + 1), i === 0 ? 700 : 380);
    return () => clearTimeout(t);
  }, [i, phase]);
  useEffect(() => {
    if (phase === "open") {
      sessionStorage.setItem("intro-seen", "1");
      dispatchEvent(new Event("intro:done"));
    }
    if (phase === "done") document.body.classList.remove("locked");
  }, [phase]);
  if (phase === "done") return null;
  const ease = [0.76, 0, 0.24, 1] as const;
  const half = (pos: "top" | "bottom") => (
    <motion.div
      className="absolute left-0 w-full bg-black"
      style={{ height: "50%", [pos]: 0 }}
      animate={phase === "open" ? { y: pos === "top" ? "-100%" : "100%" } : {}}
      transition={{ duration: 1.1, ease }}
      onAnimationComplete={() =>
        phase === "open" && pos === "top" && setPhase("done")
      }
    />
  );
  return (
    <div className="fixed inset-0 z-[100]" aria-hidden>
      {half("top")}
      {half("bottom")}
      <motion.div
        className="absolute inset-0 grid place-items-center"
        animate={{ opacity: phase === "open" ? 0 : 1 }}
        transition={{ duration: 0.35 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={i}
            className="font-serif text-5xl text-white md:text-7xl"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.18 }}
          >
            {me.words[i]}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { ArrowDown, Download, MapPin } from "lucide-react";
import { me } from "@/lib/site";
const roles = [me.role, "Frontend Engineer", "Creative Coder"];
const ease = [0.16, 1, 0.3, 1] as const;
const blobs = [
  ["#5d7f6c", "-8%", "8%"],
  ["#dcc3a4", "58%", "-12%"],
  ["#d49a7c", "38%", "48%"],
];
// Hero: blob lembut yang melayang, cahaya mengikuti kursor, peran bergantian, dan badge berputar.
export default function Hero() {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 900], [1, 0.9]);
  const opacity = useTransform(scrollY, [0, 900], [1, 0.3]);
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const gx = useSpring(mx, { stiffness: 60, damping: 20 }),
    gy = useSpring(my, { stiffness: 60, damping: 20 });
  const [r, setR] = useState(0);
  const [go, setGo] = useState(false);
  const [open, setOpen] = useState(true);
  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((d) => setOpen(d.open !== false))
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (sessionStorage.getItem("intro-seen")) {
      setGo(true);
      return;
    }
    const h = () => setGo(true);
    addEventListener("intro:done", h);
    return () => removeEventListener("intro:done", h);
  }, []);
  useEffect(() => {
    mx.set(innerWidth / 2);
    my.set(innerHeight / 2);
    const t = setInterval(() => setR((v) => (v + 1) % roles.length), 2600);
    return () => clearInterval(t);
  }, [mx, my]);
  const fade = (d: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: go ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 0.9, delay: 0.5 + d, ease },
  });
  return (
    <section
      id="home"
      onPointerMove={(e) => {
        mx.set(e.clientX);
        my.set(e.clientY);
      }}
      className="sticky top-0 h-screen overflow-hidden bg-paper"
    >
      {blobs.map(([c, l, t], i) => (
        <motion.div
          key={i}
          aria-hidden
          className="absolute h-[34rem] w-[34rem] rounded-full opacity-30 blur-[110px]"
          style={{ background: c, left: l, top: t }}
          animate={{ x: [0, 60, -40, 0], y: [0, -50, 40, 0] }}
          transition={{
            duration: 18 + i * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <motion.div
        aria-hidden
        style={{ x: gx, y: gy }}
        className="pointer-events-none absolute left-0 top-0"
      >
        <div className="h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(93,127,108,0.22),transparent_65%)]" />
      </motion.div>
      <motion.div
        style={{ scale, opacity }}
        className="relative flex h-full flex-col justify-between px-6 pb-10 pt-28 md:px-10"
      >
        <motion.div
          {...fade(0)}
          className="flex w-fit items-center gap-2 rounded-full border border-line bg-white/60 px-4 py-2 text-sm backdrop-blur"
        >
          <span
            className={`h-2 w-2 rounded-full ${open ? "bg-accent" : "bg-mute"}`}
          />
          {open
            ? "Terbuka untuk proyek baru"
            : "Sedang penuh, belum menerima proyek"}
        </motion.div>
        <div>
          <h1 className="flex flex-wrap gap-x-[0.22em] font-serif text-[19vw] leading-[0.9] md:text-[11vw]">
            {me.name.split(" ").map((w, i) => (
              <span key={i} className="overflow-hidden pb-[0.1em]">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: go ? 0 : "110%" }}
                  transition={{ duration: 1.1, delay: 0.1 + i * 0.1, ease }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div
            {...fade(0.15)}
            className="mt-4 flex items-center gap-3 text-2xl text-mute md:text-4xl"
          >
            <span className="h-px w-10 bg-mute" />
            <span className="relative inline-block h-[1.25em] overflow-hidden align-bottom">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={r}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.7, ease }}
                  className="block whitespace-nowrap"
                >
                  {roles[r]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>
        </div>
        <motion.div
          {...fade(0.3)}
          className="flex items-end justify-between gap-8 border-t border-line pt-6"
        >
          <div className="max-w-md">
            <p className="text-lg text-mute">{me.tagline}</p>
            <p className="mt-3 flex items-center gap-2 text-sm text-mute">
              <MapPin size={14} />
              {me.city}
            </p>
            {me.cv && (
              <a
                href={me.cv}
                download
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink px-5 py-2 text-sm transition hover:bg-ink hover:text-paper"
              >
                <Download size={14} />
                Unduh CV
              </a>
            )}
          </div>
          <a
            href="#tentang"
            aria-label="Scroll ke bawah"
            className="relative grid h-28 w-28 shrink-0 place-items-center"
          >
            <motion.svg
              viewBox="0 0 100 100"
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
            >
              <defs>
                <path
                  id="circ"
                  d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
                />
              </defs>
              <text fontSize="10.5" fill="currentColor">
                <textPath href="#circ" textLength="236">
                  SCROLL ✦ GULIR KE BAWAH ✦{" "}
                </textPath>
              </text>
            </motion.svg>
            <ArrowDown size={20} />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

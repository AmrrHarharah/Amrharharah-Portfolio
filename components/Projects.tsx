"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useVelocity,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/site";
import Heading from "./Heading";
const grads = [
  "linear-gradient(135deg,#5d7f6c,#c9d6c3)",
  "linear-gradient(135deg,#c98a6b,#f0d9c0)",
  "linear-gradient(135deg,#7d9bb0,#d7e3ea)",
  "linear-gradient(135deg,#9a8bb5,#e5dff0)",
];
const ease = [0.16, 1, 0.3, 1] as const;
const bgOf = (p: any, i: number): React.CSSProperties =>
  p.image
    ? { backgroundImage: `url(${p.image})` }
    : { background: grads[i % grads.length] };
export default function Projects() {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0),
    [show, setShow] = useState(false),
    [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const k = [0.1, 0.3, 0.75, 0.9];
  const bg = useTransform(scrollYProgress, k, [
    "#f4f2ec",
    "#141614",
    "#141614",
    "#f4f2ec",
  ]);
  const fg = useTransform(scrollYProgress, k, [
    "#141614",
    "#f4f2ec",
    "#f4f2ec",
    "#141614",
  ]);
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 130, damping: 20, mass: 0.6 }),
    y = useSpring(my, { stiffness: 130, damping: 20, mass: 0.6 });
  const rot = useSpring(useTransform(useVelocity(x), [-1500, 1500], [-7, 7]), {
    stiffness: 150,
    damping: 20,
  });
  const ov = "absolute inset-0 z-20";
  return (
    <motion.section
      ref={ref}
      id="proyek"
      style={{ backgroundColor: bg, color: fg }}
      className="px-6 py-32 md:px-10"
      onMouseMove={(e) => {
        mx.set(e.clientX);
        my.set(e.clientY);
      }}
    >
      <Heading>Proyek pilihan</Heading>
      <ul
        className="border-t border-neutral-500/40"
        onMouseLeave={() => setShow(false)}
      >
        {projects.map((p, i) => (
          <li
            key={p.title}
            onMouseEnter={() => {
              setIdx(i);
              setShow(true);
            }}
            className="group relative isolate overflow-hidden border-b border-neutral-500/40"
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-y-100" />
            {/* Seluruh baris membuka web app proyek; kalau link belum diisi, membuka halaman detail. */}
            {p.link ? (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Buka ${p.title}`}
                data-cursor="none"
                className={ov}
              />
            ) : (
              <Link
                href={`/proyek/${p.slug}`}
                aria-label={`Lihat ${p.title}`}
                data-cursor="none"
                className={ov}
              />
            )}
            <div className="pointer-events-none relative grid grid-cols-[auto_1fr_auto] items-center gap-4 py-6 transition-[padding,color] duration-300 group-hover:pl-4 group-hover:text-white md:grid-cols-[auto_2fr_1fr_1fr_auto] md:gap-8">
              <span
                className="h-14 w-20 shrink-0 rounded-xl bg-cover bg-center transition-transform duration-500 group-hover:scale-105 md:h-16 md:w-28"
                style={bgOf(p, i)}
              />
              <span className="font-serif text-2xl md:text-5xl">{p.title}</span>
              <span className="hidden opacity-60 md:block">{p.type}</span>
              <span className="hidden opacity-60 md:block">{p.stack}</span>
              <span className="flex items-center gap-3 opacity-60">
                {p.year}
                <ArrowUpRight size={18} />
              </span>
            </div>
            {p.link && (p.summary || p.problem) && (
              <Link
                href={`/proyek/${p.slug}`}
                className="absolute bottom-1.5 right-0 z-30 text-xs underline underline-offset-4 opacity-60 transition hover:opacity-100 group-hover:text-white"
              >
                Studi kasus
              </Link>
            )}
          </li>
        ))}
      </ul>
      {mounted &&
        createPortal(
          <motion.div
            style={{ x, y }}
            className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
          >
            <div className="-translate-y-1/2 translate-x-8">
              <motion.div
                style={{ rotate: rot }}
                animate={{ scale: show ? 1 : 0.7, opacity: show ? 1 : 0 }}
                transition={{ duration: 0.45, ease }}
                className="h-44 w-72 overflow-hidden rounded-2xl shadow-2xl"
              >
                <motion.div
                  animate={{ y: `${-(idx * 100) / projects.length}%` }}
                  transition={{ duration: 0.65, ease }}
                >
                  {projects.map((p, i) => (
                    <div
                      key={p.title}
                      className="flex h-44 w-72 items-end bg-cover bg-center p-3"
                      style={bgOf(p, i)}
                    >
                      <span className="rounded-full bg-paper/90 px-3 py-1 text-sm text-ink">
                        {p.title}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>,
          document.body,
        )}
    </motion.section>
  );
}

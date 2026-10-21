"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Quote, ArrowUpRight } from "lucide-react";
import { me } from "@/lib/site";
const tints = ["#dfe8df", "#efe3d0", "#f1ddd2", "#dde6ec"]; // sage, pasir, terakota muda, biru kabut
const ini = (n: string) => String(n).split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
const pad = (n: number) => String(n).padStart(2, "0");
// Section menempel di layar; scroll ke bawah menggeser kartu ke samping. Setelah kartu terakhir, halaman lanjut ke footer.
export default function Testimonials() {
  const t: any[] = me.testimonials ?? [];
  const ref = useRef<HTMLElement>(null), track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0), [idx, setIdx] = useState(1);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  useMotionValueEvent(scrollYProgress, "change", (p) => setIdx(Math.min(t.length, Math.max(1, Math.round(p * (t.length - 1)) + 1))));
  useEffect(() => {
    const m = () => track.current && setDist(Math.max(0, track.current.scrollWidth - innerWidth));
    m(); addEventListener("resize", m); document.fonts?.ready.then(m);
    return () => removeEventListener("resize", m);
  }, [t.length]);
  if (!t.length) return null;
  const panel = "w-[80vw] shrink-0 md:w-[34vw]";
  return (<section ref={ref} id="testimoni" style={{ height: `calc(100vh + ${dist}px)` }} className="relative">
    <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
      <motion.div ref={track} style={{ x }} className="flex w-max items-center gap-6 px-6 md:gap-8 md:px-10">
        <div className={panel}><p className="mb-4 text-sm uppercase tracking-[0.2em] text-mute">Testimoni</p><h2 className="font-serif text-6xl md:text-8xl">Kata mereka.</h2>
          <p className="mt-6 max-w-xs text-mute">Terus scroll, kartunya bergeser ke samping.</p></div>
        {t.map((q, i) => (<figure key={i} style={{ background: tints[i % tints.length] }}
          className={`flex min-h-[21rem] w-[80vw] max-w-md shrink-0 flex-col justify-between rounded-[2rem] p-8 transition-transform duration-500 hover:rotate-0 md:p-10 ${i % 2 ? "rotate-[1.5deg] md:mt-16" : "-rotate-[1.5deg] md:mb-16"}`}>
          <div><Quote size={34} fill="currentColor" className="mb-6 text-accent" /><blockquote className="text-xl leading-relaxed md:text-2xl">{q.quote}</blockquote></div>
          <figcaption className="mt-10 flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-sm font-semibold text-paper">{ini(q.name)}</span>
            <span><span className="block font-medium">{q.name}</span><span className="block text-sm text-mute">{q.role}</span></span></figcaption></figure>))}
        <div className={`${panel} pr-6`}><h3 className="font-serif text-5xl md:text-7xl">Giliran proyek Anda?</h3>
          <a href={`mailto:${me.email}`} className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-paper transition hover:bg-accent">Hubungi saya<ArrowUpRight size={18} /></a></div>
      </motion.div>
      <div className="absolute inset-x-6 bottom-8 flex items-center gap-4 text-sm tabular-nums text-mute md:inset-x-10">
        <span>{pad(idx)} / {pad(t.length)}</span><div className="h-px flex-1 bg-line"><motion.div style={{ scaleX: scrollYProgress }} className="h-px origin-left bg-ink" /></div></div>
    </div></section>);
}

"use client";
import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { me, projects, jobs, skills } from "@/lib/site";
function Num({ v, suffix }: { v: number; suffix: string }) {
  const ref = useRef(null),
    inView = useInView(ref, { once: true }),
    [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, v, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (x) => setN(Math.round(x)),
    });
    return () => c.stop();
  }, [inView, v]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}
// Isi dari me.stats [{value, suffix, label}] bila ada; kalau tidak, dihitung otomatis dari data Anda.
export default function Stats() {
  const items: any[] = me.stats ?? [
    { value: projects.length, suffix: "", label: "Proyek" },
    {
      value: skills.reduce((a: number, s: any) => a + s.items.length, 0),
      suffix: "+",
      label: "Teknologi",
    },
    { value: jobs.length, suffix: "", label: "Experience" },
  ];
  return (
    <dl className="mx-auto mt-24 grid max-w-6xl grid-cols-3 gap-6 border-t border-line pt-10">
      {items.map((s) => (
        <div key={s.label}>
          <dd className="font-serif text-5xl md:text-7xl">
            <Num v={s.value} suffix={s.suffix ?? ""} />
          </dd>
          <dt className="mt-2 text-sm text-mute">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}

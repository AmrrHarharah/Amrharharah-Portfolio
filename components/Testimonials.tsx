"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { Quote, ArrowUpRight, Send } from "lucide-react";
import { me } from "@/lib/site";
const tints = ["#dfe8df", "#efe3d0", "#f1ddd2", "#dde6ec"];
const ini = (n: string) =>
  String(n)
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
const pad = (n: number) => String(n).padStart(2, "0");
const inp =
  "w-full rounded-xl border border-ink/15 bg-white/70 px-4 py-3 outline-none focus:border-ink";
// Kartu bergeser ke samping saat scroll. Komentar yang disetujui diambil dari database; form di ujung deret.
export default function Testimonials() {
  const [live, setLive] = useState<any[]>([]),
    [pending, setPending] = useState<any[]>([]);
  const t: any[] = [...pending, ...live, ...(me.testimonials ?? [])];
  const [f, setF] = useState({ name: "", role: "", message: "", website: "" }),
    [st, setSt] = useState<"idle" | "sending" | "done" | "error">("idle"),
    [err, setErr] = useState("");
  const ref = useRef<HTMLElement>(null),
    track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0),
    [idx, setIdx] = useState(1);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const x = useMotionValue(0),
    distRef = useRef(0); // geser dihitung langsung dari progres scroll
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    x.set(-p * distRef.current);
    setIdx(Math.min(t.length, Math.max(1, Math.round(p * (t.length - 1)) + 1)));
  });
  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((d) => setLive(d.items ?? []))
      .catch(() => {});
  }, []);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const m = () => {
      const d = Math.max(
        0,
        el.scrollWidth - document.documentElement.clientWidth,
      );
      distRef.current = d;
      setDist(d);
      x.set(-scrollYProgress.get() * d);
    };
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    addEventListener("resize", m);
    document.fonts?.ready.then(m);
    // Diagnostik: overflow hidden/auto pada elemen induk mematikan efek menempel (sticky).
    const bad = (n: Element) => {
      const c = getComputedStyle(n);
      return [c.overflowX, c.overflowY].some(
        (v) => v !== "visible" && v !== "clip",
      );
    };
    for (
      let n = ref.current?.parentElement;
      n && n !== document.documentElement;
      n = n.parentElement
    ) {
      if (n === document.body && !bad(document.documentElement)) continue;
      if (bad(n)) {
        console.warn("[Testimonials] sticky terblokir oleh overflow pada:", n);
        break;
      }
    }
    return () => {
      ro.disconnect();
      removeEventListener("resize", m);
    };
  }, [x, scrollYProgress]);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSt("sending");
    const r = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(f),
    });
    const d = await r.json().catch(() => ({}));
    if (r.ok) {
      setPending((p) => [
        {
          quote: f.message,
          name: f.name,
          role: f.role || "Pengunjung",
          pending: true,
        },
        ...p,
      ]);
      setF({ name: "", role: "", message: "", website: "" });
      setSt("done");
    } else {
      setErr(d.error || "Gagal mengirim.");
      setSt("error");
    }
  };
  const panel = "w-[80vw] shrink-0 md:w-[34vw]";
  return (
    <section
      ref={ref}
      id="testimoni"
      style={{ height: `calc(100vh + ${dist}px)` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div
          ref={track}
          style={{ x }}
          className="flex w-max items-center gap-6 px-6 md:gap-8 md:px-10"
        >
          <div className={panel}>
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-mute">
              Testimoni
            </p>
            <h2 className="font-serif text-6xl md:text-8xl">Kata mereka.</h2>
            <p className="mt-6 max-w-xs text-mute">
              Terus scroll, kartunya bergeser ke samping.
            </p>
          </div>
          {t.map((q, i) => (
            <figure
              key={i}
              style={{ background: tints[i % tints.length] }}
              className={`relative flex min-h-[21rem] w-[80vw] max-w-md shrink-0 flex-col justify-between rounded-[2rem] p-8 transition-transform duration-500 hover:rotate-0 md:p-10 ${i % 2 ? "rotate-[1.5deg] md:mt-16" : "-rotate-[1.5deg] md:mb-16"}`}
            >
              {q.pending && (
                <span className="absolute right-6 top-6 rounded-full bg-ink px-3 py-1 text-xs text-paper">
                  Menunggu persetujuan
                </span>
              )}
              <div>
                <Quote
                  size={34}
                  fill="currentColor"
                  className="mb-6 text-accent"
                />
                <blockquote className="text-xl leading-relaxed md:text-2xl">
                  {q.quote}
                </blockquote>
              </div>
              <figcaption className="mt-10 flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-sm font-semibold text-paper">
                  {ini(q.name)}
                </span>
                <span>
                  <span className="block font-medium">{q.name}</span>
                  <span className="block text-sm text-mute">{q.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
          <form
            onSubmit={submit}
            className="flex min-h-[21rem] w-[85vw] max-w-md shrink-0 flex-col gap-3 rounded-[2rem] border border-dashed border-ink/30 p-8"
          >
            <h3 className="font-serif text-3xl">Tulis komentar</h3>
            {st === "done" ? (
              <p className="py-6 text-lg">
                Terima kasih! Komentar Anda tampil setelah disetujui.
              </p>
            ) : (
              <>
                <input
                  className={inp}
                  required
                  minLength={2}
                  maxLength={60}
                  placeholder="Nama"
                  value={f.name}
                  onChange={(e) => setF({ ...f, name: e.target.value })}
                />
                <input
                  className={inp}
                  maxLength={80}
                  placeholder="Peran (opsional)"
                  value={f.role}
                  onChange={(e) => setF({ ...f, role: e.target.value })}
                />
                <textarea
                  data-lenis-prevent
                  className={inp}
                  required
                  minLength={10}
                  maxLength={400}
                  rows={3}
                  placeholder="Komentar Anda"
                  value={f.message}
                  onChange={(e) => setF({ ...f, message: e.target.value })}
                />
                <input
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  value={f.website}
                  onChange={(e) => setF({ ...f, website: e.target.value })}
                />
                {st === "error" && (
                  <p className="text-sm text-red-700">{err}</p>
                )}
                <button
                  disabled={st === "sending"}
                  className="mt-1 flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 text-paper transition hover:bg-accent disabled:opacity-50"
                >
                  {st === "sending" ? "Mengirim…" : "Kirim"}
                  <Send size={16} />
                </button>
              </>
            )}
          </form>
          <div className={`${panel} pr-6`}>
            <h3 className="font-serif text-5xl md:text-7xl">
              Giliran proyek Anda?
            </h3>
            <a
              href={`mailto:${me.email}`}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-paper transition hover:bg-accent"
            >
              Hubungi saya
              <ArrowUpRight size={18} />
            </a>
          </div>
        </motion.div>
        <div className="absolute inset-x-6 bottom-8 flex items-center gap-4 text-sm tabular-nums text-mute md:inset-x-10">
          <span>
            {pad(idx)} / {pad(t.length)}
          </span>
          <div className="h-px flex-1 bg-line">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="h-px origin-left bg-ink"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

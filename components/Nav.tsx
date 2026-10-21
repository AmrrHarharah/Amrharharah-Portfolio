"use client";
import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import { Check, Copy, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { me } from "@/lib/site";
const links = [
  ["proyek", "Proyek"],
  ["keahlian", "Keahlian"],
  ["pengalaman", "Pengalaman"],
  ["kontak", "Kontak"],
];
const greet = (h: number) =>
  h < 11
    ? "Selamat pagi"
    : h < 15
      ? "Selamat siang"
      : h < 18
        ? "Selamat sore"
        : "Selamat malam";
const ease = [0.16, 1, 0.3, 1] as const;
export default function Nav() {
  const [active, setActive] = useState(""),
    [hide, setHide] = useState(false),
    [time, setTime] = useState(""),
    [hello, setHello] = useState("");
  const [copied, setCopied] = useState(false),
    [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const base = usePathname() === "/" ? "" : "/";
  const prog = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  useMotionValueEvent(scrollY, "change", (v) =>
    setHide(v > (scrollY.getPrevious() ?? 0) && v > 200),
  );
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (p > 0.985) setActive("kontak");
  });
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links
      .filter(([id]) => id !== "kontak")
      .forEach(([id]) => {
        const n = document.getElementById(id);
        n && io.observe(n);
      });
    const tick = () => {
      const d = new Date(),
        tz = "Asia/Jakarta";
      setTime(
        d
          .toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: tz,
          })
          .replace(".", ":"),
      );
      setHello(
        greet(
          Number(
            d.toLocaleString("en-GB", {
              hour: "numeric",
              hour12: false,
              timeZone: tz,
            }),
          ),
        ),
      );
    };
    tick();
    const t = setInterval(tick, 30000);
    return () => {
      io.disconnect();
      clearInterval(t);
    };
  }, []);
  const copy = () => {
    navigator.clipboard?.writeText(me.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <>
      <motion.header
        animate={{ y: hide && !open ? "-140%" : 0 }}
        transition={{ duration: 0.5, ease }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <nav className="relative flex w-full max-w-4xl items-center justify-between gap-3 overflow-hidden rounded-full border border-black/5 bg-paper/70 py-2 pl-2.5 pr-2 text-ink shadow-[0_8px_30px_rgba(0,0,0,0.07)] backdrop-blur-xl">
          <a
            href={`${base}#home`}
            aria-label="Beranda"
            className="flex items-center gap-3 text-sm font-medium"
          >
            <Logo />
            <span className="hidden sm:inline">{me.name}</span>
          </a>
          <ul className="hidden gap-1 md:flex">
            {links.map(([id, l]) => (
              <li key={id}>
                <a
                  href={`${base}#${id}`}
                  className="relative block rounded-full px-4 py-2 text-sm"
                >
                  {active === id && (
                    <motion.span
                      layoutId="pill"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 34,
                      }}
                    />
                  )}
                  <span
                    className={`relative transition-colors ${active === id ? "text-paper" : "text-mute hover:text-ink"}`}
                  >
                    {l}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <span className="hidden px-2 text-xs tabular-nums text-mute lg:block">
              {hello} · {time || "--:--"} WIB
            </span>
            <button
              onClick={copy}
              className="hidden items-center gap-2 rounded-full border border-line px-4 py-2 text-sm transition hover:bg-ink hover:text-paper md:flex"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Tersalin" : "Salin email"}
            </button>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              className="grid h-10 w-10 place-items-center rounded-full bg-ink text-paper md:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
          <motion.span
            style={{ scaleX: prog }}
            className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-accent"
          />
        </nav>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 90% 5%)" }}
            animate={{ clipPath: "circle(150% at 90% 5%)" }}
            exit={{ clipPath: "circle(0% at 90% 5%)" }}
            transition={{ duration: 0.7, ease }}
            className="fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-ink px-8 text-paper md:hidden"
          >
            {[["home", "Beranda"], ...links].map(([id, l], i) => (
              <motion.a
                key={id}
                href={`${base}#${id}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease }}
                className="font-serif text-5xl"
              >
                {l}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Search } from "lucide-react";
import { me, projects } from "@/lib/site";
type Item = { label: string; hint: string; run: () => void };
const go = (id: string) => {
  if (location.pathname !== "/") {
    location.href = `/#${id}`;
    return;
  }
  const a = document.createElement("a");
  a.href = `#${id}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
};
// Tekan Ctrl/⌘ + K untuk mencari bagian atau proyek.
export default function CommandPalette() {
  const [open, setOpen] = useState(false),
    [q, setQ] = useState(""),
    [i, setI] = useState(0),
    [mounted, setMounted] = useState(false);
  const items: Item[] = useMemo(
    () => [
      ...[
        ["home", "Beranda"],
        ["tentang", "Tentang saya"],
        ["proyek", "Proyek"],
        ["keahlian", "Keahlian"],
        ["pengalaman", "Pengalaman"],
        ["testimoni", "Kata mereka"],
        ["kontak", "Kontak"],
      ].map(([id, l]) => ({ label: l, hint: "Bagian", run: () => go(id) })),
      ...projects.map((p) => ({
        label: p.title,
        hint: "Proyek",
        run: () =>
          p.link
            ? window.open(p.link, "_blank", "noopener")
            : (location.href = `/proyek/${p.slug}`),
      })),
      {
        label: "Salin email",
        hint: "Aksi",
        run: () => navigator.clipboard?.writeText(me.email),
      },
      ...(me.cv
        ? [{ label: "Unduh CV", hint: "Aksi", run: () => window.open(me.cv) }]
        : []),
    ],
    [],
  );
  const list = items.filter((x) =>
    x.label.toLowerCase().includes(q.toLowerCase()),
  );
  useEffect(() => {
    setMounted(true);
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    addEventListener("keydown", h);
    return () => removeEventListener("keydown", h);
  }, []);
  useEffect(() => {
    setI(0);
  }, [q, open]);
  if (!mounted || !open) return null;
  const pick = (x?: Item) => {
    if (!x) return;
    setOpen(false);
    setQ("");
    setTimeout(x.run, 60);
  };
  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center bg-ink/40 px-4 pt-[18vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Pintasan"
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-paper shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={18} className="text-mute" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari bagian atau proyek…"
            className="h-14 w-full bg-transparent outline-none"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setI((v) => Math.min(v + 1, list.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setI((v) => Math.max(v - 1, 0));
              }
              if (e.key === "Enter") pick(list[i]);
            }}
          />
        </div>
        <ul className="max-h-80 overflow-auto p-2">
          {list.map((x, n) => (
            <li key={x.label + n}>
              <button
                onMouseEnter={() => setI(n)}
                onClick={() => pick(x)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left ${n === i ? "bg-ink text-paper" : ""}`}
              >
                <span>{x.label}</span>
                <span className="text-xs opacity-60">{x.hint}</span>
              </button>
            </li>
          ))}
          {!list.length && (
            <li className="px-3 py-6 text-center text-mute">Tidak ditemukan</li>
          )}
        </ul>
      </div>
    </div>,
    document.body,
  );
}

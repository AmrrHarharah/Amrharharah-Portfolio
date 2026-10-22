"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Send, X } from "lucide-react";
const inp =
  "w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-ink";
// Tombol + modal pesan; pesan tersimpan di database. Dirender lewat portal agar tidak tertutup footer.
export default function ContactForm() {
  const [open, setOpen] = useState(false),
    [mounted, setMounted] = useState(false),
    [st, setSt] = useState<"idle" | "sending" | "done" | "error">("idle"),
    [err, setErr] = useState("");
  const [f, setF] = useState({ name: "", email: "", message: "", website: "" });
  useEffect(() => {
    setMounted(true);
    const h = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", h);
    return () => removeEventListener("keydown", h);
  }, []);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSt("sending");
    const r = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(f),
    });
    const d = await r.json().catch(() => ({}));
    if (r.ok) {
      setSt("done");
      setF({ name: "", email: "", message: "", website: "" });
    } else {
      setErr(d.error || "Gagal mengirim.");
      setSt("error");
    }
  };
  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          setSt("idle");
        }}
        className="flex items-center gap-3 rounded-full bg-paper py-2 pl-2 pr-5 text-sm text-ink transition hover:bg-accent hover:text-white"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-paper">
          <Send size={16} />
        </span>
        Kirim pesan
      </button>
      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[110] grid place-items-center bg-ink/50 px-4 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <form
              onSubmit={submit}
              role="dialog"
              aria-modal="true"
              aria-label="Kirim pesan"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md space-y-3 rounded-3xl bg-paper p-8 text-ink shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup"
                className="absolute right-5 top-5"
              >
                <X size={20} />
              </button>
              <h3 className="font-serif text-3xl">Kirim pesan</h3>
              {st === "done" ? (
                <p className="py-8 text-lg">
                  Terima kasih! Pesan Anda sudah masuk, saya akan segera
                  membalas.
                </p>
              ) : (
                <>
                  <input
                    className={inp}
                    required
                    minLength={2}
                    maxLength={80}
                    placeholder="Nama"
                    value={f.name}
                    onChange={(e) => setF({ ...f, name: e.target.value })}
                  />
                  <input
                    className={inp}
                    required
                    type="email"
                    maxLength={120}
                    placeholder="Email"
                    value={f.email}
                    onChange={(e) => setF({ ...f, email: e.target.value })}
                  />
                  <textarea
                    data-lenis-prevent
                    className={inp}
                    required
                    minLength={10}
                    maxLength={2000}
                    rows={5}
                    placeholder="Pesan Anda"
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
                    className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-paper transition hover:bg-accent disabled:opacity-50"
                  >
                    {st === "sending" ? "Mengirim…" : "Kirim"}
                    <Send size={16} />
                  </button>
                </>
              )}
            </form>
          </div>,
          document.body,
        )}
    </>
  );
}

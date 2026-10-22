"use client";
import { useCallback, useEffect, useState } from "react";
const btn = "rounded-full border border-ink px-4 py-1.5 text-sm transition hover:bg-ink hover:text-paper";
export default function Admin() {
  const [key, setKey] = useState(""), [data, setData] = useState<any>(null), [err, setErr] = useState(""), [tab, setTab] = useState("testimonials");
  const load = useCallback(async (k: string) => {
    const r = await fetch("/api/admin", { headers: { "x-admin-key": k } });
    if (!r.ok) { setErr("Password salah atau database belum dikonfigurasi."); setData(null); return; }
    setData(await r.json()); setErr(""); sessionStorage.setItem("ak", k);
  }, []);
  useEffect(() => { const k = sessionStorage.getItem("ak"); if (k) { setKey(k); load(k); } }, [load]);
  const call = async (method: string, body: any) => { await fetch("/api/admin", { method, headers: { "x-admin-key": key, "content-type": "application/json" }, body: JSON.stringify(body) }); load(key); };
  const fmt = (d: string) => new Date(d).toLocaleString("id-ID");
  if (!data) return (<main className="grid min-h-screen place-items-center bg-paper px-6"><form onSubmit={(e) => { e.preventDefault(); load(key); }} className="w-full max-w-sm space-y-4">
    <h1 className="font-serif text-4xl">Admin</h1><input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Password" className="w-full rounded-xl border border-line bg-white px-4 py-3" />
    {err && <p className="text-sm text-red-700">{err}</p>}<button className={btn}>Masuk</button></form></main>);
  return (<main className="min-h-screen bg-paper px-6 pb-20 pt-32 md:px-10"><div className="mx-auto max-w-3xl">
    <div className="mb-8 flex flex-wrap items-center gap-3"><h1 className="mr-auto font-serif text-4xl">Admin</h1>
      {["testimonials", "messages"].map((t) => <button key={t} onClick={() => setTab(t)} className={`${btn} ${tab === t ? "bg-ink text-paper" : ""}`}>{t === "testimonials" ? `Komentar (${data.testimonials.length})` : `Pesan (${data.messages.length})`}</button>)}
      <button onClick={() => call("PATCH", { setting: "open_for_work", value: !data.open })} className={btn}>Status: {data.open ? "Terbuka" : "Penuh"}</button></div>
    <ul className="space-y-3">{(tab === "testimonials" ? data.testimonials : data.messages).map((x: any) => (<li key={x.id} className="rounded-2xl border border-line bg-white p-5">
      <p className="font-medium">{x.name} <span className="font-normal text-mute">{tab === "messages" ? `· ${x.email}` : x.role ? `· ${x.role}` : ""}</span></p>
      <p className="mt-2 whitespace-pre-wrap">{x.message}</p><p className="mt-2 text-xs text-mute">{fmt(x.created_at)}{tab === "testimonials" && (x.approved ? " · TAMPIL" : " · MENUNGGU")}</p>
      <div className="mt-4 flex gap-2">{tab === "testimonials" && <button className={btn} onClick={() => call("PATCH", { table: "testimonials", id: x.id, approved: !x.approved })}>{x.approved ? "Sembunyikan" : "Setujui"}</button>}
        <button className={btn} onClick={() => confirm("Hapus?") && call("DELETE", { table: tab, id: x.id })}>Hapus</button></div></li>))}</ul></div></main>);
}

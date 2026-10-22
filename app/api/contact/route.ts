import { NextResponse } from "next/server";
import { db, hashIp } from "@/lib/supabase";
export async function POST(req: Request) {
  const s = db(); if (!s) return NextResponse.json({ error: "Database belum dikonfigurasi." }, { status: 503 });
  const b = await req.json().catch(() => ({}));
  if (b.website) return NextResponse.json({ ok: true });
  const name = String(b.name ?? "").trim().slice(0, 80), email = String(b.email ?? "").trim().slice(0, 120), message = String(b.message ?? "").trim();
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10 || message.length > 2000) return NextResponse.json({ error: "Periksa nama, email, dan pesan (10–2000 karakter)." }, { status: 400 });
  const ip = hashIp(req);
  const { count } = await s.from("messages").select("id", { count: "exact", head: true }).eq("ip_hash", ip).gte("created_at", new Date(Date.now() - 3600e3).toISOString());
  if ((count ?? 0) >= 3) return NextResponse.json({ error: "Terlalu banyak kiriman, coba lagi nanti." }, { status: 429 });
  const { error } = await s.from("messages").insert({ name, email, message, ip_hash: ip });
  return error ? NextResponse.json({ error: "Gagal menyimpan." }, { status: 500 }) : NextResponse.json({ ok: true });
}

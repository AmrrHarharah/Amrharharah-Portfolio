import { NextResponse } from "next/server";
import { db, hashIp } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export async function GET() {
  const s = db(); if (!s) return NextResponse.json({ items: [] });
  const { data } = await s.from("testimonials").select("name,role,message").eq("approved", true).order("created_at", { ascending: false }).limit(30);
  return NextResponse.json({ items: (data ?? []).map((d: any) => ({ quote: d.message, name: d.name, role: d.role ?? "" })) });
}
export async function POST(req: Request) {
  const s = db(); if (!s) return NextResponse.json({ error: "Database belum dikonfigurasi." }, { status: 503 });
  const b = await req.json().catch(() => ({}));
  if (b.website) return NextResponse.json({ ok: true }); // kolom jebakan bot
  const name = String(b.name ?? "").trim().slice(0, 60), role = String(b.role ?? "").trim().slice(0, 80), message = String(b.message ?? "").trim();
  if (name.length < 2 || message.length < 10 || message.length > 400) return NextResponse.json({ error: "Nama minimal 2 huruf dan komentar 10–400 karakter." }, { status: 400 });
  const ip = hashIp(req);
  const { count } = await s.from("testimonials").select("id", { count: "exact", head: true }).eq("ip_hash", ip).gte("created_at", new Date(Date.now() - 3600e3).toISOString());
  if ((count ?? 0) >= 3) return NextResponse.json({ error: "Terlalu banyak kiriman, coba lagi nanti." }, { status: 429 });
  const { error } = await s.from("testimonials").insert({ name, role: role || null, message, ip_hash: ip });
  return error ? NextResponse.json({ error: "Gagal menyimpan." }, { status: 500 }) : NextResponse.json({ ok: true });
}

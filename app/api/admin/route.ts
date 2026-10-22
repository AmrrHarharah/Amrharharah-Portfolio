import { NextResponse } from "next/server";
import { db, isAdmin } from "@/lib/supabase";
const no = () => NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
export async function GET(req: Request) {
  if (!isAdmin(req)) return no(); const s = db(); if (!s) return NextResponse.json({ error: "Database belum dikonfigurasi." }, { status: 503 });
  const [t, m, st] = await Promise.all([s.from("testimonials").select("*").order("created_at", { ascending: false }), s.from("messages").select("*").order("created_at", { ascending: false }), s.from("settings").select("value").eq("key", "open_for_work").maybeSingle()]);
  return NextResponse.json({ testimonials: t.data ?? [], messages: m.data ?? [], open: st.data ? st.data.value === "true" : true });
}
export async function PATCH(req: Request) {
  if (!isAdmin(req)) return no(); const s = db(); if (!s) return NextResponse.json({ error: "Database belum dikonfigurasi." }, { status: 503 }); const b = await req.json();
  if (b.setting === "open_for_work") await s.from("settings").upsert({ key: "open_for_work", value: String(!!b.value) });
  else if (b.table === "testimonials") await s.from("testimonials").update({ approved: !!b.approved }).eq("id", b.id);
  else return NextResponse.json({ error: "Permintaan tidak valid" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
export async function DELETE(req: Request) {
  if (!isAdmin(req)) return no(); const s = db(); if (!s) return NextResponse.json({ error: "Database belum dikonfigurasi." }, { status: 503 }); const b = await req.json();
  if (!["testimonials", "messages"].includes(b.table)) return NextResponse.json({ error: "Permintaan tidak valid" }, { status: 400 });
  await s.from(b.table).delete().eq("id", b.id); return NextResponse.json({ ok: true });
}

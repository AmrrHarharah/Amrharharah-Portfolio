import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
const ok = (s: any) => typeof s === "string" && /^[a-z0-9-]{1,80}$/.test(s);
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug"); const s = db();
  if (!s || !ok(slug)) return NextResponse.json({ views: 0, likes: 0 });
  const { data } = await s.from("project_stats").select("views,likes").eq("slug", slug).maybeSingle();
  return NextResponse.json(data ?? { views: 0, likes: 0 });
}
export async function POST(req: Request) {
  const s = db(); const b = await req.json().catch(() => ({}));
  if (!s || !ok(b.slug) || !["view", "like", "unlike"].includes(b.action)) return NextResponse.json({ views: 0, likes: 0 });
  const { data } = await s.rpc("bump_stat", { p_slug: b.slug, p_field: b.action });
  return NextResponse.json(data ?? { views: 0, likes: 0 });
}

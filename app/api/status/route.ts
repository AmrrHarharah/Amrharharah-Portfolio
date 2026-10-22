import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export async function GET() {
  const s = db(); if (!s) return NextResponse.json({ open: true });
  const { data } = await s.from("settings").select("value").eq("key", "open_for_work").maybeSingle();
  return NextResponse.json({ open: data ? data.value === "true" : true });
}

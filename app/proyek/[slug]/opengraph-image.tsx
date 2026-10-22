import { ImageResponse } from "next/og";
import { me, projects } from "@/lib/site";
export const alt = "Proyek"; export const size = { width: 1200, height: 630 }; export const contentType = "image/png";
export default function OG({ params }: { params: { slug: string } }) {
  const p = projects.find((x) => x.slug === params.slug);
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#141614", padding: 80, color: "#f4f2ec" }}>
    <div style={{ display: "flex", fontSize: 30, color: "#9fb8aa" }}>{me.name} · Proyek</div>
    <div style={{ display: "flex", flexDirection: "column" }}><div style={{ fontSize: 108, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>{p?.title ?? me.name}</div><div style={{ fontSize: 36, color: "#bdb8aa", marginTop: 24 }}>{p ? `${p.type} · ${p.year}` : ""}</div></div>
    <div style={{ display: "flex", width: 200, height: 10, background: "#5d7f6c", borderRadius: 5 }} /></div>, { ...size });
}

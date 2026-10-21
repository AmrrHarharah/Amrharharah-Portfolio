import { ImageResponse } from "next/og";
import { me, initials } from "@/lib/site";
export const runtime = "edge";
export const alt = "Portofolio"; export const size = { width: 1200, height: 630 }; export const contentType = "image/png";
export default function OG() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f4f2ec", padding: 80, color: "#141614" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30 }}><div style={{ width: 64, height: 64, borderRadius: 32, background: "#141614", color: "#f4f2ec", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700 }}>{initials}</div>{me.role}</div>
    <div style={{ display: "flex", flexDirection: "column" }}><div style={{ fontSize: 124, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{me.name}</div><div style={{ fontSize: 38, color: "#6f6d64", marginTop: 24, maxWidth: 900 }}>{me.tagline}</div></div>
    <div style={{ display: "flex", width: 200, height: 10, background: "#5d7f6c", borderRadius: 5 }} /></div>, { ...size });
}

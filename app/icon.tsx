import { ImageResponse } from "next/og";
import { initials } from "@/lib/site";
export const runtime = "edge";
export const size = { width: 64, height: 64 }; export const contentType = "image/png";
export default function Icon() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#141614", color: "#f4f2ec", fontSize: 28, fontWeight: 700, borderRadius: 32 }}>{initials}</div>, { ...size });
}

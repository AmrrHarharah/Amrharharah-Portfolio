"use client";
import { useEffect, useState } from "react";
import FluidImage from "./FluidImage";
// Teks tinggi (diregangkan vertikal) digambar ke canvas lalu dipakai sebagai gambar fluid.
export default function FluidText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [d, setD] = useState<{ src: string; ar: number } | null>(null);
  useEffect(() => {
    const fam =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-display")
        .trim() || "sans-serif";
    document.fonts.load(`900 200px ${fam}`).then(() => {
      const W = 2400,
        stretch = 1.55,
        c = document.createElement("canvas"),
        x = c.getContext("2d")!;
      let size = 400;
      x.font = `900 ${size}px ${fam}`;
      size *= 2300 / x.measureText(text).width;
      const font = `900 ${size}px ${fam}`;
      x.font = font;
      const m = x.measureText(text),
        asc = m.actualBoundingBoxAscent,
        H = Math.ceil((asc + m.actualBoundingBoxDescent) * stretch + 80);
      c.width = W;
      c.height = H;
      x.font = font;
      x.fillStyle = "#f4f2ec";
      x.textAlign = "center";
      x.textBaseline = "alphabetic";
      x.translate(W / 2, 40 + asc * stretch);
      x.scale(1, stretch);
      x.fillText(text, 0, 0);
      setD({ src: c.toDataURL("image/png"), ar: W / H });
    });
  }, [text]);
  return (
    <div
      className={className}
      style={{ aspectRatio: d ? String(d.ar) : "2400/900" }}
    >
      {d && <FluidImage src={d.src} alt={text} />}
    </div>
  );
}

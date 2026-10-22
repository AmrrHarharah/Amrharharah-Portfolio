"use client";
import { useEffect, useState } from "react";
import { Eye, Heart } from "lucide-react";
const post = (slug: string, action: string) =>
  fetch("/api/stats", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ slug, action }),
  })
    .then((r) => r.json())
    .catch(() => null);
// Jumlah dilihat (sekali per sesi) dan tombol suka (sekali per browser).
export default function ProjectStats({ slug }: { slug: string }) {
  const [s, setS] = useState({ views: 0, likes: 0 }),
    [liked, setLiked] = useState(false);
  useEffect(() => {
    setLiked(localStorage.getItem("liked:" + slug) === "1");
    const k = "viewed:" + slug;
    (async () => {
      let d;
      if (!sessionStorage.getItem(k)) {
        sessionStorage.setItem(k, "1");
        d = await post(slug, "view");
      } else
        d = await fetch(`/api/stats?slug=${slug}`)
          .then((r) => r.json())
          .catch(() => null);
      if (d && typeof d.views === "number") setS(d);
    })();
  }, [slug]);
  const toggle = () => {
    const n = !liked;
    setLiked(n);
    setS((v) => ({ ...v, likes: Math.max(0, v.likes + (n ? 1 : -1)) }));
    localStorage.setItem("liked:" + slug, n ? "1" : "0");
    post(slug, n ? "like" : "unlike");
  };
  return (
    <div className="mb-10 flex items-center gap-4 text-sm">
      <button
        onClick={toggle}
        aria-pressed={liked}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 transition ${liked ? "border-accent bg-accent text-white" : "border-line hover:border-ink"}`}
      >
        <Heart size={16} fill={liked ? "currentColor" : "none"} />
        {s.likes}
      </button>
      <span className="flex items-center gap-2 text-mute">
        <Eye size={16} />
        {s.views} dilihat
      </span>
    </div>
  );
}

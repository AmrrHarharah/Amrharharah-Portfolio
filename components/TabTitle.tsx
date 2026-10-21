"use client";
import { useEffect } from "react";
import { me } from "@/lib/site";
export default function TabTitle() {
  useEffect(() => {
    let orig = document.title;
    const h = () => {
      if (document.hidden) {
        orig = document.title;
        document.title = me.awayTitle;
      } else document.title = orig;
    };
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
  }, []);
  return null;
}

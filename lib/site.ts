// Lapisan pengaman: membaca data/content.ts dan memberi nilai bawaan untuk field opsional.
import * as c from "@/data/content";
import { sampleTestimonials } from "./sample-testimonials";
const x = c as any;
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const base: any = { tagline: "", photo: "", cv: "", awayTitle: "Kembali ya 👋", siteUrl: "http://localhost:3000", socials: [], testimonials: [], ...x.me };
const mine: any[] = base.testimonials ?? []; // kurang dari 7 → dilengkapi contoh agar tampilan penuh
export const me: any = { ...base, tagline: base.tagline || base.intro, testimonials: mine.length >= 7 ? mine : [...mine, ...sampleTestimonials.slice(0, 7 - mine.length)] };
export const projects: any[] = (x.projects ?? []).map((p: any, i: number) => ({ slug: slugify(p.title), image: "", summary: "", problem: "", role: "", result: "", link: p.href && p.href !== "#" ? p.href : "", github: "", ...p, image: p.image || `/projects/placeholder-${(i % 4) + 1}.svg` }));
export const skills: any[] = x.skills ?? [];
export const jobs: any[] = x.jobs ?? [];
export const initials: string = String(me.name).split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

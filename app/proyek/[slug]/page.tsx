import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/lib/site";
import Heading from "@/components/Heading";
import Footer from "@/components/Footer";
import ProjectStats from "@/components/ProjectStats";
export const dynamicParams = false;
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = projects.find((x) => x.slug === params.slug);
  return p ? { title: p.title, description: p.summary || `${p.type} · ${p.stack}` } : {};
}
export default function ProjectPage({ params }: { params: { slug: string } }) {
  const i = projects.findIndex((x) => x.slug === params.slug); if (i < 0) notFound();
  const p = projects[i], next = projects[(i + 1) % projects.length];
  const blocks = [["Ringkasan", p.summary], ["Masalah", p.problem], ["Peran saya", p.role], ["Hasil", p.result]].filter((b) => b[1]);
  const btn = "inline-flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 text-sm transition hover:bg-ink hover:text-paper";
  return (<><main id="main" className="relative z-10 min-h-screen rounded-b-[2.5rem] bg-paper px-6 pb-24 pt-36 md:px-10">
    <a href="/#proyek" className="mb-10 inline-flex items-center gap-2 text-sm text-mute hover:text-ink"><ArrowLeft size={16} />Semua proyek</a>
    <Heading>{p.title}</Heading>
    <dl className="mb-12 grid max-w-3xl grid-cols-2 gap-6 border-y border-line py-6 text-sm md:grid-cols-4">
      {[["Tahun", p.year], ["Jenis", p.type], ["Stack", p.stack]].map(([k, v]) => (<div key={k} className={k === "Stack" ? "col-span-2" : ""}><dt className="text-mute">{k}</dt><dd className="mt-1 font-medium">{v}</dd></div>))}</dl>
    <ProjectStats slug={p.slug} />
    {p.image && /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.image} alt={p.title} className="mb-16 w-full rounded-[2rem] object-cover" />}
    <div className="grid max-w-5xl gap-12">{blocks.map(([k, v]) => (<section key={k} className="grid gap-4 md:grid-cols-[1fr_2.5fr]"><h2 className="font-serif text-2xl">{k}</h2><p className="text-lg leading-relaxed text-mute">{v}</p></section>))}</div>
    <div className="mt-12 flex flex-wrap gap-3">{p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className={btn}>Lihat situs<ArrowUpRight size={16} /></a>}{p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" className={btn}><Github size={16} />Kode sumber</a>}</div>
    {projects.length > 1 && <a href={`/proyek/${next.slug}`} className="mt-24 block border-t border-line pt-8"><span className="text-sm text-mute">Proyek berikutnya</span>
      <span className="mt-2 flex items-center justify-between gap-4 font-serif text-4xl md:text-7xl">{next.title}<ArrowUpRight className="shrink-0" size={40} /></span></a>}
  </main><Footer /></>);
}

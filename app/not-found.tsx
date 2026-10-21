import FluidText from "@/components/FluidText";
export default function NotFound() {
  return (<main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-ink px-6 text-center text-paper">
    <FluidText text="404" className="w-full max-w-md" />
    <p className="font-serif text-3xl md:text-5xl">Halaman ini tersesat.</p>
    <a href="/" className="rounded-full border border-white/30 px-6 py-3 transition hover:bg-paper hover:text-ink">Kembali ke beranda</a></main>);
}

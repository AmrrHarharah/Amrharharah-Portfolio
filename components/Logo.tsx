import { initials } from "@/lib/site";
// Monogram dari inisial nama, dengan titik status berdenyut.
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative grid h-9 w-9 place-items-center rounded-full bg-ink font-serif text-[13px] text-paper ${className}`}
    >
      {initials}
      <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-paper" />
      </span>
    </span>
  );
}

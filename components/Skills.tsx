import { Code2 } from "lucide-react";
import { skills } from "@/lib/site";
import { tech } from "@/lib/icons";
import Heading from "./Heading";
const fallback = { Icon: Code2, bg: "#444", fg: "#fff" };
export default function Skills() {
  return (
    <section id="keahlian" className="px-6 py-32 md:px-10">
      <Heading>Keahlian</Heading>
      <div className="grid gap-12 lg:grid-cols-3">
        {skills.map((s) => (
          <div key={s.group}>
            <h3 className="mb-5 border-b border-line pb-3 font-serif text-3xl">
              {s.group}
            </h3>
            <ul className="grid grid-cols-2 gap-3">
              {s.items.map((x) => {
                const t = tech[x] ?? fallback;
                const I = t.Icon;
                return (
                  <li
                    key={x}
                    style={{ "--c": t.bg } as React.CSSProperties}
                    className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-3 transition-all duration-200 hover:-translate-y-1 hover:border-transparent hover:bg-[var(--c)] hover:text-white"
                  >
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white transition-transform duration-500 group-hover:rotate-[360deg] group-hover:!bg-white/20"
                      style={{ background: t.bg }}
                    >
                      <I size={20} />
                    </span>
                    <span className="text-sm font-medium">{x}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

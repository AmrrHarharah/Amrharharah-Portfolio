import { Globe, Download } from "lucide-react";
import { me } from "@/lib/site";
import { social } from "@/lib/social";
import FluidText from "./FluidText";
import Magnetic from "./Magnetic";
import ContactForm from "./ContactForm";
const chip =
  "flex items-center gap-3 rounded-full border border-white/15 bg-white/5 py-2 pl-2 pr-5 text-sm transition hover:border-white/40 hover:bg-white/10";
const tile = "grid h-9 w-9 place-items-center rounded-full text-white";
// Footer menempel di belakang; konten di atasnya terangkat dan membuka footer (curtain reveal).
export default function Footer() {
  return (
    <footer
      id="contact"
      className="sticky bottom-0 z-0 flex min-h-[90vh] flex-col justify-between bg-ink px-6 pb-6 pt-28 text-paper md:px-10"
    >
      <div>
        <p className="font-serif text-3xl md:text-5xl">
          Let's Connect.
        </p>
        <a
          href={`mailto:${me.email}`}
          className="mt-6 inline-block text-xl underline underline-offset-8 hover:text-accent"
        >
          {me.email}
        </a>
        <ul className="mt-10 flex flex-wrap gap-3">
          <li>
            <Magnetic>
              <ContactForm />
            </Magnetic>
          </li>
          {(me.socials as any[]).map((s) => {
            const k = social[String(s.label).toLowerCase()],
              I = k?.Icon ?? Globe;
            return (
              <li key={s.label}>
                <Magnetic>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={chip}
                  >
                    <span
                      className={tile}
                      style={{ background: k?.bg ?? "#555" }}
                    >
                      <I size={16} />
                    </span>
                    {s.label}
                  </a>
                </Magnetic>
              </li>
            );
          })}
          {me.cv && (
            <li>
              <Magnetic>
                <a href={me.cv} download className={chip}>
                  <span className={tile} style={{ background: "#5d7f6c" }}>
                    <Download size={16} />
                  </span>
                  Unduh CV
                </a>
              </Magnetic>
            </li>
          )}
        </ul>
      </div>
      <div>
        <FluidText text={me.name.toUpperCase()} className="mt-16 w-full" />
        <div className="mt-6 flex flex-wrap justify-between gap-2 text-sm text-white/50">
          <span>{me.city}</span>
          <span className="hidden md:block">Tekan Ctrl + K untuk pintasan</span>
          <span>
            © {new Date().getFullYear()} {me.name}
          </span>
        </div>
      </div>
    </footer>
  );
}

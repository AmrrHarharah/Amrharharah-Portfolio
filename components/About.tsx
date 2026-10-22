import TextReveal from "./TextReveal";
import ParallaxImage from "./ParallaxImage";
import Stats from "./Stats";
import { me } from "@/lib/site";
export default function About() {
  return (
    <section id="tentang" className="px-6 py-40 md:px-10">
      <div
        className={`mx-auto grid max-w-6xl items-center gap-16 ${me.photo ? "md:grid-cols-[1fr_1.6fr]" : ""}`}
      >
        {me.photo && <ParallaxImage src={me.photo} alt={me.name} />}
        <TextReveal
          text={me.about}
          className={`font-serif leading-tight ${me.photo ? "text-2xl md:text-4xl" : "text-3xl md:text-6xl"}`}
        />
      </div>
      <Stats />
    </section>
  );
}

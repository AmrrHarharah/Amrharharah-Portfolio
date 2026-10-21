import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ScrollZoom from "@/components/ScrollZoom";
import Projects from "@/components/Projects";
import Marquee from "@/components/Marquee";
import Skills from "@/components/Skills";
import TechStack from "@/components/TechStack";
import Experience from "@/components/Experience";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
export default function Page() {
  return (<><Preloader /><main className="relative z-10">
    <Hero />
    <div className="relative z-10 rounded-[2.5rem] bg-paper">
      <About /><ScrollZoom /><Projects /><Marquee text="Terbuka untuk proyek baru ✦" /><Skills /><TechStack /><Experience /><Testimonials />
    </div></main><Footer /></>);
}

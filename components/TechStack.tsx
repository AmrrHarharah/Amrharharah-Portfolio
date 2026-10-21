"use client";
import { useEffect, useRef } from "react";
import Matter from "matter-js";
import { RotateCcw } from "lucide-react";
import { tech } from "@/lib/icons";
import Heading from "./Heading";
const names = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "GSAP",
  "shadcn/ui",
  "GitHub",
  "Vercel",
  "Figma",
  "Cursor",
];
// Pill jatuh dengan fisika (matter-js), bisa di-grab dan dilempar.
export default function TechStack() {
  const box = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const respawn = useRef<() => void>(() => {});
  useEffect(() => {
    const el = box.current!,
      M = Matter;
    let engine: Matter.Engine | undefined,
      runner: Matter.Runner | undefined,
      raf = 0,
      started = false;
    const spawnX = (W: number) => W * 0.15 + Math.random() * W * 0.7;
    const start = () => {
      started = true;
      const W = el.clientWidth,
        H = el.clientHeight;
      engine = M.Engine.create();
      const wall = (x: number, y: number, w: number, h: number) =>
        M.Bodies.rectangle(x, y, w, h, { isStatic: true });
      const bodies = names.map((_, i) => {
        const n = els.current[i]!;
        return M.Bodies.rectangle(
          spawnX(W),
          -60 - i * 70,
          n.offsetWidth,
          n.offsetHeight,
          {
            chamfer: { radius: n.offsetHeight / 2 },
            restitution: 0.35,
            friction: 0.4,
            angle: (Math.random() - 0.5) * 1.2,
          },
        );
      });
      M.Composite.add(engine.world, [
        wall(W / 2, H + 30, W * 2, 60),
        wall(-30, H / 2, 60, H * 4),
        wall(W + 30, H / 2, 60, H * 4),
        wall(W / 2, -1500, W * 2, 60),
        ...bodies,
      ]);
      if (!matchMedia("(pointer: coarse)").matches) {
        const mouse = M.Mouse.create(el) as any; // biarkan scroll halaman tetap jalan
        ["wheel", "mousewheel", "DOMMouseScroll"].forEach((ev) =>
          el.removeEventListener(ev, mouse.mousewheel),
        );
        M.Composite.add(
          engine.world,
          M.MouseConstraint.create(engine, {
            mouse,
            constraint: { stiffness: 0.2, render: { visible: false } },
          } as any),
        );
      }
      runner = M.Runner.create();
      M.Runner.run(runner, engine);
      const tick = () => {
        bodies.forEach((b, i) => {
          const n = els.current[i];
          if (n)
            n.style.transform = `translate(${b.position.x - n.offsetWidth / 2}px,${b.position.y - n.offsetHeight / 2}px) rotate(${b.angle}rad)`;
        });
        raf = requestAnimationFrame(tick);
      };
      tick();
      respawn.current = () =>
        bodies.forEach((b, i) => {
          M.Body.setPosition(b, { x: spawnX(W), y: -60 - i * 70 });
          M.Body.setVelocity(b, { x: 0, y: 0 });
          M.Body.setAngle(b, (Math.random() - 0.5) * 1.2);
        });
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) start();
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      if (runner) M.Runner.stop(runner);
      if (engine) {
        M.Composite.clear(engine.world, false);
        M.Engine.clear(engine);
      }
    };
  }, []);
  return (
    <section className="px-6 py-32 md:px-10">
      <Heading>Stack</Heading>
      <div
        ref={box}
        className="relative h-[420px] overflow-hidden rounded-[2.5rem] bg-ink md:h-[480px]"
      >
        <button
          onClick={() => respawn.current()}
          aria-label="Jatuhkan ulang"
          className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white transition hover:bg-white/20"
        >
          <RotateCcw size={18} />
        </button>
        {names.map((n, i) => {
          const t = tech[n],
            I = t.Icon;
          return (
            <div
              key={n}
              ref={(r) => {
                els.current[i] = r;
              }}
              style={{
                background: t.bg,
                color: t.fg,
                transform: "translate(-9999px,0)",
              }}
              className="absolute left-0 top-0 flex cursor-grab select-none items-center gap-3 rounded-2xl border border-white/10 py-2.5 pl-2.5 pr-5 text-lg font-semibold active:cursor-grabbing"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/20">
                <I size={22} />
              </span>
              {n}
            </div>
          );
        })}
      </div>
    </section>
  );
}

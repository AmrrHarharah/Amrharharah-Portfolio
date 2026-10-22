"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { jobs } from "@/lib/site";
import Heading from "./Heading";
// Garis menjalar mengikuti scroll; tiap item muncul bergantian kiri/kanan saat garis sampai.
export default function Experience() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 60%", "end 60%"],
  });
  const h = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <section id="experience" className="overflow-x-clip px-6 py-32 md:px-10">
      <Heading>Experience</Heading>
      <div ref={ref} className="relative">
        <div className="absolute bottom-0 left-3 top-0 w-px bg-line md:left-1/2" />
        <motion.div
          style={{ scaleY: h }}
          className="absolute bottom-0 left-3 top-0 w-px origin-top bg-accent md:left-1/2"
        />
        <ul>
          {jobs.map((j, i) => {
            const left = i % 2 === 0;
            return (
              <motion.li
                key={j.role}
                initial="off"
                whileInView="on"
                viewport={{ margin: "0px 0px -45% 0px" }}
                className="relative grid gap-x-24 py-12 pl-10 md:grid-cols-2 md:pl-0"
              >
                <span className="absolute left-3 top-16 -translate-x-1/2 md:left-1/2">
                  <motion.span
                    variants={{
                      off: { scale: 0, backgroundColor: "#ddd9ce" },
                      on: { scale: 1, backgroundColor: "#5d7f6c" },
                    }}
                    transition={{ duration: 0.3 }}
                    className="block h-3.5 w-3.5 rounded-full ring-4 ring-paper"
                  />
                </span>
                <motion.div
                  variants={{
                    off: { opacity: 0, x: left ? -80 : 80 },
                    on: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={`md:row-start-1 ${left ? "md:col-start-1 md:text-right" : "md:col-start-2"}`}
                >
                  <p className="mb-1 text-mute md:hidden">{j.period}</p>
                  <h3 className="text-2xl font-medium">
                    {j.role}, {j.org}
                  </h3>
                  <p className="mt-2 text-mute">{j.note}</p>
                </motion.div>
                <motion.div
                  variants={{
                    off: { opacity: 0, x: left ? 80 : -80 },
                    on: { opacity: 1, x: 0 },
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`hidden font-serif text-5xl text-mute md:row-start-1 md:block ${left ? "md:col-start-2" : "md:col-start-1 md:text-right"}`}
                >
                  {j.period}
                </motion.div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

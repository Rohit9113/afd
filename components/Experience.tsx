"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { HiOutlineArrowRight } from "react-icons/hi2";
import SectionBg from "./SectionBg";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring" as const, stiffness: 400, damping: 17 };
const MotionLink = motion.create(Link);

const items = [
  { emoji: "🌱", title: "Source To Table", text: "Direct relationships with heritage grain farmers, ensuring sustainable sourcing." },
  { emoji: "🪵", title: "Time-Honored Techniques", text: "Slow Bilona churning, traditional stone-milling, and authentic methods." },
  { emoji: "✅", title: "Unwavering Purity", text: "No refined oils, no additives, just pure, wholesome ingredients." },
  { emoji: "🤝", title: "Commitment to Community", text: "Fair trade practices and direct support to rural farming families." },
];

const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function Experience() {
  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <SectionBg />

      <div className="relative mx-auto max-w-7xl px-4">
        {/* ---------- Heading ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-green-950 md:text-4xl">The Brand Experience</h2>
          <p className="mt-2 text-lg text-green-800/80">असली स्वाद की एक सच्ची यात्रा</p>

          {/* Underline: beech se dono taraf failti hai */}
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="mx-auto mt-3 block h-1 w-16 rounded-full bg-linear-to-r from-green-700 to-amber-400"
          />
        </motion.div>

        {/* ---------- Cards ---------- */}
        <motion.ul
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Desktop par cards ko jodti hui line */}
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.6, ease: EASE }}
            className="absolute left-[12%] right-[12%] top-[3.1rem] hidden h-px origin-left border-t-2 border-dashed border-green-700/30 lg:block"
          />

          {items.map((it, i) => (
            <motion.li
              key={it.title}
              variants={card}
              whileHover={{ y: -8, scale: 1.04 }}
              transition={SPRING}
              className="group relative rounded-2xl border border-white bg-white/90 p-6 text-center shadow-md backdrop-blur-sm transition-shadow hover:shadow-2xl"
            >
              {/* Step number */}
              <span className="absolute right-4 top-3 text-3xl font-black text-green-900/10 transition-colors group-hover:text-amber-400/50">
                0{i + 1}
              </span>

              {/* Emoji circle */}
              <motion.div
                whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-green-50 to-amber-50 text-4xl shadow-inner ring-2 ring-green-200 transition-shadow group-hover:ring-green-600"
              >
                {it.emoji}
              </motion.div>

              <h3 className="mt-5 text-lg font-semibold text-green-950">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-green-900/70">{it.text}</p>

              {/* Hover par neeche gradient line */}
              <span className="absolute inset-x-6 bottom-0 h-1 origin-center scale-x-0 rounded-full bg-linear-to-r from-green-700 to-amber-400 transition-transform duration-300 group-hover:scale-x-100" />
            </motion.li>
          ))}
        </motion.ul>

        {/* ---------- CTA ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          className="mt-12 text-center"
        >
          <MotionLink
            href="/about"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={SPRING}
            className="group inline-flex items-center gap-2 rounded-full bg-green-800 px-8 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-green-700 hover:shadow-xl"
          >
            EXPLORE OUR HERITAGE
            <HiOutlineArrowRight className="transition-transform group-hover:translate-x-1" />
          </MotionLink>
        </motion.div>
      </div>
    </section>
  );
}
"use client";

import { useRef } from "react";
import { motion, type Variants } from "motion/react";
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiStar } from "react-icons/hi2";
import { testimonials } from "@/data/products";
import SectionBg from "./SectionBg";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring" as const, stiffness: 400, damping: 17 };

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const cardIn: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const starsIn: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.4 } },
};

const starItem: Variants = {
  hidden: { opacity: 0, scale: 0, rotate: -90 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 500, damping: 18 } },
};

const getInitials = (name: string) =>
  name
    .replace(/\./g, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 340, behavior: "smooth" });

  const arrow =
    "hidden h-10 w-10 items-center justify-center rounded-full border border-green-200 bg-white/80 text-green-900 shadow-sm backdrop-blur-sm transition-colors hover:bg-green-800 hover:text-white md:flex";

  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <SectionBg />

      <div className="relative mx-auto max-w-7xl px-4">
        {/* ---------- Heading + arrows ---------- */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <h2 className="text-3xl font-bold text-green-950 md:text-4xl">Loved By Our Customers</h2>
            <p className="mt-1 text-sm text-green-900/70 md:text-base">Real words from real families</p>
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              className="mt-3 block h-1 w-16 origin-left rounded-full bg-linear-to-r from-green-700 to-amber-400"
            />
          </motion.div>

          <div className="flex gap-2">
            <motion.button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              transition={SPRING}
              className={arrow}
            >
              <HiOutlineChevronLeft size={20} />
            </motion.button>
            <motion.button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              transition={SPRING}
              className={arrow}
            >
              <HiOutlineChevronRight size={20} />
            </motion.button>
          </div>
        </div>

        {/* ---------- Cards ---------- */}
        <motion.div
          ref={ref}
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="flex snap-x gap-5 overflow-x-auto px-1 pb-10 pt-6 scrollbar-none"
        >
          {testimonials.map((t) => (
            <motion.article
              key={t.name + t.title}
              variants={cardIn}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={SPRING}
              className="group relative flex w-80 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-white bg-white/90 p-6 shadow-md backdrop-blur-sm transition-shadow hover:shadow-2xl"
            >
              {/* Bada quote mark */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-2 right-4 select-none font-serif text-8xl leading-none text-green-900/10 transition-colors group-hover:text-amber-400/40"
              >
                “
              </span>

              {/* Stars */}
              <motion.div variants={starsIn} className="relative flex gap-0.5 text-amber-400" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.span key={i} variants={starItem} className="block">
                    <HiStar size={18} />
                  </motion.span>
                ))}
              </motion.div>

              <h3 className="relative mt-3 text-lg font-semibold text-green-950">{t.title}</h3>
              <p className="relative mt-2 flex-1 text-sm leading-relaxed text-green-900/75">{t.text}</p>

              {/* Customer */}
              <div className="relative mt-5 flex items-center gap-3 border-t border-green-100 pt-4">
                <motion.span
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-green-700 to-emerald-500 text-sm font-bold text-white shadow"
                >
                  {getInitials(t.name)}
                </motion.span>
                <div>
                  <p className="text-sm font-bold text-green-950">{t.name}</p>
                  <p className="text-xs font-medium text-green-700">Bought: {t.product}</p>
                </div>
              </div>

              {/* Hover par neeche gradient line */}
              <span className="absolute inset-x-6 bottom-0 h-1 origin-center scale-x-0 rounded-full bg-linear-to-r from-green-700 to-amber-400 transition-transform duration-300 group-hover:scale-x-100" />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
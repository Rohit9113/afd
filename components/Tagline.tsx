"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

const POINTS = ["TRADITIONAL", "WHOLESOME", "CRAFTED WITH CARE"];

const FLOATERS = [
  { emoji: "🌾", left: "8%", size: "text-2xl", duration: 14, delay: 0 },
  { emoji: "🍃", left: "28%", size: "text-xl", duration: 18, delay: 3 },
  { emoji: "🌿", left: "50%", size: "text-2xl", duration: 16, delay: 6 },
  { emoji: "🌾", left: "70%", size: "text-xl", duration: 19, delay: 2 },
  { emoji: "🍃", left: "90%", size: "text-2xl", duration: 15, delay: 5 },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const pointItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function Tagline() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-green-950 py-16 text-center text-white md:py-20">
      {/* ---------- Background ---------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-green-950 via-green-900 to-emerald-900" />

        {/* Dots */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff22 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Tairte glow blobs */}
        <motion.div
          animate={reduceMotion ? undefined : { x: [0, 40, 0], y: [0, 25, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
        />
        <motion.div
          animate={reduceMotion ? undefined : { x: [0, -40, 0], y: [0, -25, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl"
        />

        {/* Neeche se upar uthte patte aur anaaj */}
        {!reduceMotion &&
          FLOATERS.map((f, i) => (
            <motion.span
              key={i}
              initial={{ y: 40, opacity: 0, rotate: 0 }}
              animate={{ y: -420, opacity: [0, 0.45, 0.45, 0], rotate: [0, 40, -30, 60] }}
              transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: "linear" }}
              className={`absolute bottom-0 select-none ${f.size}`}
              style={{ left: f.left }}
            >
              {f.emoji}
            </motion.span>
          ))}
      </div>

      {/* ---------- Content ---------- */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="relative mx-auto max-w-4xl px-4"
      >
        {/* Heading */}
        <h2 className="flex flex-wrap items-center justify-center gap-x-4 text-4xl font-extrabold tracking-wide md:gap-x-6 md:text-6xl">
          <motion.span variants={rise} className="inline-block">
            EAT{" "}
            {/* PURE: gold shimmer */}
            <motion.span
              animate={reduceMotion ? undefined : { backgroundPosition: ["0% center", "200% center"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% auto" }}
              className="inline-block bg-linear-to-r from-amber-300 via-white to-amber-300 bg-clip-text text-transparent"
            >
              PURE.
            </motion.span>
          </motion.span>

          <motion.span variants={rise} className="inline-block">
            LIVE{" "}
            <motion.span
              animate={reduceMotion ? undefined : { backgroundPosition: ["200% center", "0% center"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% auto" }}
              className="inline-block bg-linear-to-r from-emerald-300 via-white to-emerald-300 bg-clip-text text-transparent"
            >
              WELL.
            </motion.span>
          </motion.span>
        </h2>

        {/* Decorative line: beech se dono taraf failti hai */}
        <motion.div
          variants={{
            hidden: { scaleX: 0, opacity: 0 },
            show: { scaleX: 1, opacity: 1, transition: { duration: 0.8, ease: EASE } },
          }}
          className="mx-auto mt-6 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-linear-to-r from-transparent to-amber-300 md:w-28" />
          <span className="text-lg">🌿</span>
          <span className="h-px w-16 bg-linear-to-l from-transparent to-amber-300 md:w-28" />
        </motion.div>

        {/* Points */}
        <motion.ul
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } } }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs tracking-[0.25em] text-green-200 md:text-sm md:tracking-[0.3em]"
        >
          {POINTS.map((point, i) => (
            <motion.li key={point} variants={pointItem} className="flex items-center gap-3">
              <motion.span
                whileHover={{ scale: 1.1, color: "#fcd34d" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="inline-block cursor-default"
              >
                {point}
              </motion.span>
              {i < POINTS.length - 1 && <span className="text-amber-300/70">|</span>}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
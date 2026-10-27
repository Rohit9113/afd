"use client";

import { motion, useReducedMotion } from "motion/react";

// Fixed positions (random nahi) taaki hydration error na aaye
const FLOATERS = [
  { emoji: "🌾", left: "6%", size: "text-2xl", duration: 16, delay: 0 },
  { emoji: "🍃", left: "22%", size: "text-xl", duration: 20, delay: 4 },
  { emoji: "🌿", left: "41%", size: "text-2xl", duration: 18, delay: 8 },
  { emoji: "🌾", left: "58%", size: "text-xl", duration: 22, delay: 2 },
  { emoji: "🍃", left: "76%", size: "text-2xl", duration: 17, delay: 6 },
  { emoji: "🌿", left: "92%", size: "text-xl", duration: 21, delay: 10 },
];

export default function SectionBg() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Gradient (category section jaisa) */}
      <div className="absolute inset-0 bg-linear-to-b from-amber-50 via-orange-50/60 to-green-50" />

      {/* Dots pattern */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle, #16a34a33 1.5px, transparent 1.5px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Tairte blobs */}
      <motion.div
        animate={reduceMotion ? undefined : { x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-green-300/30 blur-3xl"
      />
      <motion.div
        animate={reduceMotion ? undefined : { x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-amber-300/40 blur-3xl"
      />

      {/* Neeche se upar uthte patte aur anaaj */}
      {!reduceMotion &&
        FLOATERS.map((f, i) => (
          <motion.span
            key={i}
            initial={{ y: 40, opacity: 0, rotate: 0 }}
            animate={{ y: -700, opacity: [0, 0.5, 0.5, 0], rotate: [0, 40, -30, 60] }}
            transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: "linear" }}
            className={`absolute bottom-0 select-none ${f.size}`}
            style={{ left: f.left }}
          >
            {f.emoji}
          </motion.span>
        ))}

      {/* Upar aur neeche smooth blend */}
      <div className="absolute inset-x-0 top-0 h-6 bg-linear-to-b from-white to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-6 bg-linear-to-t from-white to-transparent" />
    </div>
  );
}
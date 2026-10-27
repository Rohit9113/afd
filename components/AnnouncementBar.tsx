"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

const MESSAGES = [
  { text: "✨ Make This Diwali Extra Special 🪔", href: "/collections/diwali-special" },
  { text: "🚚 Free Shipping on orders above ₹499", href: "/collections/all" },
  { text: "🌿 100% Pure | No Additives | Lab Tested", href: "/lab-reports" },
];

const INTERVAL_MS = 3500;

const arrowBtn =
  "absolute top-1/2 z-10 hidden -translate-y-1/2 rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/15 hover:text-white sm:block";

export default function AnnouncementBar() {
  const reduceMotion = useReducedMotion();

  // [index, direction]: direction 1 = next (neeche se upar), -1 = prev
  const [[index, direction], setPage] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);

  const paginate = (dir: number) =>
    setPage(([i]) => [(i + dir + MESSAGES.length) % MESSAGES.length, dir]);

  // Har message badalne par timer naya shuru hota hai
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => paginate(1), INTERVAL_MS);
    return () => clearTimeout(t);
  }, [index, paused]);

  const slide = reduceMotion ? 0 : 100;
  const variants = {
    enter: (dir: number) => ({ y: `${dir * slide}%`, opacity: 0 }),
    center: { y: "0%", opacity: 1 },
    exit: (dir: number) => ({ y: `${-dir * slide}%`, opacity: 0 }),
  };

  const message = MESSAGES[index];

  return (
    <div
      role="region"
      aria-label="Announcements"
      className="relative h-9 overflow-hidden bg-green-800 text-sm text-white"
      // Sirf asli mouse par pause (touch par atakta nahi)
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      // Keyboard se focus aaye tab bhi pause
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <button onClick={() => paginate(-1)} aria-label="Previous announcement" className={`${arrowBtn} left-3`}>
        <HiOutlineChevronLeft size={14} />
      </button>

      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: reduceMotion ? 0.2 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
          aria-live="polite"
        >
          <Link
            href={message.href}
            className="flex h-full items-center justify-center px-10 text-center font-medium tracking-wide hover:underline"
          >
            {message.text}
          </Link>
        </motion.div>
      </AnimatePresence>

      <button onClick={() => paginate(1)} aria-label="Next announcement" className={`${arrowBtn} right-3`}>
        <HiOutlineChevronRight size={14} />
      </button>
    </div>
  );
}
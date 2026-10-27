"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { categories, type Category } from "@/data/products";
import SectionBg from "./SectionBg";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring" as const, stiffness: 400, damping: 17 };

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

/* ---------- Single category ---------- */
function CategoryItem({ c }: { c: Category }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = c.image && !imgFailed;

  return (
    <motion.li variants={item} className="shrink-0">
      <Link href={c.href} className="group flex w-24 flex-col items-center gap-2 text-center md:w-28">
        <div className="relative">
          {/* Hover par bahar ki taraf failti hui ring */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-green-500/40 opacity-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-0 group-hover:animate-ping"
          />

          <motion.div
            whileHover={{ scale: 1.12, y: -6 }}
            whileTap={{ scale: 0.95 }}
            transition={SPRING}
            className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-green-500 shadow-md ring-2 ring-white transition-shadow group-hover:shadow-xl group-hover:ring-green-700 md:h-24 md:w-24"
          >
            {showImage ? (
              <Image
                src={c.image!}
                alt={c.name}
                fill
                sizes="96px"
                onError={() => setImgFailed(true)}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <span className="text-3xl md:text-4xl">{c.emoji}</span>
            )}
          </motion.div>
        </div>

        <span className="relative text-xs font-semibold text-green-950 transition-colors group-hover:text-green-700 md:text-sm">
          {c.name}
          {/* Naam ke neeche hover par underline */}
          <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-linear-to-r from-green-700 to-amber-400 transition-transform duration-300 group-hover:scale-x-100" />
        </span>
      </Link>
    </motion.li>
  );
}

/* ---------- Section ---------- */
export default function Categories() {
  return (
    <section aria-label="Shop by category" className="relative overflow-hidden">
      <SectionBg />

      <div className="relative mx-auto max-w-7xl px-4 py-12">
        {/* ---------- Heading ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-green-950 md:text-3xl">Products</h2>
          <p className="mt-1 text-sm text-green-900/70 md:text-base">Explore our pure & traditional range</p>

          {/* Underline: beech se dono taraf failti hai */}
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="mx-auto mt-3 block h-1 w-16 rounded-full bg-linear-to-r from-green-700 to-amber-400"
          />
        </motion.div>

        {/* ---------- Categories ---------- */}
        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="flex gap-5 overflow-x-auto px-2 pb-6 pt-8 scrollbar-none md:justify-center md:gap-8"
        >
          {categories.map((c) => (
            <CategoryItem key={c.href} c={c} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
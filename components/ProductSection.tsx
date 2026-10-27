"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";
import SectionBg from "./SectionBg";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring" as const, stiffness: 400, damping: 17 };
const MotionLink = motion.create(Link);

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

type Props = {
  title: string;
  subtitle?: string;
  products: Product[];
  href: string;
};

export default function ProductSection({ title, subtitle, products, href }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 540, behavior: "smooth" });

  const arrow =
    "hidden h-10 w-10 items-center justify-center rounded-full border border-green-200 bg-white/80 text-green-900 shadow-sm backdrop-blur-sm transition-colors hover:bg-green-800 hover:text-white md:flex";

  return (
    <section className="relative overflow-hidden">
      <SectionBg />

      <div className="relative mx-auto max-w-7xl px-4 py-12">
        {/* Heading */}
        <div className="mb-4 flex items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <h2 className="text-2xl font-bold text-green-950 md:text-3xl">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-green-900/70 md:text-base">{subtitle}</p>}
            <span className="mt-2 block h-1 w-14 rounded-full bg-linear-to-r from-green-700 to-amber-400" />
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

        {/* Cards */}
        <motion.div
          ref={ref}
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="flex snap-x gap-5 overflow-x-auto px-1 pb-8 pt-4 scrollbar-none"
        >
          {products.map((p) => (
            <motion.div key={p.id} variants={cardIn} className="shrink-0 snap-start">
              <ProductCard p={p} />
            </motion.div>
          ))}
        </motion.div>

        {/* View more */}
        <div className="text-center">
          <MotionLink
            href={href}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={SPRING}
            className="inline-block rounded-full border-2 border-green-800 bg-white/70 px-9 py-2.5 text-sm font-bold text-green-800 backdrop-blur-sm transition-colors hover:bg-green-800 hover:text-white"
          >
            VIEW MORE
          </MotionLink>
        </div>
      </div>
    </section>
  );
}
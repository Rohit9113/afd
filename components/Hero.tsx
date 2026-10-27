"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { HiOutlineArrowRight, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

/* ---------- Config ----------
 * fit: "cover"   -> banner poora bharta hai (wide banner ke liye best)
 * fit: "contain" -> poori image dikhti hai (kuch nahi katta), side me blur background
 * position       -> subject kis taraf hai: "center", "right center", "left center", "center top"
 */
type Slide = {
  tag: string;
  title: string;
  sub: string;
  cta: string;
  href: string;
  image: string;
  alt: string;
  fit: "cover" | "contain";
  position: string;
  fallback: string; // sirf tab dikhta hai jab image load na ho
};

const SLIDES: Slide[] = [
  {
    tag: "Festive Special",
    title: "Diwali Hampers",
    sub: "Pure sweets & gifts for your loved ones",
    cta: "Shop Hampers",
    href: "/hampers",
    image: "/images/b1.png",
    alt: "Diwali gift hampers",
    fit: "cover",
    position: "center",
    fallback: "from-orange-500 to-amber-400",
  },
  {
    tag: "Best Seller",
    title: "Gir Cow A2 Bilona Ghee",
    sub: "Hand churned, golden & grainy",
    cta: "Shop Ghee",
    href: "/collections/ghee",
    image: "/images/b2.png",
    alt: "A2 Bilona ghee jar",
    fit: "cover",
    position: "right center",
    fallback: "from-yellow-500 to-amber-300",
  },
  {
    tag: "Healthy Choice",
    title: "Khapli Wheat Atta",
    sub: "Stone-ground, high fibre, gut friendly",
    cta: "Shop Atta",
    href: "/collections/atta",
    image: "/images/b3.png",
    alt: "Khapli wheat atta",
    fit: "cover",
    position: "center",
    fallback: "from-green-700 to-lime-500",
  },
];

const INTERVAL_MS = 5500; // auto-slide ka time
const SWIPE_THRESHOLD = 80;
const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring" as const, stiffness: 400, damping: 17 };
const MotionLink = motion.create(Link);

/* ---------- Animation variants ---------- */
const textContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const textItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const arrowBtn =
  "absolute inset-y-0 z-20 my-auto hidden h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/35 md:flex";

/* ---------- Component ---------- */
export default function Hero() {
  const reduceMotion = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState<number[]>([]); // jin images load nahi hui

  const slide = SLIDES[index];

  const paginate = (dir: number) => setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") paginate(1);
    if (e.key === "ArrowLeft") paginate(-1);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured offers"
      onKeyDown={onKeyDown}
      // Sirf asli mouse par pause, touch par atakta nahi
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      // Sirf keyboard (Tab) se focus aaye tab pause, mouse click par nahi
      onFocus={(e) => e.target.matches(":focus-visible") && setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative h-115 overflow-hidden bg-neutral-900 md:h-150"
    >
      {/* Auto-slide progress bar ke keyframes */}
      <style>{`@keyframes heroProgress{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>

      {/* ---------- Slides: sab ek saath mounted, sirf crossfade (koi color flash nahi) ---------- */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        dragSnapToOrigin
        onDragEnd={(_, { offset }) => {
          if (offset.x < -SWIPE_THRESHOLD) paginate(1);
          else if (offset.x > SWIPE_THRESHOLD) paginate(-1);
        }}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      >
        {SLIDES.map((s, i) => {
          const active = i === index;
          const hasFailed = failed.includes(i);

          return (
            <motion.div
              key={s.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${SLIDES.length}`}
              aria-hidden={!active}
              initial={false}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.9, ease: "easeInOut" }}
              className={`absolute inset-0 ${active ? "z-10" : "pointer-events-none z-0"} ${
                hasFailed ? `bg-linear-to-r ${s.fallback}` : ""
              }`}
            >
              {!hasFailed && (
                <motion.div
                  initial={false}
                  animate={{ scale: active && !reduceMotion ? 1 : 1.08 }}
                  // active: dheere zoom-out | inactive: fade ke baad chupke se reset
                  transition={active ? { duration: 7, ease: "linear" } : { duration: 0, delay: 1 }}
                  className="absolute inset-0"
                >
                  {/* contain mode me side ki khali jagah ke liye blur background */}
                  {s.fit === "contain" && (
                    <Image
                      src={s.image}
                      alt=""
                      aria-hidden
                      fill
                      sizes="100vw"
                      priority
                      draggable={false}
                      className="scale-125 object-cover opacity-80 blur-3xl"
                    />
                  )}

                  {/* Main image: priority se page khulte hi preload hoti hai */}
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="100vw"
                    quality={85}
                    priority
                    draggable={false}
                    onError={() => setFailed((f) => (f.includes(i) ? f : [...f, i]))}
                    style={{ objectPosition: s.position }}
                    className={s.fit === "contain" ? "object-contain" : "object-cover"}
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Text padhne ke liye overlay: mobile par neeche se, desktop par left se */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/15 to-transparent md:bg-linear-to-r md:from-black/70 md:via-black/25 md:to-transparent" />

      {/* ---------- Text content (sirf current slide ka) ---------- */}
      <div className="pointer-events-none relative z-20 mx-auto flex h-full max-w-7xl items-end px-6 pb-16 md:items-center md:px-10 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            variants={textContainer}
            initial="hidden"
            animate="show"
            exit="exit"
            className="pointer-events-auto max-w-xl text-white"
          >
            <motion.span
              variants={textItem}
              className="inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm"
            >
              {slide.tag}
            </motion.span>

            <motion.h2 variants={textItem} className="mt-3 text-3xl font-extrabold leading-tight md:mt-4 md:text-6xl">
              {slide.title}
            </motion.h2>

            <motion.p variants={textItem} className="mt-3 text-sm text-white/90 md:mt-4 md:text-xl">
              {slide.sub}
            </motion.p>

            <motion.div variants={textItem} className="mt-6 md:mt-8">
              <MotionLink
                href={slide.href}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={SPRING}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-green-900 shadow-lg transition-colors hover:bg-amber-400 hover:shadow-xl md:px-8"
              >
                {slide.cta}
                <HiOutlineArrowRight className="transition-transform group-hover:translate-x-1" />
              </MotionLink>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ---------- Arrows ---------- */}
      <motion.button
        onClick={() => paginate(-1)}
        aria-label="Previous slide"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        transition={SPRING}
        className={`${arrowBtn} left-4`}
      >
        <HiOutlineChevronLeft size={22} />
      </motion.button>
      <motion.button
        onClick={() => paginate(1)}
        aria-label="Next slide"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        transition={SPRING}
        className={`${arrowBtn} right-4`}
      >
        <HiOutlineChevronRight size={22} />
      </motion.button>

      {/* ---------- Dots + progress bar (AUTO-SLIDE yahin se chalta hai) ---------- */}
      <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
        {SLIDES.map((s, i) => {
          const active = i === index;
          return (
            <motion.button
              key={s.title}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={active}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              transition={SPRING}
              className={`relative h-1.5 overflow-hidden rounded-full transition-[width,background-color] duration-300 ${
                active ? "w-10 bg-white/40" : "w-6 bg-white/50 hover:bg-white/80"
              }`}
            >
              {active && (
                <span
                  key={index}
                  onAnimationEnd={() => paginate(1)}
                  className="absolute inset-0 origin-left rounded-full bg-white"
                  style={{
                    animation: `heroProgress ${INTERVAL_MS}ms linear forwards`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-4 right-6 z-30 hidden text-sm font-semibold tracking-widest text-white/80 md:block">
        {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>
    </section>
  );
}
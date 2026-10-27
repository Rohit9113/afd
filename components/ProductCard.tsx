"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { HiCheck, HiHeart, HiMinus, HiOutlineHeart, HiOutlineShoppingBag, HiPlus, HiStar } from "react-icons/hi2";
import type { Product } from "@/data/products";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

const SPRING = { type: "spring" as const, stiffness: 400, damping: 17 };

export default function ProductCard({ p }: { p: Product }) {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { add } = useCart();

  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const showImage = p.image && !imgFailed;
  const discount = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

  const handleAdd = () => {
    // Login nahi hai to login page par bhejo (login ke baad isi page par wapas aayega)
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    add(p, qty);
    setQty(1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.article
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={{
        rest: { scale: 1, y: 0 },
        hover: { scale: reduceMotion ? 1 : 1.05, y: -6 },
      }}
      transition={SPRING}
      className="group relative w-64 shrink-0 snap-start overflow-hidden rounded-2xl border bg-white p-3 shadow-md transition-shadow hover:shadow-2xl"
    >
      {/* ---------- Image area ---------- */}
      <div className={`relative flex h-52 items-center justify-center overflow-hidden rounded-xl ${p.color}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.7),transparent_65%)]" />

        {/* Zoom-in: card par hover karte hi image bada hota hai */}
        <motion.div
          variants={{ rest: { scale: 1 }, hover: { scale: reduceMotion ? 1 : 1.18 } }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative flex h-full w-full items-center justify-center"
        >
          {showImage ? (
            <Image
              src={p.image!}
              alt={p.name}
              fill
              sizes="256px"
              onError={() => setImgFailed(true)}
              className="object-contain p-3"
            />
          ) : (
            <span className="text-7xl drop-shadow-lg">{p.emoji}</span>
          )}
        </motion.div>

        {/* Shine: hover par chamak guzarti hai */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        {/* Badge */}
        {p.badge && (
          <span className="absolute left-2 top-2 rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-amber-500 shadow">
            {p.badge}
          </span>
        )}

        {/* Discount */}
        {discount > 0 && (
          <span className="absolute bottom-2 left-2 rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white shadow">
            {discount}% OFF
          </span>
        )}

        {/* Wishlist heart */}
        <motion.button
          onClick={() => setLiked((l) => !l)}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={liked}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          transition={SPRING}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={liked ? "on" : "off"}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.15 }}
              className="block"
            >
              {liked ? <HiHeart size={18} /> : <HiOutlineHeart size={18} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ---------- Details ---------- */}
      <h3 className="mt-3 line-clamp-2 h-10 text-sm font-semibold text-black">{p.name}</h3>

      <p className="mt-1 flex items-center gap-1 text-xs text-green-900">
        <HiStar className="text-amber-400" size={14} />
        <span className="font-semibold">{p.rating.toFixed(1)}</span>
        <span>· {p.size}</span>
      </p>

      <p className="mt-2 text-lg font-bold text-black">
        ₹{p.price.toFixed(2)}
        {p.oldPrice && (
          <span className="ml-2 text-sm font-normal text-gray-400 line-through">₹{p.oldPrice.toFixed(2)}</span>
        )}
      </p>

      {/* ---------- Qty + Add to cart ---------- */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center rounded-full border border-green-200 bg-white">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="px-2.5 py-2 text-green-900 hover:text-green-600"
          >
            <HiMinus size={14} />
          </motion.button>

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={qty}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-5 text-center text-sm font-semibold text-black"
            >
              {qty}
            </motion.span>
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            aria-label="Increase quantity"
            className="px-2.5 py-2 text-green-900 hover:text-green-600"
          >
            <HiPlus size={14} />
          </motion.button>
        </div>

        <motion.button
          onClick={handleAdd}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={SPRING}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold text-white transition-colors ${
            added ? "bg-emerald-500" : "bg-green-800 hover:bg-green-700"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={added ? "added" : "add"}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5"
            >
              {added ? <HiCheck size={15} /> : <HiOutlineShoppingBag size={15} />}
              {added ? "ADDED" : "ADD TO CART"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.article>
  );
}
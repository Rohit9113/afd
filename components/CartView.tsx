"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { HiCheck, HiMinus, HiOutlineArrowRight, HiOutlineTrash, HiPlus } from "react-icons/hi2";
import { useRequireAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { FREE_SHIPPING_MIN, MAX_QTY, type CartItem } from "@/data/cart";
import PaymentModal, { type PaymentResult } from "./PaymentModal";
import SectionBg from "./SectionBg";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring" as const, stiffness: 400, damping: 17 };
const MotionLink = motion.create(Link);

const money = (n: number) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

type Order = { id: string; total: number; count: number; payment: PaymentResult };

/* ---------- Ek cart item ---------- */
function CartRow({
  item,
  onQty,
  onRemove,
}: {
  item: CartItem;
  onQty: (qty: number) => void;
  onRemove: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = item.image && !imgFailed;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -60, scale: 0.95 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="flex gap-4 rounded-2xl border border-white bg-white/90 p-4 shadow-md backdrop-blur-sm"
    >
      <div className={`relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl ${item.color}`}>
        {showImage ? (
          <Image
            src={item.image!}
            alt={item.name}
            fill
            sizes="96px"
            onError={() => setImgFailed(true)}
            className="object-contain p-2"
          />
        ) : (
          <span className="text-5xl">{item.emoji}</span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-semibold text-green-950 md:text-base">{item.name}</h3>
            <p className="mt-0.5 text-xs text-green-900/70">{item.size}</p>
          </div>

          <motion.button
            onClick={onRemove}
            aria-label={`Remove ${item.name}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.85 }}
            transition={SPRING}
            className="shrink-0 rounded-full p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <HiOutlineTrash size={18} />
          </motion.button>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-3">
          <div className="flex items-center rounded-full border border-green-200 bg-white">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => onQty(item.qty - 1)}
              aria-label="Decrease quantity"
              className="px-3 py-2 text-green-900 hover:text-green-600"
            >
              <HiMinus size={14} />
            </motion.button>

            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={item.qty}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-6 text-center text-sm font-semibold text-black"
              >
                {item.qty}
              </motion.span>
            </AnimatePresence>

            <motion.button
              whileHover={item.qty >= MAX_QTY ? undefined : { scale: 1.2 }}
              whileTap={item.qty >= MAX_QTY ? undefined : { scale: 0.8 }}
              onClick={() => onQty(item.qty + 1)}
              disabled={item.qty >= MAX_QTY}
              aria-label="Increase quantity"
              className="px-3 py-2 text-green-900 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <HiPlus size={14} />
            </motion.button>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-black">{money(item.price * item.qty)}</p>
            {item.qty > 1 && <p className="text-xs text-green-900/60">{money(item.price)} each</p>}
          </div>
        </div>
      </div>
    </motion.li>
  );
}

/* ---------- Cart page ---------- */
export default function CartView() {
  const { user, ready } = useRequireAuth("/cart");
  const { items, count, subtotal, savings, shipping, total, setQty, remove, clear } = useCart();

  const [showPay, setShowPay] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  // Payment popup se confirm hone par order ban jata hai aur cart khali ho jata hai
  const handleConfirm = (payment: PaymentResult) => {
    setOrder({ id: `ORD${Date.now().toString().slice(-8)}`, total, count, payment });
    clear();
    setShowPay(false);
  };

  // Check ho raha hai, ya login page par bheja ja raha hai
  if (!ready || !user) {
    return (
      <main className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <SectionBg />
        <span className="relative h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-700" />
      </main>
    );
  }

  // Free shipping progress
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_MIN) * 100);
  const remaining = Math.max(0, FREE_SHIPPING_MIN - subtotal);

  return (
    <main className="relative overflow-hidden py-12 md:py-16">
      <SectionBg />

      <div className="relative mx-auto max-w-6xl px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-3xl font-bold text-green-950"
        >
          {user.name.split(" ")[0]}&apos;s Cart
          {items.length > 0 && (
            <span className="ml-2 text-lg font-medium text-green-900/60">
              ({count} {count === 1 ? "item" : "items"})
            </span>
          )}
        </motion.h1>

        <AnimatePresence mode="wait">
          {/* ---------- Order placed ---------- */}
          {order ? (
            <motion.div
              key="order"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mt-8 max-w-lg rounded-3xl border border-white bg-white/90 p-10 text-center shadow-xl backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.1 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-700 text-4xl text-white shadow-lg"
              >
                <HiCheck />
              </motion.div>

              <h2 className="mt-6 text-2xl font-bold text-green-950">Order placed!</h2>
              <p className="mt-2 text-sm text-green-900/70">
                Order <span className="font-bold text-green-950">{order.id}</span> · {order.count}{" "}
                {order.count === 1 ? "item" : "items"}
              </p>

              {/* Payment details */}
              <div className="mt-5 rounded-2xl bg-green-50 p-4 text-left text-sm">
                <dl className="space-y-2">
                  <div className="flex justify-between gap-4">
                    <dt className="text-green-900/70">Payment method</dt>
                    <dd className="text-right font-semibold text-green-950">
                      {order.payment.label}
                      {order.payment.detail && (
                        <span className="block text-xs font-normal text-green-900/60">{order.payment.detail}</span>
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-green-900/70">{order.payment.paid ? "Amount paid" : "Pay on delivery"}</dt>
                    <dd className="font-extrabold text-green-950">{money(order.total)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-green-900/70">Status</dt>
                    <dd
                      className={`font-bold ${order.payment.paid ? "text-green-700" : "text-amber-600"}`}
                    >
                      {order.payment.paid ? "Paid ✓" : "Payment pending (COD)"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-green-900/70">Estimated delivery</dt>
                    <dd className="font-semibold text-green-950">3-5 days</dd>
                  </div>
                </dl>
              </div>

              <p className="mt-3 text-xs text-green-900/50">(Ye sirf demo hai, asli order nahi gaya)</p>

              <MotionLink
                href="/"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                transition={SPRING}
                className="mt-6 inline-block rounded-full bg-green-800 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-green-700"
              >
                CONTINUE SHOPPING
              </MotionLink>
            </motion.div>
          ) : items.length === 0 ? (
            /* ---------- Empty cart ---------- */
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mx-auto mt-8 max-w-2xl rounded-3xl border border-white bg-white/90 p-10 text-center shadow-xl backdrop-blur-sm"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-7xl"
              >
                🛒
              </motion.div>
              <h2 className="mt-4 text-xl font-bold text-green-950">Your cart is empty</h2>
              <p className="mt-1 text-sm text-green-900/70">Add some pure, traditional goodness to get started.</p>

              <MotionLink
                href="/"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                transition={SPRING}
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-green-800 px-8 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-green-700"
              >
                START SHOPPING
                <HiOutlineArrowRight className="transition-transform group-hover:translate-x-1" />
              </MotionLink>
            </motion.div>
          ) : (
            /* ---------- Cart with items ---------- */
            <motion.div key="cart" variants={fadeUp} initial="hidden" animate="show" className="mt-8 grid gap-6 lg:grid-cols-3">
              {/* Left: items */}
              <div className="lg:col-span-2">
                <div className="mb-4 rounded-2xl border border-white bg-white/90 p-4 shadow-md backdrop-blur-sm">
                  <p className="text-sm font-semibold text-green-950">
                    {remaining > 0 ? (
                      <>
                        Add <span className="text-green-700">{money(remaining)}</span> more for{" "}
                        <span className="text-green-700">FREE shipping</span> 🚚
                      </>
                    ) : (
                      <>
                        🎉 You&apos;ve unlocked <span className="text-green-700">FREE shipping!</span>
                      </>
                    )}
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-green-100">
                    <motion.div
                      initial={false}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="h-full rounded-full bg-linear-to-r from-green-600 to-amber-400"
                    />
                  </div>
                </div>

                <ul className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <CartRow
                        key={item.id}
                        item={item}
                        onQty={(q) => setQty(item.id, q)}
                        onRemove={() => remove(item.id)}
                      />
                    ))}
                  </AnimatePresence>
                </ul>

                <button
                  onClick={clear}
                  className="mt-4 text-sm font-semibold text-red-600 underline-offset-2 hover:underline"
                >
                  Clear cart
                </button>
              </div>

              {/* Right: summary */}
              <aside className="h-fit rounded-3xl border border-white bg-white/90 p-6 shadow-xl backdrop-blur-sm lg:sticky lg:top-24">
                <h2 className="text-lg font-bold text-green-950">Order summary</h2>

                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between text-green-900/80">
                    <dt>
                      Subtotal ({count} {count === 1 ? "item" : "items"})
                    </dt>
                    <dd className="font-semibold text-green-950">{money(subtotal)}</dd>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between text-green-700">
                      <dt>You save</dt>
                      <dd className="font-semibold">− {money(savings)}</dd>
                    </div>
                  )}

                  <div className="flex justify-between text-green-900/80">
                    <dt>Shipping</dt>
                    <dd className={`font-semibold ${shipping === 0 ? "text-green-700" : "text-green-950"}`}>
                      {shipping === 0 ? "FREE" : money(shipping)}
                    </dd>
                  </div>

                  <div className="flex justify-between border-t border-green-100 pt-3 text-base">
                    <dt className="font-bold text-green-950">Total</dt>
                    <dd className="text-xl font-extrabold text-green-950">{money(total)}</dd>
                  </div>
                </dl>

                <motion.button
                  onClick={() => setShowPay(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={SPRING}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-green-800 py-3.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-green-700"
                >
                  CHECKOUT
                  <HiOutlineArrowRight />
                </motion.button>

                <Link
                  href="/"
                  className="mt-3 block text-center text-sm font-semibold text-green-700 underline-offset-2 hover:underline"
                >
                  Continue shopping
                </Link>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------- Payment popup ---------- */}
      <AnimatePresence>
        {showPay && (
          <PaymentModal total={total} count={count} onClose={() => setShowPay(false)} onConfirm={handleConfirm} />
        )}
      </AnimatePresence>
    </main>
  );
}
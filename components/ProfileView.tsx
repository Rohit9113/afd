"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "motion/react";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineShoppingBag,
  HiOutlineUser,
} from "react-icons/hi2";
import { useRequireAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/data/users";
import SectionBg from "./SectionBg";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring" as const, stiffness: 400, damping: 17 };

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function ProfileView() {
  const router = useRouter();
  const { user, ready } = useRequireAuth("/profile");

  const handleLogout = () => {
    logoutUser();
    router.push("/");
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

  const details = [
    { icon: <HiOutlineUser />, label: "Full name", value: user.name },
    { icon: <HiOutlineEnvelope />, label: "Email", value: user.email },
    { icon: <HiOutlinePhone />, label: "Mobile number", value: `+91 ${user.phone}` },
  ];

  return (
    <main className="relative overflow-hidden py-12 md:py-16">
      <SectionBg />

      <motion.div variants={stagger} initial="hidden" animate="show" className="relative mx-auto max-w-3xl px-4">
        {/* Top card */}
        <motion.div
          variants={rise}
          className="flex flex-col items-center gap-4 rounded-3xl border border-white bg-white/90 p-8 text-center shadow-xl backdrop-blur-sm sm:flex-row sm:text-left"
        >
          <motion.div
            whileHover={{ rotate: 360, scale: 1.08 }}
            transition={{ duration: 0.7 }}
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-green-700 to-emerald-500 text-4xl font-bold text-white shadow-lg"
          >
            {user.name.charAt(0).toUpperCase()}
          </motion.div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-green-700">Welcome back</p>
            <h1 className="text-2xl font-bold text-green-950 md:text-3xl">{user.name}</h1>
            <p className="mt-1 break-all text-sm text-green-900/70">{user.email}</p>
          </div>

          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            transition={SPRING}
            className="flex items-center gap-2 rounded-full border-2 border-red-200 bg-white px-5 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
          >
            <HiOutlineArrowRightOnRectangle size={18} />
            LOG OUT
          </motion.button>
        </motion.div>

        {/* Details */}
        <motion.ul variants={rise} className="mt-6 grid gap-4 sm:grid-cols-3">
          {details.map((d) => (
            <motion.li
              key={d.label}
              whileHover={{ y: -6, scale: 1.03 }}
              transition={SPRING}
              className="rounded-2xl border border-white bg-white/90 p-5 shadow-md backdrop-blur-sm transition-shadow hover:shadow-xl"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-xl text-green-700 ring-1 ring-green-200">
                {d.icon}
              </span>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-green-900/60">{d.label}</p>
              <p className="mt-0.5 break-all text-sm font-semibold text-green-950">{d.value}</p>
            </motion.li>
          ))}
        </motion.ul>

        {/* Quick links */}
        <motion.div variants={rise} className="mt-6 rounded-2xl border border-white bg-white/90 p-6 shadow-md backdrop-blur-sm">
          <h2 className="font-bold text-green-950">Quick links</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/cart"
              className="flex items-center gap-2 rounded-full bg-green-800 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-green-700"
            >
              <HiOutlineShoppingBag size={18} />
              MY CART
            </Link>
            <Link
              href="/"
              className="rounded-full border-2 border-green-800 px-5 py-2.5 text-sm font-bold text-green-800 transition-colors hover:bg-green-800 hover:text-white"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
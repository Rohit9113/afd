"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import {
  HiOutlineBars3,
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingBag,
  HiOutlineUser,
  HiOutlineXMark,
} from "react-icons/hi2";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

/* ---------- Config ---------- */
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/collections/all" },
  { label: "Our Story", href: "/about" },
  { label: "Lab Reports", href: "/lab-reports" },
  { label: "Contact Us", href: "/contact" },
  { label: "Hampers", href: "/hampers" },
];

const MotionLink = motion.create(Link);
const iconBtn = "relative rounded-full p-2 text-gray-800 transition-colors hover:bg-gray-100";

// Icons par hover zoom effect (yahan se control karo)
const zoomProps = {
  whileHover: { scale: 1.2 },
  whileTap: { scale: 0.9 },
  transition: { type: "spring" as const, stiffness: 400, damping: 15 },
};

/* ---------- Search box (desktop + mobile dono me use hota hai) ---------- */
type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
  autoFocus?: boolean;
};

function SearchBox({ value, onChange, onSubmit, className = "", autoFocus }: SearchBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className={`items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 transition-all duration-300 focus-within:border-green-700 focus-within:bg-white focus-within:ring-4 focus-within:ring-green-700/10 ${className}`}
    >
      <HiOutlineMagnifyingGlass className="shrink-0 text-lg text-gray-400" />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search ghee, atta, oils..."
        aria-label="Search products"
        autoFocus={autoFocus}
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
      />

      <AnimatePresence>
        {value && (
          <motion.button
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="text-gray-400 hover:text-gray-700"
          >
            <HiOutlineXMark className="text-lg" />
          </motion.button>
        )}
      </AnimatePresence>

      <button
        type="submit"
        className="rounded-full bg-green-800 px-3 py-1 text-xs font-semibold text-white transition hover:bg-green-700 active:scale-95"
      >
        Search
      </button>
    </form>
  );
}

/* ---------- Header ---------- */
export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth(); // login hai to user ka data, warna null
  const { count } = useCart(); // cart me kitne items hain

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); // sirf mobile/tablet
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const closeAll = () => {
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    closeAll();
  };

  // Escape dabane par sab band
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      setSearchOpen(false);
      (document.activeElement as HTMLElement | null)?.blur();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "border-b"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {/* Hamburger (lg se chhote screen par) */}
        <button
          onClick={() => {
            setMenuOpen((o) => !o);
            setSearchOpen(false);
          }}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className={`${iconBtn} lg:hidden`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={menuOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="block"
            >
              {menuOpen ? <HiOutlineXMark size={26} /> : <HiOutlineBars3 size={26} />}
            </motion.span>
          </AnimatePresence>
        </button>

        {/* Logo */}
        <Link href="/" onClick={closeAll} className="flex items-center">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Image
              src="/ambrand.jpeg"
              alt="AM Brand"
              width={140}
              height={48}
              priority
              className={`h-10 w-auto object-contain transition-all duration-300 ${
                scrolled ? "lg:h-10" : "lg:h-12"
              }`}
            />
          </motion.div>
        </Link>

        {/* Desktop menu */}
        <nav aria-label="Main" className="hidden items-center gap-7 text-sm font-medium lg:flex">
          {NAV_LINKS.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 transition-colors hover:text-green-700 ${
                  active ? "text-green-700" : "text-black"
                }`}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded bg-green-700"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Desktop search: focus par chaudha hota hai */}
          <SearchBox
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch}
            className="hidden w-56 focus-within:w-72 lg:flex"
          />

          {/* Mobile/tablet search icon */}
          <button
            onClick={() => {
              setSearchOpen((o) => !o);
              setMenuOpen(false);
            }}
            aria-label="Search"
            aria-expanded={searchOpen}
            className={`${iconBtn} lg:hidden`}
          >
            <HiOutlineMagnifyingGlass size={24} />
          </button>

          {/* Profile icon: login nahi to /login, login hai to /profile */}
          <MotionLink
            href={user ? "/profile" : "/login"}
            onClick={closeAll}
            aria-label={user ? "My profile" : "Log in"}
            {...zoomProps}
            className={iconBtn}
          >
            {user ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <HiOutlineUser size={24} />
            )}
          </MotionLink>

          {/* Cart icon: login nahi to /login (login ke baad wapas cart par), login hai to /cart */}
          <MotionLink
            href={user ? "/cart" : "/login?next=/cart"}
            onClick={closeAll}
            aria-label={`Cart, ${count} items`}
            {...zoomProps}
            className={iconBtn}
          >
            <HiOutlineShoppingBag size={24} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-700 px-1 text-[10px] font-bold text-white"
                >
                  {count > 99 ? "99+" : count}
                </motion.span>
              )}
            </AnimatePresence>
          </MotionLink>
        </div>
      </div>

      {/* Mobile/tablet search bar */}
      <AnimatePresence initial={false}>
        {searchOpen && (
          <motion.div
            key="mobile-search"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t lg:hidden"
          >
            <div className="px-4 py-3">
              <SearchBox value={query} onChange={setQuery} onSubmit={handleSearch} className="flex" autoFocus />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile/tablet menu */}
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.nav
            key="mobile-menu"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t lg:hidden"
          >
            <ul className="flex flex-col px-4 py-2 text-sm font-medium">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.04 * i }}
                  className="border-b border-gray-100 last:border-0"
                >
                  <Link
                    href={l.href}
                    onClick={closeAll}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={`block py-3 ${isActive(l.href) ? "text-green-700" : "text-black"}`}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
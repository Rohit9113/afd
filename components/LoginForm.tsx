"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "motion/react";
import {
  HiCheck,
  HiOutlineEnvelope,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineLockClosed,
  HiOutlinePhone,
  HiOutlineUser,
} from "react-icons/hi2";
import { DEMO_LOGIN, loginUser, saveSession } from "@/data/users";
import SectionBg from "./SectionBg";

/* ---------- Config ---------- */
const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring" as const, stiffness: 400, damping: 17 };

const PERKS = [
  "Track your orders in real time",
  "Reorder your favourites in one tap",
  "Exclusive festive offers for members",
];

/* ---------- Phone ya email pehchanna ---------- */
type IdentifierKind = "email" | "phone" | "unknown";

// "+91 98765 43210" / "098765-43210" sab 10 digit me badal jate hain
function normalizePhone(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

function detectKind(raw: string): IdentifierKind {
  const v = raw.trim();
  if (!v) return "unknown";
  if (v.includes("@") || /[a-zA-Z]/.test(v)) return "email";
  if (/^[+\d\s-]+$/.test(v)) return "phone";
  return "unknown";
}

/* ---------- Login ke baad kahan jana hai ---------- */
// URL me ?next=/cart ho to wahin bhejo, warna home.
// Sirf apni site ke path allowed hain (//evil.com jaisa link block ho jata hai).
function getRedirectPath() {
  if (typeof window === "undefined") return "/";
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

/* ---------- Validation ---------- */
type Values = { identifier: string; password: string; remember: boolean };
type Errors = Partial<Record<"identifier" | "password", string>>;
type Status = "idle" | "loading" | "success";

function validate(v: Values): Errors {
  const e: Errors = {};
  const id = v.identifier.trim();
  const kind = detectKind(id);

  if (!id) e.identifier = "Enter your email or mobile number";
  else if (kind === "email" && !/^\S+@\S+\.\S+$/.test(id)) e.identifier = "Enter a valid email address";
  else if (kind === "phone" && !/^[6-9]\d{9}$/.test(normalizePhone(id))) e.identifier = "Enter a valid 10-digit mobile number";
  else if (kind === "unknown") e.identifier = "Enter a valid email or mobile number";

  if (!v.password) e.password = "Enter your password";
  return e;
}

/* ---------- Animations ---------- */
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/* ---------- Error text ---------- */
function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          role="alert"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden text-xs font-medium text-red-600"
        >
          <span className="mt-1 block">{message}</span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/* ---------- Main ---------- */
export default function LoginForm() {
  const router = useRouter();
  const idField = useId();
  const passField = useId();

  const [values, setValues] = useState<Values>({ identifier: "", password: "", remember: true });
  const [touched, setTouched] = useState({ identifier: false, password: false });
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");
  const [welcomeName, setWelcomeName] = useState("");
  const [goingTo, setGoingTo] = useState("/");

  const errors = useMemo(() => validate(values), [values]);
  const kind = detectKind(values.identifier);

  const err = (k: "identifier" | "password") => (touched[k] ? errors[k] : undefined);
  const inputBase =
    "w-full rounded-xl border bg-white py-3 pl-11 text-sm text-green-950 outline-none transition placeholder:text-gray-400 focus:ring-4";
  const ok = "border-green-200 focus:border-green-700 focus:ring-green-700/10";
  const bad = "border-red-400 focus:border-red-500 focus:ring-red-500/10";

  const fillDemo = () => {
    setValues((v) => ({ ...v, identifier: DEMO_LOGIN.email, password: DEMO_LOGIN.password }));
    setTouched({ identifier: false, password: false });
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ identifier: true, password: true });
    setFormError("");
    if (Object.keys(errors).length > 0) return;

    const id = values.identifier.trim();
    const type = kind === "email" ? "email" : "phone";
    const identifier = type === "email" ? id.toLowerCase() : normalizePhone(id);

    setStatus("loading");
    await new Promise((r) => setTimeout(r, 700)); // loading animation dikhane ke liye

    const result = loginUser(type, identifier, values.password);

    if (!result.ok) {
      setFormError(result.error);
      setStatus("idle");
      return;
    }

    saveSession(result.user, values.remember);
    setWelcomeName(result.user.name.split(" ")[0]);

    const target = getRedirectPath();
    setGoingTo(target);
    setStatus("success");

    setTimeout(() => {
      router.push(target);
      router.refresh();
    }, 1400);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <SectionBg />

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:gap-16">
        {/* ---------- Left: brand panel (desktop) ---------- */}
        <motion.aside variants={stagger} initial="hidden" animate="show" className="hidden flex-col lg:flex">
          <motion.div variants={rise}>
            <Link href="/" aria-label="Home">
              <Image src="/ambrand.jpeg" alt="AM Brand" width={160} height={56} priority className="h-14 w-auto object-contain" />
            </Link>
          </motion.div>

          <motion.h1 variants={rise} className="mt-8 text-4xl font-extrabold leading-tight text-green-950 xl:text-5xl">
            Welcome{" "}
            <span className="bg-linear-to-r from-green-700 to-amber-500 bg-clip-text text-transparent">back</span>
          </motion.h1>

          <motion.p variants={rise} className="mt-4 max-w-md text-lg text-green-900/70">
            Log in to continue your journey with pure, traditional food.
          </motion.p>

          <ul className="mt-8 space-y-3">
            {PERKS.map((p) => (
              <motion.li key={p} variants={rise} className="flex items-center gap-3 text-green-950">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-700 text-white">
                  <HiCheck size={14} />
                </span>
                {p}
              </motion.li>
            ))}
          </ul>
        </motion.aside>

        {/* ---------- Right: form card ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto w-full max-w-md rounded-3xl border border-white bg-white/90 p-6 shadow-2xl backdrop-blur-sm sm:p-8"
        >
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.1 }}
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-700 text-4xl text-white shadow-lg"
                >
                  <HiCheck />
                </motion.div>
                <h2 className="mt-6 text-2xl font-bold text-green-950">Welcome back, {welcomeName}!</h2>
                <p className="mt-2 text-sm text-green-900/70">
                  {goingTo === "/" ? "Taking you to the home page..." : "Taking you back to where you were..."}
                </p>
              </motion.div>
            ) : (
              <motion.form key="form" variants={stagger} initial="hidden" animate="show" onSubmit={handleSubmit} noValidate>
                <Link href="/" aria-label="Home" className="mb-4 flex justify-center lg:hidden">
                  <Image src="/ambrand.jpeg" alt="AM Brand" width={140} height={48} className="h-12 w-auto object-contain" />
                </Link>

                <motion.div variants={rise} className="mb-6 text-center lg:text-left">
                  <h2 className="text-2xl font-bold text-green-950">Log in to your account</h2>
                  <p className="mt-1 text-sm text-green-900/70">Use your email or mobile number</p>
                </motion.div>

                <div className="space-y-4">
                  {/* Email ya phone */}
                  <motion.div variants={rise}>
                    <label htmlFor={idField} className="mb-1.5 block text-sm font-semibold text-green-950">
                      Email or mobile number
                    </label>
                    <div className="relative">
                      <span className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg ${err("identifier") ? "text-red-400" : "text-green-700/60"}`}>
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={kind}
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.15 }}
                            className="block"
                          >
                            {kind === "email" ? <HiOutlineEnvelope /> : kind === "phone" ? <HiOutlinePhone /> : <HiOutlineUser />}
                          </motion.span>
                        </AnimatePresence>
                      </span>

                      <input
                        id={idField}
                        name="identifier"
                        type="text"
                        value={values.identifier}
                        onChange={(e) => setValues((v) => ({ ...v, identifier: e.target.value }))}
                        onBlur={() => setTouched((t) => ({ ...t, identifier: true }))}
                        placeholder="you@example.com or 98765 43210"
                        autoComplete="username"
                        autoFocus
                        aria-invalid={!!err("identifier")}
                        aria-describedby={err("identifier") ? `${idField}-err` : undefined}
                        className={`${inputBase} pr-4 ${err("identifier") ? bad : ok}`}
                      />
                    </div>

                    <AnimatePresence initial={false}>
                      {kind !== "unknown" && !err("identifier") && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-1 text-xs text-green-700"
                        >
                          Logging in with {kind === "email" ? "email" : "mobile number"}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <FieldError id={`${idField}-err`} message={err("identifier")} />
                  </motion.div>

                  {/* Password */}
                  <motion.div variants={rise}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label htmlFor={passField} className="block text-sm font-semibold text-green-950">
                        Password
                      </label>
                      <Link href="/forgot-password" className="text-xs font-semibold text-green-700 underline-offset-2 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <span className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg ${err("password") ? "text-red-400" : "text-green-700/60"}`}>
                        <HiOutlineLockClosed />
                      </span>
                      <input
                        id={passField}
                        name="password"
                        type={showPass ? "text" : "password"}
                        value={values.password}
                        onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
                        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        aria-invalid={!!err("password")}
                        aria-describedby={err("password") ? `${passField}-err` : undefined}
                        className={`${inputBase} pr-11 ${err("password") ? bad : ok}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((s) => !s)}
                        aria-label={showPass ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-lg text-green-800/70 transition hover:text-green-900"
                      >
                        {showPass ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                      </button>
                    </div>
                    <FieldError id={`${passField}-err`} message={err("password")} />
                  </motion.div>

                  <motion.label variants={rise} className="flex cursor-pointer items-center gap-2.5 text-sm text-green-900/80">
                    <input
                      type="checkbox"
                      checked={values.remember}
                      onChange={(e) => setValues((v) => ({ ...v, remember: e.target.checked }))}
                      className="h-4 w-4 accent-green-700"
                    />
                    Keep me logged in
                  </motion.label>
                </div>

                <AnimatePresence>
                  {formError && (
                    <motion.p
                      role="alert"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                    >
                      {formError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  variants={rise}
                  type="submit"
                  disabled={status === "loading"}
                  whileHover={status === "loading" ? undefined : { scale: 1.03 }}
                  whileTap={status === "loading" ? undefined : { scale: 0.97 }}
                  transition={SPRING}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-green-800 py-3.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "loading" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      LOGGING IN...
                    </>
                  ) : (
                    "LOG IN"
                  )}
                </motion.button>

                {/* Demo account (testing ke liye, baad me hata dena) */}
                <motion.div
                  variants={rise}
                  className="mt-5 rounded-xl border border-dashed border-green-300 bg-green-50/70 p-3 text-xs text-green-900"
                >
                  <p className="font-semibold">Demo account</p>
                  <p className="mt-0.5 break-all text-green-900/80">
                    {DEMO_LOGIN.email} · {DEMO_LOGIN.password}
                  </p>
                  <button type="button" onClick={fillDemo} className="mt-2 font-bold text-green-700 underline-offset-2 hover:underline">
                    Fill automatically
                  </button>
                </motion.div>

                <motion.p variants={rise} className="mt-5 text-center text-sm text-green-900/70">
                  New here?{" "}
                  <Link href="/signup" className="font-bold text-green-700 underline-offset-2 hover:underline">
                    Create an account
                  </Link>
                </motion.p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
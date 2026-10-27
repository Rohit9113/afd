"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, type Variants } from "motion/react";
import {
  HiCheck,
  HiOutlineEnvelope,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineLockClosed,
  HiOutlinePhone,
  HiOutlineUser,
  HiXMark,
} from "react-icons/hi2";
import { PASSWORD_RULES, isStrongPassword, passwordScore, registerUser, saveSession } from "@/data/users";
import SectionBg from "./SectionBg";

/* ---------- Config ---------- */
const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring" as const, stiffness: 400, damping: 17 };

const BENEFITS = [
  "Free shipping on orders above ₹499",
  "Exclusive festive offers & early access",
  "Easy order tracking & reorder",
  "Save your favourites in a wishlist",
];

/* ---------- Types & validation ---------- */
type Values = { name: string; email: string; phone: string; password: string; confirm: string; terms: boolean };
type Errors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "loading" | "success";

const INITIAL: Values = { name: "", email: "", phone: "", password: "", confirm: "", terms: false };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name";
  if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter a valid email address";
  if (!/^[6-9]\d{9}$/.test(v.phone)) e.phone = "Enter a valid 10-digit mobile number";
  if (!v.password) e.password = "Create a password";
  else if (!isStrongPassword(v.password)) e.password = "Password must meet all the requirements below";
  if (!v.confirm || v.confirm !== v.password) e.confirm = "Passwords do not match";
  if (!v.terms) e.terms = "Please accept the terms to continue";
  return e;
}

// score 0-5 (kitne rules pass hue)
const STRENGTH = [
  { label: "Too weak", color: "bg-red-500", text: "text-red-600" },
  { label: "Too weak", color: "bg-red-500", text: "text-red-600" },
  { label: "Weak", color: "bg-orange-500", text: "text-orange-600" },
  { label: "Okay", color: "bg-amber-400", text: "text-amber-600" },
  { label: "Good", color: "bg-lime-500", text: "text-lime-600" },
  { label: "Strong", color: "bg-green-600", text: "text-green-700" },
];

/* ---------- Animations ---------- */
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/* ---------- Reusable field ---------- */
type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  icon: React.ReactNode;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "email";
  maxLength?: number;
  right?: React.ReactNode;
};

function Field({
  label, name, value, onChange, onBlur, error, icon,
  type = "text", placeholder, autoComplete, inputMode, maxLength, right,
}: FieldProps) {
  const id = useId();

  return (
    <motion.div variants={rise}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-green-950">
        {label}
      </label>

      <div className="relative">
        <span className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg ${error ? "text-red-400" : "text-green-700/60"}`}>
          {icon}
        </span>

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={`w-full rounded-xl border bg-white py-3 pl-11 text-sm text-green-950 outline-none transition placeholder:text-gray-400 focus:ring-4 ${
            right ? "pr-11" : "pr-4"
          } ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
              : "border-green-200 focus:border-green-700 focus:ring-green-700/10"
          }`}
        />

        {right && <span className="absolute right-3 top-1/2 -translate-y-1/2">{right}</span>}
      </div>

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-err`}
            role="alert"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden text-xs font-medium text-red-600"
          >
            <span className="mt-1 block">{error}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------- Password rules checklist ---------- */
function PasswordChecklist({ password }: { password: string }) {
  const score = passwordScore(password);
  const strength = STRENGTH[score];

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      {/* Strength bar */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex flex-1 gap-1" aria-hidden>
          {PASSWORD_RULES.map((rule, i) => (
            <span key={rule.id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-green-100">
              <motion.span
                initial={false}
                animate={{ scaleX: score > i ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className={`block h-full origin-left rounded-full ${strength.color}`}
              />
            </span>
          ))}
        </div>
        <span className={`text-xs font-semibold ${strength.text}`}>{strength.label}</span>
      </div>

      {/* Rules */}
      <ul className="mt-3 grid gap-1.5 sm:grid-cols-2" aria-label="Password requirements">
        {PASSWORD_RULES.map((rule) => {
          const pass = rule.test(password);
          return (
            <li
              key={rule.id}
              className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                pass ? "text-green-700" : "text-gray-500"
              }`}
            >
              <motion.span
                animate={{ scale: pass ? [1, 1.35, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white transition-colors ${
                  pass ? "bg-green-600" : "bg-gray-300"
                }`}
              >
                {pass ? <HiCheck size={10} /> : <HiXMark size={10} />}
              </motion.span>
              {rule.label}
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

/* ---------- Main component ---------- */
export default function SignupForm() {
  const [values, setValues] = useState<Values>(INITIAL);
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");

  const errors = useMemo(() => validate(values), [values]);

  const set = <K extends keyof Values>(key: K, val: Values[K]) => setValues((v) => ({ ...v, [key]: val }));
  const touch = (key: keyof Values) => setTouched((t) => ({ ...t, [key]: true }));
  const err = (key: keyof Values) => (touched[key] ? errors[key] : undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, password: true, confirm: true, terms: true });
    setFormError("");
    if (Object.keys(errors).length > 0) return;

    setStatus("loading");
    await new Promise((r) => setTimeout(r, 700)); // loading animation dikhane ke liye

    const result = registerUser({
      name: values.name,
      email: values.email,
      phone: values.phone,
      password: values.password,
    });

    if (!result.ok) {
      setFormError(result.error);
      setStatus("idle");
      return;
    }

    saveSession(result.user, true); // signup ke baad seedha login
    setStatus("success");
  };

  const eyeBtn = (
    <button
      type="button"
      onClick={() => setShowPass((s) => !s)}
      aria-label={showPass ? "Hide password" : "Show password"}
      className="rounded-full p-1 text-lg text-green-800/70 transition hover:text-green-900"
    >
      {showPass ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
    </button>
  );

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
            Join the family of{" "}
            <span className="bg-linear-to-r from-green-700 to-amber-500 bg-clip-text text-transparent">pure living</span>
          </motion.h1>

          <motion.p variants={rise} className="mt-4 max-w-md text-lg text-green-900/70">
            Create your account and bring home traditional, honest food made with care.
          </motion.p>

          <ul className="mt-8 space-y-3">
            {BENEFITS.map((b) => (
              <motion.li key={b} variants={rise} className="flex items-center gap-3 text-green-950">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-700 text-white">
                  <HiCheck size={14} />
                </span>
                {b}
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
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.1 }}
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-700 text-4xl text-white shadow-lg"
                >
                  <HiCheck />
                </motion.div>
                <h2 className="mt-6 text-2xl font-bold text-green-950">Welcome aboard, {values.name.trim().split(" ")[0]}!</h2>
                <p className="mt-2 text-sm text-green-900/70">Your account has been created and you are logged in.</p>

                <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} transition={SPRING} className="mt-8 inline-block">
                  <Link href="/" className="inline-block rounded-full bg-green-800 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-green-700">
                    START SHOPPING
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.form key="form" variants={stagger} initial="hidden" animate="show" onSubmit={handleSubmit} noValidate>
                <Link href="/" aria-label="Home" className="mb-4 flex justify-center lg:hidden">
                  <Image src="/ambrand.jpeg" alt="AM Brand" width={140} height={48} className="h-12 w-auto object-contain" />
                </Link>

                <motion.div variants={rise} className="mb-6 text-center lg:text-left">
                  <h2 className="text-2xl font-bold text-green-950">Create your account</h2>
                  <p className="mt-1 text-sm text-green-900/70">It only takes a minute</p>
                </motion.div>

                <div className="space-y-4">
                  <Field
                    label="Full name" name="name" value={values.name}
                    onChange={(v) => set("name", v)} onBlur={() => touch("name")} error={err("name")}
                    icon={<HiOutlineUser />} placeholder="Your full name" autoComplete="name"
                  />

                  <Field
                    label="Email" name="email" type="email" value={values.email}
                    onChange={(v) => set("email", v)} onBlur={() => touch("email")} error={err("email")}
                    icon={<HiOutlineEnvelope />} placeholder="you@example.com" autoComplete="email" inputMode="email"
                  />

                  <Field
                    label="Mobile number" name="phone" value={values.phone}
                    onChange={(v) => set("phone", v.replace(/\D/g, "").slice(0, 10))}
                    onBlur={() => touch("phone")} error={err("phone")}
                    icon={<HiOutlinePhone />} placeholder="10-digit mobile number" autoComplete="tel-national"
                    inputMode="numeric" maxLength={10}
                  />

                  <div>
                    <Field
                      label="Password" name="password" type={showPass ? "text" : "password"} value={values.password}
                      onChange={(v) => set("password", v)} onBlur={() => touch("password")} error={err("password")}
                      icon={<HiOutlineLockClosed />} placeholder="Create a strong password" autoComplete="new-password"
                      right={eyeBtn}
                    />
                    <AnimatePresence initial={false}>
                      {values.password && <PasswordChecklist password={values.password} />}
                    </AnimatePresence>
                  </div>

                  <Field
                    label="Confirm password" name="confirm" type={showPass ? "text" : "password"} value={values.confirm}
                    onChange={(v) => set("confirm", v)} onBlur={() => touch("confirm")} error={err("confirm")}
                    icon={<HiOutlineLockClosed />} placeholder="Re-enter your password" autoComplete="new-password"
                  />

                  <motion.div variants={rise}>
                    <label className="flex cursor-pointer items-start gap-2.5 text-sm text-green-900/80">
                      <input
                        type="checkbox"
                        checked={values.terms}
                        onChange={(e) => {
                          set("terms", e.target.checked);
                          touch("terms");
                        }}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-green-700"
                      />
                      <span>
                        I agree to the{" "}
                        <Link href="/terms" className="font-semibold text-green-700 underline-offset-2 hover:underline">Terms</Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="font-semibold text-green-700 underline-offset-2 hover:underline">Privacy Policy</Link>
                      </span>
                    </label>
                    <AnimatePresence initial={false}>
                      {err("terms") && (
                        <motion.p
                          role="alert"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-1 text-xs font-medium text-red-600"
                        >
                          {err("terms")}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
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
                      {formError}{" "}
                      {formError.includes("already") && (
                        <Link href="/login" className="font-bold underline">Log in</Link>
                      )}
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
                      CREATING ACCOUNT...
                    </>
                  ) : (
                    "CREATE ACCOUNT"
                  )}
                </motion.button>

                <motion.p variants={rise} className="mt-5 text-center text-sm text-green-900/70">
                  Already have an account?{" "}
                  <Link href="/login" className="font-bold text-green-700 underline-offset-2 hover:underline">
                    Log in
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
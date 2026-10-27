"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  HiCheck,
  HiOutlineBanknotes,
  HiOutlineBuildingLibrary,
  HiOutlineCreditCard,
  HiOutlineDevicePhoneMobile,
  HiOutlineLockClosed,
  HiOutlineXMark,
} from "react-icons/hi2";

/* ---------- Types ---------- */
export type PaymentMethod = "cod" | "upi" | "card" | "netbanking";

export type PaymentResult = {
  method: PaymentMethod;
  label: string; // "Cash on Delivery", "UPI", "Card"...
  paid: boolean; // COD me false, online me true
  detail?: string; // UPI ID, card ke last 4 digit, bank ka naam
};

type Mode = "cod" | "online";
type Sub = "upi" | "card" | "netbanking";

type Fields = { upi: string; number: string; name: string; expiry: string; cvv: string; bank: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring" as const, stiffness: 400, damping: 17 };

const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Kotak Mahindra Bank", "Bank of Baroda"];

const SUBS: { id: Sub; label: string; icon: React.ReactNode }[] = [
  { id: "upi", label: "UPI", icon: <HiOutlineDevicePhoneMobile /> },
  { id: "card", label: "Card", icon: <HiOutlineCreditCard /> },
  { id: "netbanking", label: "Net Banking", icon: <HiOutlineBuildingLibrary /> },
];

const money = (n: number) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ---------- Validation ---------- */
function validate(sub: Sub, f: Fields): Errors {
  const e: Errors = {};

  if (sub === "upi") {
    if (!/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(f.upi.trim())) e.upi = "Enter a valid UPI ID (e.g. name@upi)";
  }

  if (sub === "card") {
    if (f.number.replace(/\s/g, "").length !== 16) e.number = "Enter a valid 16-digit card number";
    if (f.name.trim().length < 2) e.name = "Enter the name on card";

    const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(f.expiry);
    if (!m) e.expiry = "Use MM/YY";
    else if (new Date(2000 + Number(m[2]), Number(m[1]), 1) <= new Date()) e.expiry = "Card has expired";

    if (!/^\d{3}$/.test(f.cvv)) e.cvv = "3 digits";
  }

  if (sub === "netbanking" && !f.bank) e.bank = "Please select your bank";

  return e;
}

/* ---------- Chhota input field ---------- */
type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  inputMode?: "text" | "numeric";
  maxLength?: number;
  autoComplete?: string;
};

function Input({ label, value, onChange, error, placeholder, inputMode, maxLength, autoComplete }: InputProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-green-950">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-green-950 outline-none transition placeholder:text-gray-400 focus:ring-4 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
            : "border-green-200 focus:border-green-700 focus:ring-green-700/10"
        }`}
      />
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden text-xs font-medium text-red-600"
          >
            <span className="mt-1 block">{error}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Payment option card (radio) ---------- */
function Option({
  selected,
  onSelect,
  icon,
  title,
  text,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={SPRING}
      className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${
        selected ? "border-green-700 bg-green-50" : "border-green-100 bg-white hover:border-green-300"
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl transition-colors ${
          selected ? "bg-green-700 text-white" : "bg-green-50 text-green-700"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-green-950">{title}</span>
        <span className="block text-xs text-green-900/70">{text}</span>
      </span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          selected ? "border-green-700 bg-green-700 text-white" : "border-gray-300"
        }`}
      >
        {selected && <HiCheck size={12} />}
      </span>
    </motion.button>
  );
}

/* ---------- Modal ---------- */
type Props = {
  total: number;
  count: number;
  onClose: () => void;
  onConfirm: (result: PaymentResult) => void;
};

export default function PaymentModal({ total, count, onClose, onConfirm }: Props) {
  const [mode, setMode] = useState<Mode>("cod");
  const [sub, setSub] = useState<Sub>("upi");
  const [f, setF] = useState<Fields>({ upi: "", number: "", name: "", expiry: "", cvv: "", bank: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof Fields, value: string) => {
    setF((p) => ({ ...p, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  // Escape se band (loading ke dauran nahi) + peeche ka page scroll na ho
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [loading, onClose]);

  const handlePay = async () => {
    if (mode === "online") {
      const e = validate(sub, f);
      setErrors(e);
      if (Object.keys(e).length > 0) return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500)); // payment process ho raha hai (dummy)

    if (mode === "cod") {
      onConfirm({ method: "cod", label: "Cash on Delivery", paid: false });
      return;
    }

    if (sub === "upi") onConfirm({ method: "upi", label: "UPI", paid: true, detail: f.upi.trim() });
    else if (sub === "card")
      onConfirm({ method: "card", label: "Card", paid: true, detail: `ending ${f.number.replace(/\s/g, "").slice(-4)}` });
    else onConfirm({ method: "netbanking", label: "Net Banking", paid: true, detail: f.bank });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => !loading && onClose()}
      className="fixed inset-0 z-60 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Choose payment method"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-green-950">Choose payment method</h2>
            <p className="mt-0.5 text-sm text-green-900/70">
              {count} {count === 1 ? "item" : "items"} ·{" "}
              <span className="font-bold text-green-950">{money(total)}</span>
            </p>
          </div>
          <motion.button
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={SPRING}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40"
          >
            <HiOutlineXMark size={22} />
          </motion.button>
        </div>

        {/* Options */}
        <div role="radiogroup" aria-label="Payment method" className="mt-5 space-y-3">
          <Option
            selected={mode === "cod"}
            onSelect={() => setMode("cod")}
            icon={<HiOutlineBanknotes />}
            title="Cash on Delivery"
            text="Pay in cash when your order arrives"
          />
          <Option
            selected={mode === "online"}
            onSelect={() => setMode("online")}
            icon={<HiOutlineCreditCard />}
            title="Online Payment"
            text="UPI, Card or Net Banking · Pay now"
          />
        </div>

        {/* Online payment details */}
        <AnimatePresence initial={false}>
          {mode === "online" && (
            <motion.div
              key="online"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {/* UPI / Card / Net Banking tabs */}
              <div className="mt-4 grid grid-cols-3 gap-2" role="tablist">
                {SUBS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={sub === s.id}
                    onClick={() => {
                      setSub(s.id);
                      setErrors({});
                    }}
                    className={`flex flex-col items-center gap-1 rounded-xl border-2 py-2.5 text-xs font-semibold transition-colors ${
                      sub === s.id
                        ? "border-green-700 bg-green-700 text-white"
                        : "border-green-100 bg-white text-green-900 hover:border-green-300"
                    }`}
                  >
                    <span className="text-xl">{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={sub}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 space-y-3 rounded-2xl bg-green-50/60 p-4"
                >
                  {sub === "upi" && (
                    <Input
                      label="UPI ID"
                      value={f.upi}
                      onChange={(v) => set("upi", v)}
                      error={errors.upi}
                      placeholder="yourname@upi"
                      autoComplete="off"
                    />
                  )}

                  {sub === "card" && (
                    <>
                      <Input
                        label="Card number"
                        value={f.number}
                        onChange={(v) =>
                          set("number", v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim())
                        }
                        error={errors.number}
                        placeholder="1234 5678 9012 3456"
                        inputMode="numeric"
                        maxLength={19}
                        autoComplete="off"
                      />
                      <Input
                        label="Name on card"
                        value={f.name}
                        onChange={(v) => set("name", v)}
                        error={errors.name}
                        placeholder="Full name"
                        autoComplete="off"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Expiry"
                          value={f.expiry}
                          onChange={(v) => {
                            const d = v.replace(/\D/g, "").slice(0, 4);
                            set("expiry", d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                          }}
                          error={errors.expiry}
                          placeholder="MM/YY"
                          inputMode="numeric"
                          maxLength={5}
                          autoComplete="off"
                        />
                        <Input
                          label="CVV"
                          value={f.cvv}
                          onChange={(v) => set("cvv", v.replace(/\D/g, "").slice(0, 3))}
                          error={errors.cvv}
                          placeholder="123"
                          inputMode="numeric"
                          maxLength={3}
                          autoComplete="off"
                        />
                      </div>
                    </>
                  )}

                  {sub === "netbanking" && (
                    <div>
                      <label htmlFor="bank" className="mb-1 block text-xs font-semibold text-green-950">
                        Select your bank
                      </label>
                      <select
                        id="bank"
                        value={f.bank}
                        onChange={(e) => set("bank", e.target.value)}
                        aria-invalid={!!errors.bank}
                        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-green-950 outline-none transition focus:ring-4 ${
                          errors.bank
                            ? "border-red-400 focus:ring-red-500/10"
                            : "border-green-200 focus:border-green-700 focus:ring-green-700/10"
                        }`}
                      >
                        <option value="">Choose a bank</option>
                        {BANKS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                      {errors.bank && <p role="alert" className="mt-1 text-xs font-medium text-red-600">{errors.bank}</p>}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pay button */}
        <motion.button
          onClick={handlePay}
          disabled={loading}
          whileHover={loading ? undefined : { scale: 1.03 }}
          whileTap={loading ? undefined : { scale: 0.97 }}
          transition={SPRING}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-green-800 py-3.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              {mode === "cod" ? "PLACING ORDER..." : "PROCESSING PAYMENT..."}
            </>
          ) : mode === "cod" ? (
            "PLACE ORDER"
          ) : (
            <>
              <HiOutlineLockClosed size={16} />
              PAY {money(total)}
            </>
          )}
        </motion.button>

        <p className="mt-3 text-center text-xs text-green-900/60">
          Demo only: koi asli payment nahi hota. Asli card ya UPI details mat daalna.
        </p>
      </motion.div>
    </motion.div>
  );
}
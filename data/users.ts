/* ---------- Types ---------- */
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type SessionUser = Omit<User, "password">;

export type AuthResult = { ok: true; user: SessionUser } | { ok: false; error: string };

/* ---------- Dummy users ----------
 * Naya user yahan jod sakte ho. Phone number apna daal lena.
 * NOTE: Ye sirf demo hai. Asli project me password kabhi plain text me nahi rakhte.
 */
const SEED_USERS: User[] = [
  {
    id: "u1",
    name: "Rohit Lohra",
    email: "rohitlohra123@gmail.com",
    phone: "9876543210",
    password: "Rohit@123",
  },
];

// Login page par "Demo account" box ke liye (production me ye hata dena)
export const DEMO_LOGIN = { email: SEED_USERS[0].email, password: SEED_USERS[0].password };

/* ---------- Password rules (signup me sab zaroori) ---------- */
export const PASSWORD_RULES = [
  { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "upper", label: "One capital letter (A-Z)", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower", label: "One small letter (a-z)", test: (p: string) => /[a-z]/.test(p) },
  { id: "number", label: "One number (0-9)", test: (p: string) => /\d/.test(p) },
  { id: "special", label: "One special character (@ # $ !)", test: (p: string) => /[^A-Za-z0-9\s]/.test(p) },
];

export const passwordScore = (p: string) => PASSWORD_RULES.filter((r) => r.test(p)).length;
export const isStrongPassword = (p: string) => PASSWORD_RULES.every((r) => r.test(p));

/* ---------- Browser storage helpers (SSR safe) ---------- */
const USERS_KEY = "demo_users";
const SESSION_KEY = "demo_session";

function store(kind: "local" | "session"): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function read<T>(kind: "local" | "session", key: string, fallback: T): T {
  try {
    const raw = store(kind)?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(kind: "local" | "session", key: string, value: unknown) {
  try {
    store(kind)?.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full ya blocked: ignore */
  }
}

// Password hata kar sirf safe data session me rakhte hain
const toSession = (u: User): SessionUser => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone,
});

/* ---------- Users ---------- */
export function getUsers(): User[] {
  return [...SEED_USERS, ...read<User[]>("local", USERS_KEY, [])];
}

/* ---------- Signup ---------- */
export function registerUser(input: { name: string; email: string; phone: string; password: string }): AuthResult {
  const email = input.email.trim().toLowerCase();
  const users = getUsers();

  if (users.some((u) => u.email === email)) {
    return { ok: false, error: "This email is already registered. Please log in." };
  }
  if (users.some((u) => u.phone === input.phone)) {
    return { ok: false, error: "This mobile number is already registered. Please log in." };
  }
  if (!isStrongPassword(input.password)) {
    return { ok: false, error: "Password does not meet all the requirements." };
  }

  const user: User = {
    id: `u${Date.now()}`,
    name: input.name.trim(),
    email,
    phone: input.phone,
    password: input.password,
  };

  write("local", USERS_KEY, [...read<User[]>("local", USERS_KEY, []), user]);
  return { ok: true, user: toSession(user) };
}

/* ---------- Login (email ya phone) ---------- */
export function loginUser(type: "email" | "phone", identifier: string, password: string): AuthResult {
  const user = getUsers().find((u) => (type === "email" ? u.email === identifier : u.phone === identifier));

  // Same message dono cases me (user nahi mila / password galat)
  if (!user || user.password !== password) {
    return { ok: false, error: "Incorrect email/mobile number or password" };
  }
  return { ok: true, user: toSession(user) };
}

/* ---------- Session ---------- */
const SESSION_EVENT = "auth-change";

// Login ya logout hote hi Header jaisi jagah apne aap update ho jati hain
function notify() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(SESSION_EVENT));
}

function clearSession() {
  try {
    store("local")?.removeItem(SESSION_KEY);
    store("session")?.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function saveSession(user: SessionUser, remember: boolean) {
  clearSession();
  // remember = true  -> localStorage (browser band karke bhi login rahega)
  // remember = false -> sessionStorage (tab band hote hi logout)
  write(remember ? "local" : "session", SESSION_KEY, user);
  notify();
}

export function logoutUser() {
  clearSession();
  notify();
}

// Raw string (useAuth hook ke liye)
export function getSessionRaw(): string | null {
  try {
    return store("local")?.getItem(SESSION_KEY) ?? store("session")?.getItem(SESSION_KEY) ?? null;
  } catch {
    return null;
  }
}

// Session badalne par callback chalao (hook isi se sunta hai)
export function subscribeSession(callback: () => void) {
  window.addEventListener(SESSION_EVENT, callback);
  window.addEventListener("storage", callback); // dusre tab me login/logout
  return () => {
    window.removeEventListener(SESSION_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function getSession(): SessionUser | null {
  const raw = getSessionRaw();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}
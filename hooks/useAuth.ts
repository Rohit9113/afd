"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { getSessionRaw, subscribeSession, type SessionUser } from "@/data/users";

// Ye sirf "browser ready hai ya nahi" check karne ke liye hai
const noopSubscribe = () => () => {};

/**
 * Kaun login hai?
 * - user  : login hai to user ka data, warna null
 * - ready : browser se check hone ke baad true (isse pehle spinner dikhana chahiye)
 *
 * Login ya logout hote hi ye apne aap update ho jata hai.
 */
export function useAuth() {
  const raw = useSyncExternalStore(subscribeSession, getSessionRaw, () => null);
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  const user = useMemo<SessionUser | null>(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SessionUser;
    } catch {
      return null;
    }
  }, [raw]);

  return { user, ready };
}

/**
 * Protected page ke liye (profile, cart).
 * Login nahi hai to /login par bhej deta hai, aur login ke baad wapas isi page par laata hai.
 *
 * Use: const { user, ready } = useRequireAuth("/cart");
 */
export function useRequireAuth(next: string) {
  const router = useRouter();
  const { user, ready } = useAuth();

  useEffect(() => {
    if (ready && !user) {
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [ready, user, next, router]);

  return { user, ready };
}
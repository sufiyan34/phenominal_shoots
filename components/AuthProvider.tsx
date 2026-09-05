"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { auth, db } from "@/lib/firebase/client";

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAdmin: false,
  loading: true,
  signOutUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (next) => {
      setUser(next);
      if (!next) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", next.uid));
        const role = snap.exists() ? snap.data().role : null;
        setIsAdmin(role === "admin" || role === "superAdmin");
      } catch (error) {
  console.error("ADMIN ROLE CHECK FAILED:", error);
  setIsAdmin(false);
} finally {
        setLoading(false);
      }
    });
  }, []);

  const value = useMemo(
    () => ({ user, isAdmin, loading, signOutUser: () => signOut(auth) }),
    [user, isAdmin, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

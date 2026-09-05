"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace(user ? "/admin/login?forbidden=1" : "/admin/login");
  }, [loading, user, isAdmin, router]);

  if (loading || !user || !isAdmin) return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#ebe6dc"}}>Checking access…</main>;
  return children;
}

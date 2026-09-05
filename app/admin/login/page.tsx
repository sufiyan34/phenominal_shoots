"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { useAuth } from "@/components/AuthProvider";

export default function AdminLoginPage() {
  return <Suspense fallback={null}><AdminLogin /></Suspense>;
}

function AdminLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forbidden = searchParams.get("forbidden") === "1";
  const { user, isAdmin, loading, signOutUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Only redirect once we know the signed-in user is actually an admin.
  // Redirecting on `user` alone (ignoring isAdmin) is what caused the
  // /admin <-> /admin/login?forbidden=1 infinite loop for non-admin accounts.
  useEffect(() => {
    if (!loading && user && isAdmin) router.replace("/admin");
  }, [loading, user, isAdmin, router]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Don't redirect here — let the effect above do it once `isAdmin`
      // has resolved from Firestore. Redirecting immediately on successful
      // auth (before we know the role) is what re-triggered the loop.
    } catch {
      setError("Unable to sign in. Check your email and password.");
      setBusy(false);
    }
  }

  // Signed in, role check finished, but not an admin: show a clear message
  // instead of silently bouncing back and forth.
  if (!loading && user && !isAdmin) {
    return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#211d18",color:"#f3f0e8"}}>
      <div style={{width:"min(440px,calc(100% - 32px))",padding:36,border:"1px solid rgba(243,240,232,.16)"}}>
        <div className="eyebrow" style={{color:"#bdb5a8"}}>Private studio</div>
        <h1 className="display" style={{fontSize:36,lineHeight:1}}>Access denied</h1>
        <p style={{fontSize:14,color:"#bdb5a8",marginTop:16}}>
          Signed in as {user.email}, but this account isn&apos;t marked as an admin
          (check the <code>users/{"{uid}"}</code> document&apos;s <code>role</code> field in Firestore).
        </p>
        <button className="btn btn-light" style={{marginTop:20}} onClick={()=>void signOutUser()}>Sign out</button>
      </div>
    </main>;
  }

  return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#211d18",color:"#f3f0e8"}}>
    <form onSubmit={submit} style={{width:"min(440px,calc(100% - 32px))",padding:36,border:"1px solid rgba(243,240,232,.16)"}}>
      <div className="eyebrow" style={{color:"#bdb5a8"}}>Private studio</div>
      <h1 className="display" style={{fontSize:54,lineHeight:.9}}>Admin sign in</h1>
      {forbidden && <p style={{fontSize:13,color:"#c78963",marginTop:8}}>That account doesn&apos;t have admin access.</p>}
      <div style={{display:"grid",gap:12,marginTop:28}}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required />
        {error && <div style={{fontSize:13,color:"#c78963"}}>{error}</div>}
        <button className="btn btn-light" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </div>
    </form>
  </main>;
}

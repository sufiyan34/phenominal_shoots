"use client";

import { FormEvent, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (user) => {
    if (user) router.replace("/admin");
  }), [router]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/admin");
    } catch {
      setError("Unable to sign in. Check your email and password.");
    } finally { setBusy(false); }
  }

  return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#211d18",color:"#f3f0e8"}}>
    <form onSubmit={submit} style={{width:"min(440px,calc(100% - 32px))",padding:36,border:"1px solid rgba(243,240,232,.16)"}}>
      <div className="eyebrow" style={{color:"#bdb5a8"}}>Private studio</div>
      <h1 className="display" style={{fontSize:54,lineHeight:.9}}>Admin sign in</h1>
      <div style={{display:"grid",gap:12,marginTop:28}}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required />
        {error && <div style={{fontSize:13,color:"#c78963"}}>{error}</div>}
        <button className="btn btn-light" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </div>
    </form>
  </main>;
}

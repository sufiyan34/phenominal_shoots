"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { listPublished } from "@/lib/publicData";
import type { Project } from "@/lib/types";

export default function ProjectPublicList() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { listPublished<Project>("projects").then(setItems).finally(() => setLoading(false)); }, []);
  if (loading) return <p style={{color:"var(--muted)"}}>Loading the archive…</p>;
  if (!items.length) return <p style={{color:"var(--muted)"}}>Projects will appear here once published from the studio.</p>;
  return <div className="grid-12">{items.map((p,i)=><Link key={p.id} href={`/projects/${p.slug}`} style={{gridColumn:i%3===1?"span 7":"span 5",display:"block"}}><div className="media" style={{height:i%3===1?540:430}}><img src={p.coverImage} alt={p.title}/></div><div style={{paddingTop:12,display:"flex",justifyContent:"space-between",gap:12}}><div><strong>{p.title}</strong><div className="eyebrow" style={{marginTop:5}}>{p.category}</div></div><span className="eyebrow">{p.location}</span></div></Link>)}</div>;
}

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { listPublished } from "@/lib/publicData";
import { projects as mockProjects } from "@/data/mock";
import type { Project } from "@/lib/types";
export default function ProjectGrid({limit}:{limit?:number}){const [items,setItems]=useState<Project[]>([]);useEffect(()=>{void listPublished<Project>("projects").then(setItems).catch(()=>{})},[]);const list=items.length?items:mockProjects.map(x=>({id:x.slug,slug:x.slug,title:x.title,category:x.category,location:x.location,coverImage:x.image,status:"published" as const}));const shown=list.slice(0,limit);return <div className="grid-12">{shown.map((p,i)=><Link key={p.id} href={`/projects/${p.slug}`} style={{gridColumn:i===1?"span 7":"span 5",display:"block"}}><div className="media" style={{height:i===1?520:430}}><img src={p.coverImage} alt={p.title}/></div><div style={{paddingTop:12,display:"flex",justifyContent:"space-between",gap:12}}><div><strong>{p.title}</strong><div className="eyebrow" style={{marginTop:5}}>{p.category}</div></div><span className="eyebrow">{p.location}</span></div></Link>)}</div>}

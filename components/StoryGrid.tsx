"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { listPublished } from "@/lib/publicData";
import { stories as mockStories } from "@/data/mock";
import type { Story } from "@/lib/types";
export default function StoryGrid({limit}:{limit?:number}){const [items,setItems]=useState<Story[]>([]);useEffect(()=>{void listPublished<Story>("stories").then(setItems).catch(()=>{})},[]);const list=items.length?items:mockStories.map(x=>({id:x.slug,slug:x.slug,title:x.title,publishedAt:x.date,coverImage:x.image,status:"published" as const}));return <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>{list.slice(0,limit).map(s=><Link key={s.id} href={`/stories/${s.slug}`}><div className="media" style={{aspectRatio:"1.25"}}>{s.coverImage&&<img src={s.coverImage} alt={s.title}/>}</div><div style={{paddingTop:12}}><div className="eyebrow">{s.publishedAt??"Studio story"}</div><h3 className="display" style={{fontSize:25,lineHeight:1.05,margin:"10px 0"}}>{s.title}</h3><span className="eyebrow">Read story →</span></div></Link>)}</div>}

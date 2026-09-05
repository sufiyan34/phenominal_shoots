"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { listPublished } from "@/lib/publicData";
import { packages as mockPackages } from "@/data/mock";
import type { PackageModel } from "@/lib/types";
export default function PackageCards(){const [items,setItems]=useState<PackageModel[]>([]);useEffect(()=>{void listPublished<PackageModel>("packages").then(setItems).catch(()=>{})},[]);const list=items.length?items:mockPackages.map(x=>({id:x.slug,slug:x.slug,name:x.name,priceLabel:x.price,features:x.features,status:"published" as const}));return <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>{list.map((p,i)=><div key={p.id} style={{border:"1px solid rgba(243,240,232,.22)",padding:"25px 22px",minHeight:430,display:"flex",flexDirection:"column"}}><div className="eyebrow" style={{color:"#c7bcae"}}>0{i+1}</div><h3 className="display" style={{fontSize:32,margin:"18px 0 8px"}}>{p.name}</h3><div style={{fontSize:24,marginBottom:22}}>{p.priceLabel}</div><div style={{display:"grid",gap:10,flex:1}}>{(p.features??[]).map(f=><div key={f} style={{fontSize:13,paddingBottom:9,borderBottom:"1px solid rgba(243,240,232,.12)"}}>+ {f}</div>)}</div><Link className="btn btn-light" href={`/packages/${p.slug}`}>View Package</Link></div>)}</div>}

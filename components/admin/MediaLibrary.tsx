"use client";
import { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { uploadSignedToCloudinary } from "@/lib/cloudinary";
import type { MediaAsset } from "@/lib/types";

export default function MediaLibrary(){
  const [items,setItems]=useState<MediaAsset[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState("");
  async function load(){try{const snap=await getDocs(query(collection(db,"media_assets"),orderBy("createdAt","desc"),limit(200)));setItems(snap.docs.map(d=>({id:d.id,...d.data()} as MediaAsset)))}catch(e){setError(e instanceof Error?e.message:"Could not load media")}}
  useEffect(()=>{void load()},[]);
  async function upload(file?:File){if(!file)return;setBusy(true);setError("");try{const x=await uploadSignedToCloudinary(file,"phenomenal-shoots/library");await addDoc(collection(db,"media_assets"),{name:file.name,publicId:x.public_id,secureUrl:x.secure_url,resourceType:x.resource_type,type:x.resource_type==="video"?"video":"image",createdAt:serverTimestamp()});await load()}catch(e){setError(e instanceof Error?e.message:"Upload failed")}finally{setBusy(false)}}
  return <main><div style={{display:"flex",justifyContent:"space-between",alignItems:"end",marginBottom:24}}><div><div className="eyebrow">Cloudinary</div><h1 className="display" style={{fontSize:56,margin:"8px 0"}}>Media Library</h1><p style={{color:"var(--muted)"}}>Upload and reuse images or videos across the site.</p></div><label className="btn btn-dark" style={{cursor:"pointer"}}>{busy?"Uploading…":"Upload media"}<input type="file" accept="image/*,video/*" hidden onChange={e=>void upload(e.target.files?.[0]??undefined)}/></label></div>{error&&<div style={{padding:14,background:"#e5d2c5",marginBottom:14}}>{error}</div>}<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>{items.map(x=><a href={x.secureUrl} target="_blank" rel="noreferrer" key={x.id} style={{background:"#f3f0e8",padding:10}}>{x.resourceType==="video"?<video src={x.secureUrl} controls style={{width:"100%",aspectRatio:"1.1",objectFit:"cover"}}/>:<div className="media" style={{aspectRatio:"1.1"}}><img src={x.secureUrl} alt={x.name}/></div>}<div style={{fontSize:12,marginTop:9,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{x.name}</div></a>)}</div></main>
}

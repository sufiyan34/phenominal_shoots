"use client";
import { useState } from "react";
import { uploadSignedToCloudinary } from "@/lib/cloudinary";
export default function CloudinaryPicker({value,onChange,label="Upload media",folder="phenomenal-shoots"}:{value:string;onChange:(url:string)=>void;label?:string;folder?:string}){
 const [busy,setBusy]=useState(false),[error,setError]=useState("");
 async function upload(file?:File){if(!file)return;setBusy(true);setError("");try{const result=await uploadSignedToCloudinary(file,folder);onChange(result.secure_url);}catch(e){setError(e instanceof Error?e.message:"Upload failed")}finally{setBusy(false)}}
 return <div style={{display:"grid",gap:8}}><input value={value} onChange={e=>onChange(e.target.value)} placeholder="https://..."/><label style={{display:"inline-flex",alignItems:"center",gap:10,fontSize:12,cursor:"pointer"}}><input type="file" accept="image/*,video/*" onChange={e=>upload(e.target.files?.[0])} style={{width:"auto"}}/>{busy?"Uploading…":label}</label>{error&&<span style={{fontSize:12,color:"#a34f35"}}>{error}</span>}</div>;
}

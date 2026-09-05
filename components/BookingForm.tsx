"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking } from "@/lib/repositories";
import { listPublished } from "@/lib/publicData";
import type { PackageModel } from "@/lib/types";

export default function BookingForm(){
  const r=useRouter(),[packages,setPackages]=useState<PackageModel[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState("");
  useEffect(()=>{void listPublished<PackageModel>("packages").then(setPackages).catch(()=>{})},[]);
  async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError("");const f=new FormData(e.currentTarget);const packageId=String(f.get("packageId")||"");const selected=packages.find(p=>p.id===packageId || p.slug===packageId);
    try{const result=await createBooking({clientName:String(f.get("clientName")),email:String(f.get("email")),phone:String(f.get("phone")),eventType:String(f.get("eventType")),eventDate:String(f.get("eventDate")),endDate:String(f.get("endDate")||"")||undefined,location:String(f.get("location")),packageId:selected?.id||packageId||undefined,packageSnapshot:selected?{id:selected.id,name:selected.name,priceLabel:selected.priceLabel}:undefined,notes:String(f.get("notes")||"")});r.push(`/bookings/${result.publicToken}`)}catch(e){setError(e instanceof Error?e.message:"Could not submit booking.")}finally{setBusy(false)}}
  return <form onSubmit={submit} style={{display:"grid",gap:12}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><input name="clientName" placeholder="Full name" required/><input name="email" type="email" placeholder="Email" required/></div><input name="phone" placeholder="Phone number" required/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><select name="eventType" defaultValue="" required><option value="" disabled>Event type</option><option>Wedding</option><option>Birthday</option><option>Corporate</option><option>Fashion</option><option>Other</option></select><input name="eventDate" type="date" required/></div><input name="endDate" type="date"/><input name="location" placeholder="Event location" required/><select name="packageId" defaultValue=""><option value="">Package preference (optional)</option>{packages.map(p=><option key={p.id} value={p.id}>{p.name} — {p.priceLabel}</option>)}</select><textarea name="notes" placeholder="Tell us what you're planning..."/><button className="btn btn-dark" disabled={busy}>{busy?"Submitting…":"Submit Booking Request"}</button>{error&&<p style={{color:"#8c3c2c"}}>{error}</p>}</form>;
}

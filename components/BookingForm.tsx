"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking, listAvailability } from "@/lib/repositories";
import { listPublished } from "@/lib/publicData";
import { HONEYPOT_FIELD, isLikelySpamSubmission } from "@/lib/utils";
import type { Availability, PackageModel } from "@/lib/types";

// Every date from `start` to `end` inclusive, as YYYY-MM-DD strings.
function dateRange(start: string, end?: string): string[] {
  if (!end || end <= start) return [start];
  const out: string[] = [];
  const cursor = new Date(`${start}T00:00:00`);
  const last = new Date(`${end}T00:00:00`);
  while (cursor <= last) { out.push(cursor.toISOString().slice(0, 10)); cursor.setDate(cursor.getDate() + 1); }
  return out;
}

export default function BookingForm(){
  const r=useRouter(),[packages,setPackages]=useState<PackageModel[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState("");
  const [availability,setAvailability]=useState<Availability[]>([]);
  const [eventDate,setEventDate]=useState(""),[endDate,setEndDate]=useState("");
  const mountedAt=useRef(Date.now());
  useEffect(()=>{void listPublished<PackageModel>("packages").then(setPackages).catch(()=>{})},[]);
  // availability is publicly readable (firestore.rules) — this is the
  // studio's own calendar, previously only ever shown to the admin.
  useEffect(()=>{void listAvailability().then(setAvailability).catch(()=>{})},[]);
  const availabilityMap=useMemo(()=>new Map(availability.map(a=>[a.date,a.status])),[availability]);

  const conflicts=useMemo(()=>{
    if(!eventDate) return { blocking: [] as string[], tentative: [] as string[] };
    const days=dateRange(eventDate,endDate||undefined);
    const blocking=days.filter(d=>availabilityMap.get(d)==="booked"||availabilityMap.get(d)==="blocked");
    const tentative=days.filter(d=>availabilityMap.get(d)==="tentative");
    return { blocking, tentative };
  },[eventDate,endDate,availabilityMap]);

  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();setError("");
    const f=new FormData(e.currentTarget);
    if(isLikelySpamSubmission(f,mountedAt.current)){
      // Behave exactly like a normal success so a bot gets no signal that
      // it was filtered — nothing is written to Firestore.
      setBusy(true); await new Promise(res=>setTimeout(res,400)); r.push("/book"); return;
    }
    if(conflicts.blocking.length){ setError("The selected date(s) aren't available. Please choose a different date."); return; }
    setBusy(true);
    const packageId=String(f.get("packageId")||"");const selected=packages.find(p=>p.id===packageId || p.slug===packageId);
    try{const result=await createBooking({clientName:String(f.get("clientName")),email:String(f.get("email")),phone:String(f.get("phone")),eventType:String(f.get("eventType")),eventDate:String(f.get("eventDate")),endDate:String(f.get("endDate")||"")||undefined,location:String(f.get("location")),packageId:selected?.id||packageId||undefined,packageSnapshot:selected?{id:selected.id,name:selected.name,priceLabel:selected.priceLabel}:undefined,notes:String(f.get("notes")||"")});r.push(`/bookings/${result.publicToken}`)}catch(e){setError(e instanceof Error?e.message:"Could not submit booking.")}finally{setBusy(false)}
  }
  return <form onSubmit={submit} style={{display:"grid",gap:12}}>
    <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{position:"absolute",left:-9999,width:1,height:1,opacity:0}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><input name="clientName" placeholder="Full name" required/><input name="email" type="email" placeholder="Email" required/></div>
    <input name="phone" placeholder="Phone number" required/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><select name="eventType" defaultValue="" required><option value="" disabled>Event type</option><option>Wedding</option><option>Birthday</option><option>Corporate</option><option>Fashion</option><option>Other</option></select><input name="eventDate" type="date" required value={eventDate} onChange={e=>setEventDate(e.target.value)}/></div>
    <input name="endDate" type="date" value={endDate} onChange={e=>setEndDate(e.target.value)}/>
    {conflicts.blocking.length>0&&<p style={{color:"#8c3c2c",fontSize:13}}>Not available: {conflicts.blocking.join(", ")}. Please pick a different date.</p>}
    {conflicts.blocking.length===0&&conflicts.tentative.length>0&&<p style={{color:"#9a6748",fontSize:13}}>Heads up — {conflicts.tentative.join(", ")} {conflicts.tentative.length>1?"are":"is"} tentatively held. We'll confirm availability when we review your request.</p>}
    <input name="location" placeholder="Event location" required/>
    <select name="packageId" defaultValue=""><option value="">Package preference (optional)</option>{packages.map(p=><option key={p.id} value={p.id}>{p.name} — {p.priceLabel}</option>)}</select>
    <textarea name="notes" placeholder="Tell us what you're planning..."/>
    <button className="btn btn-dark" disabled={busy||conflicts.blocking.length>0}>{busy?"Submitting…":"Submit Booking Request"}</button>
    {error&&<p style={{color:"#8c3c2c"}}>{error}</p>}
  </form>;
}

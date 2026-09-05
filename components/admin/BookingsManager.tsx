"use client";
import { useEffect, useState } from "react";
import { listBookings, updateBookingStatus } from "@/lib/repositories";
import type { Booking, BookingStatus } from "@/lib/types";

const nextActions: Record<string, Array<{label:string;status:BookingStatus}>> = {
  NEW:[{label:"Review",status:"UNDER_REVIEW"}],
  UNDER_REVIEW:[{label:"Accept",status:"ACCEPTED"},{label:"Reject",status:"REJECTED"}],
  ACCEPTED:[{label:"Request Advance",status:"ADVANCE_REQUESTED"}],
  ADVANCE_REQUESTED:[],
  PAYMENT_PROOF_SUBMITTED:[{label:"Verify Payment",status:"PAYMENT_VERIFIED"},{label:"Reject Proof",status:"ADVANCE_REQUESTED"}],
  PAYMENT_VERIFIED:[{label:"Confirm",status:"CONFIRMED"}],
  CONFIRMED:[{label:"Complete",status:"COMPLETED"}],
};

export default function BookingsManager(){
  const [items,setItems]=useState<Booking[]>([]); const [busy,setBusy]=useState(true); const [error,setError]=useState("");
  async function load(){setBusy(true);try{setItems(await listBookings());setError("")}catch(e){setError(e instanceof Error?e.message:"Unable to load bookings")}finally{setBusy(false)}}
  useEffect(()=>{void load()},[]);
  async function move(b:Booking,status:BookingStatus){if(!b.id)return;setBusy(true);try{await updateBookingStatus(b.id,status,status==="ACCEPTED"?{acceptedAt:new Date()}:{});await load()}catch(e){setError(e instanceof Error?e.message:"Could not update booking")}finally{setBusy(false)}}
  return <main><div className="eyebrow">Operations · Firestore</div><h1 className="display" style={{fontSize:56,margin:"8px 0 30px"}}>Bookings</h1>{error&&<div style={{padding:14,background:"#e5d2c5",marginBottom:16}}>{error}</div>}<div style={{background:"#f3f0e8",padding:24}}>{busy?<p>Loading bookings…</p>:items.length===0?<p>No booking requests yet.</p>:items.map(b=><div key={b.id} style={{padding:"18px 0",borderBottom:"1px solid rgba(23,23,20,.08)",display:"grid",gridTemplateColumns:"1.3fr 1fr 130px 1.5fr",gap:15,alignItems:"center"}}><div><strong>{b.clientName}</strong><div className="eyebrow" style={{marginTop:4}}>{b.publicReference}</div></div><span>{b.eventType} · {b.eventDate}</span><span>{b.status.replaceAll("_"," ")}</span><div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{(nextActions[b.status]??[]).map(a=><button key={a.status} className="btn btn-outline" onClick={()=>move(b,a.status)}>{a.label}</button>)}</div></div>)}</div></main>
}

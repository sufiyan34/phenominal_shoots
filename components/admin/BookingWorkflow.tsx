"use client";
import { useEffect, useState } from "react";
import { listBookings, listPaymentProofs, updateBookingStatus } from "@/lib/repositories";
import type { Booking, BookingStatus, PaymentProof } from "@/lib/types";

const actions: Record<BookingStatus, Array<{label:string;status:BookingStatus}>> = {
  NEW:[{label:"Review",status:"UNDER_REVIEW"}], UNDER_REVIEW:[{label:"Accept",status:"ACCEPTED"},{label:"Reject",status:"REJECTED"}],
  ACCEPTED:[{label:"Request Advance",status:"ADVANCE_REQUESTED"}], ADVANCE_REQUESTED:[],
  PAYMENT_PROOF_SUBMITTED:[{label:"Verify Payment",status:"PAYMENT_VERIFIED"},{label:"Reject Proof",status:"ADVANCE_REQUESTED"}],
  PAYMENT_VERIFIED:[{label:"Confirm",status:"CONFIRMED"}], CONFIRMED:[{label:"Complete",status:"COMPLETED"}], COMPLETED:[], REJECTED:[], CANCELLED:[]
};

export default function BookingWorkflow(){
  const [items,setItems]=useState<Booking[]>([]),[proofs,setProofs]=useState<PaymentProof[]>([]),[busy,setBusy]=useState(true),[error,setError]=useState("");
  async function load(){setBusy(true);try{setItems(await listBookings());setProofs(await listPaymentProofs());setError("")}catch(e){setError(e instanceof Error?e.message:"Unable to load bookings")}finally{setBusy(false)}}
  useEffect(()=>{void load()},[]);
  async function move(b:Booking,status:BookingStatus){if(!b.id)return;const patch:Partial<Booking>={};
    if(status==="ACCEPTED")patch.acceptedAt=new Date();
    if(status==="ADVANCE_REQUESTED"){const amount=window.prompt("Advance amount (optional):",b.advanceAmount?String(b.advanceAmount):"");const due=window.prompt("Advance due date (YYYY-MM-DD, optional):",b.advanceDueDate??"");if(amount?.trim())patch.advanceAmount=Number(amount);if(due?.trim())patch.advanceDueDate=due.trim();}
    try{await updateBookingStatus(b.id,status,patch);await load()}catch(e){setError(e instanceof Error?e.message:"Could not update booking")}
  }
  return <div><div className="eyebrow">Operations</div><h1 className="display" style={{fontSize:56,margin:"8px 0 30px"}}>Bookings</h1>{error&&<div style={{padding:14,background:"#e5d2c5",marginBottom:14}}>{error}</div>}
    {busy&&!items.length?<p>Loading…</p>:!items.length?<p>No booking requests yet.</p>:<div style={{display:"grid",gap:12}}>{items.map(b=><article key={b.id} style={{background:"#f3f0e8",padding:22,border:"1px solid var(--line)"}}><div style={{display:"flex",justifyContent:"space-between",gap:15,flexWrap:"wrap"}}><div><div className="eyebrow">{b.publicReference}</div><h3 style={{margin:"6px 0"}}>{b.clientName} · {b.eventType}</h3><div style={{fontSize:13,color:"var(--muted)"}}>{b.eventDate} · {b.location} · {b.email}</div></div><strong style={{fontSize:12,textTransform:"uppercase"}}>{b.status.replaceAll("_"," ")}</strong></div>
      {b.status==="ADVANCE_REQUESTED"&&<div style={{marginTop:15,padding:14,background:"#e5e0d6",fontSize:13}}>Advance requested: {b.advanceAmount??"Amount pending"} · Due {b.advanceDueDate??"Not set"}</div>}
      {b.status==="PAYMENT_PROOF_SUBMITTED"&&<PaymentProofCard proof={proofs.find(p=>p.id===b.paymentProofId)} />}
      {b.notes&&<p style={{color:"var(--muted)",lineHeight:1.6}}>“{b.notes}”</p>}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:15}}>{(actions[b.status]??[]).map(a=><button key={a.status} className="btn btn-outline" onClick={()=>void move(b,a.status)}>{a.label}</button>)}</div>
    </article>)}</div>}</div>
}
function PaymentProofCard({proof}:{proof?:PaymentProof}){return <div style={{marginTop:15,borderTop:"1px solid var(--line)",paddingTop:15}}><div className="eyebrow">Payment proof</div>{proof?<><p style={{fontSize:13}}>Amount: {proof.amount??"—"} · Reference: {proof.paymentReference??"—"}</p><a href={proof.assetUrl} target="_blank" rel="noreferrer" className="btn btn-dark">Open proof</a></>:<p>Proof record not found.</p>}</div>}

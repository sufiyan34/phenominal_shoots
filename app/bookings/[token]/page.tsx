"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPublicBooking } from "@/lib/repositories";
import PaymentProofForm from "@/components/PaymentProofForm";

export default function BookingStatusPage(){
  const params=useParams<{token:string}>();const token=params.token;const [booking,setBooking]=useState<Record<string,unknown>|null>(null);const [loading,setLoading]=useState(true);const [error,setError]=useState("");
  useEffect(()=>{getPublicBooking(token).then(setBooking).catch(e=>setError(e instanceof Error?e.message:"Could not load booking")).finally(()=>setLoading(false))},[token]);
  if(loading)return <main style={{paddingTop:140}}><section className="section"><div className="shell">Loading booking…</div></section></main>;
  if(error||!booking)return <main style={{paddingTop:140}}><section className="section"><div className="shell"><h1 className="display">Booking not found.</h1><Link className="btn btn-dark" href="/book">Return to booking</Link></div></section></main>;
  const status=String(booking.status);const advance=booking.advanceAmount as number|null|undefined;
  return <main style={{paddingTop:140}}><section className="section"><div className="shell" style={{maxWidth:1000}}><div className="eyebrow">Booking status · {String(booking.publicReference)}</div><h1 className="display" style={{fontSize:"clamp(52px,8vw,100px)",lineHeight:.9}}>Your request is {status.replaceAll("_"," ").toLowerCase()}.</h1><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginTop:40}}><div style={{background:"#e5e0d6",padding:25}}><div className="eyebrow">Event</div><h3>{String(booking.eventType)}</h3><p>{String(booking.eventDate)} · {String(booking.location)}</p></div><div style={{background:"#e5e0d6",padding:25}}><div className="eyebrow">Next step</div><h3>{status==="ADVANCE_REQUESTED"?`Advance ${advance??"requested"}`:status==="PAYMENT_PROOF_SUBMITTED"?"Payment proof under review":status==="CONFIRMED"?"You're confirmed":"The studio will update this page when there is a change."}</h3><p style={{color:"var(--muted)",lineHeight:1.7}}>Keep this private booking link so you can return to the latest status.</p></div></div>{status==="ADVANCE_REQUESTED"&&<div style={{marginTop:50}}><div className="eyebrow">Advance payment</div><p style={{maxWidth:680,lineHeight:1.8}}>Use the studio's payment instructions, then upload an image proof below. The site does not process bank/card payments.</p><p><strong>{advance?`Requested advance: ${advance}`:"Advance amount will be confirmed by the studio."}</strong></p><PaymentProofForm token={token} bookingId={String(booking.bookingId??"")} publicReference={String(booking.publicReference)} /></div>}{status==="PAYMENT_PROOF_SUBMITTED"&&<div style={{marginTop:45,padding:22,background:"#e5e0d6"}}>Your proof has been received and is awaiting verification.</div>}</div></section></main>
}

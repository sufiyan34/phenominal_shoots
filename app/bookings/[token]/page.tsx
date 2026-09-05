"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { subscribePublicBooking } from "@/lib/repositories";
import { getSiteSettings } from "@/lib/publicData";
import type { BookingPublic, SiteSettings } from "@/lib/types";
import PaymentProofForm from "@/components/PaymentProofForm";

export default function BookingStatusPage(){
  const params=useParams<{token:string}>();const token=params.token;
  const [booking,setBooking]=useState<BookingPublic|null>(null);const [loading,setLoading]=useState(true);const [error,setError]=useState("");
  const [settings,setSettings]=useState<SiteSettings>({});

  // Live subscription instead of a one-time fetch: the studio moving this
  // booking through the workflow (advance requested, proof verified,
  // confirmed...) shows up here immediately, no refresh needed.
  useEffect(()=>{
    setLoading(true);
    const unsubscribe=subscribePublicBooking(token,(b)=>{setBooking(b);setLoading(false)},(e)=>{setError(e.message||"Could not load booking");setLoading(false)});
    return unsubscribe;
  },[token]);
  useEffect(()=>{void getSiteSettings().then(setSettings)},[]);

  if(loading)return <main style={{paddingTop:140}}><section className="section"><div className="shell">Loading booking…</div></section></main>;
  if(error||!booking)return <main style={{paddingTop:140}}><section className="section"><div className="shell"><h1 className="display">Booking not found.</h1><Link className="btn btn-dark" href="/book">Return to booking</Link></div></section></main>;
  const status=booking.status;const advance=booking.advanceAmount;
  return <main style={{paddingTop:140}}><section className="section"><div className="shell" style={{maxWidth:1000}}><div className="eyebrow">Booking status · {booking.publicReference}</div><h1 className="display" style={{fontSize:"clamp(52px,8vw,100px)",lineHeight:.9}}>Your request is {status.replaceAll("_"," ").toLowerCase()}.</h1><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginTop:40}}><div style={{background:"#e5e0d6",padding:25}}><div className="eyebrow">Event</div><h3>{booking.eventType}</h3><p>{booking.eventDate} · {booking.location}</p></div><div style={{background:"#e5e0d6",padding:25}}><div className="eyebrow">Next step</div><h3>{status==="ADVANCE_REQUESTED"?`Advance ${advance??"requested"}`:status==="PAYMENT_PROOF_SUBMITTED"?"Payment proof under review":status==="CONFIRMED"?"You're confirmed":"The studio will update this page when there is a change."}</h3><p style={{color:"var(--muted)",lineHeight:1.7}}>Keep this private booking link so you can return to the latest status — this page updates on its own.</p></div></div>{status==="ADVANCE_REQUESTED"&&<div style={{marginTop:50}}><div className="eyebrow">Advance payment</div><p style={{maxWidth:680,lineHeight:1.8}}>Send the advance using the details below, then upload a screenshot of the payment as proof. The site does not process bank/card payments directly — the studio verifies each proof manually.</p><p><strong>{advance?`Requested advance: ${advance}`:"Advance amount will be confirmed by the studio."}</strong></p>{settings.advanceInstructions?<div style={{background:"#f3f0e8",padding:20,marginTop:14,whiteSpace:"pre-wrap",lineHeight:1.7}}>{settings.advanceInstructions}</div>:<p style={{color:"var(--muted)",fontStyle:"italic"}}>Payment instructions haven&apos;t been set up yet — please contact the studio directly.</p>}<div style={{marginTop:20}}><PaymentProofForm token={token} bookingId={booking.bookingId} publicReference={booking.publicReference} /></div></div>}{status==="PAYMENT_PROOF_SUBMITTED"&&<div style={{marginTop:45,padding:22,background:"#e5e0d6"}}>Your proof has been received and is awaiting verification.</div>}</div></section></main>
}

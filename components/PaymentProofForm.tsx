"use client";
import { useRef, useState } from "react";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { uploadPublicToCloudinary } from "@/lib/cloudinary";
import { HONEYPOT_FIELD, isLikelySpamSubmission } from "@/lib/utils";

// Client uploads a screenshot of the transfer/deposit; the studio reviews it
// manually in the admin panel and marks it verified or rejected. There's no
// payment gateway integration here by design — this form never touches an
// actual payment provider, it only stores an image + a status for review.
export default function PaymentProofForm({ token, bookingId, publicReference }: { token: string; bookingId: string; publicReference: string }) {
  const [busy,setBusy]=useState(false),[message,setMessage]=useState("");
  const mountedAt=useRef(Date.now());
  async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setMessage("");const f=new FormData(e.currentTarget);
    if(isLikelySpamSubmission(f,mountedAt.current)){await new Promise(res=>setTimeout(res,400));e.currentTarget.reset();setMessage("Payment proof uploaded. The studio will verify it shortly.");setBusy(false);return}
    const file=f.get("proof");if(!(file instanceof File)||!file.size){setMessage("Please select your payment proof image.");setBusy(false);return}
    try{const uploaded=await uploadPublicToCloudinary(file,"phenomenal-shoots/payment-proofs");const proof=await addDoc(collection(db,"payment_proofs"),{bookingId,publicReference,publicToken:token,assetUrl:uploaded.secure_url,cloudinaryPublicId:uploaded.public_id,amount:Number(f.get("amount"))||null,paymentReference:String(f.get("paymentReference")||""),status:"SUBMITTED",uploadedAt:serverTimestamp()});await updateDoc(doc(db,"bookings",bookingId),{publicToken:token,paymentProofId:proof.id,status:"PAYMENT_PROOF_SUBMITTED",lastUpdatedAt:serverTimestamp()});await updateDoc(doc(db,"booking_public",token),{status:"PAYMENT_PROOF_SUBMITTED",paymentProofId:proof.id,updatedAt:serverTimestamp()});setMessage("Payment proof uploaded. The studio will verify it shortly.");e.currentTarget.reset()}catch(err){setMessage(err instanceof Error?err.message:"Could not upload proof.")}finally{setBusy(false)}}
  return <form onSubmit={submit} style={{display:"grid",gap:12,maxWidth:650}}><input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{position:"absolute",left:-9999,width:1,height:1,opacity:0}}/><input name="amount" type="number" min="0" step="0.01" placeholder="Amount paid"/><input name="paymentReference" placeholder="Payment/reference number (optional)"/><input name="proof" type="file" accept="image/jpeg,image/png,image/webp" required/><button className="btn btn-dark" disabled={busy}>{busy?"Uploading…":"Upload Payment Proof"}</button>{message&&<p style={{color:"var(--muted)"}}>{message}</p>}</form>;
}

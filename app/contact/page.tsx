"use client";
import { useEffect, useState } from "react";
import ContactForm from "@/components/ContactForm";
import { getSiteSettings } from "@/lib/publicData";
import type { SiteSettings } from "@/lib/types";

export default function ContactPage(){
  const [settings,setSettings]=useState<SiteSettings>({});
  useEffect(()=>{void getSiteSettings().then(setSettings)},[]);
  return <main style={{paddingTop:140}}><section className="section"><div className="shell grid-12"><div style={{gridColumn:"span 5"}}><div className="eyebrow">Contact</div><h1 className="display" style={{fontSize:"clamp(58px,8vw,110px)",lineHeight:.85}}>Let's talk.</h1><p style={{color:"var(--muted)",lineHeight:1.8,maxWidth:460}}>Tell us what you're planning, what you need, or simply what you're imagining.</p>
    {(settings.contactEmail||settings.contactPhone)&&<div style={{marginTop:30,display:"grid",gap:8}}>
      {settings.contactEmail&&<a href={`mailto:${settings.contactEmail}`} style={{fontSize:15}}>{settings.contactEmail}</a>}
      {settings.contactPhone&&<a href={`tel:${settings.contactPhone.replace(/\s+/g,"")}`} style={{fontSize:15}}>{settings.contactPhone}</a>}
    </div>}
  </div><div style={{gridColumn:"span 7"}}><ContactForm/></div></div></section></main>
}
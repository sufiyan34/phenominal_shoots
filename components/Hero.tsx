"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function Hero(){
  const ref=useRef<HTMLDivElement>(null);const {scrollYProgress}=useScroll({target:ref,offset:["start start","end start"]});
  const imageY=useTransform(scrollYProgress,[0,1],[0,140]);const textY=useTransform(scrollYProgress,[0,1],[0,-58]);const rotateX=useTransform(scrollYProgress,[0,1],[0,3]);const rotateY=useTransform(scrollYProgress,[0,1],[0,-3]);
  const [title,setTitle]=useState("Stories That Live Forever.");const [subtitle,setSubtitle]=useState("Photography · Films · Stories");
  useEffect(()=>{getDoc(doc(db,"site_settings","main")).then(s=>{if(s.exists()){const d=s.data();if(typeof d.heroTitle==="string")setTitle(d.heroTitle);if(typeof d.heroSubtitle==="string")setSubtitle(d.heroSubtitle)}}).catch(()=>{})},[]);
  return <section ref={ref} style={{position:"relative",minHeight:"100svh",overflow:"hidden",background:"#171714",color:"#f3f0e8"}}><motion.div style={{position:"absolute",inset:"-7% 0",y:imageY}}><img src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=2200&q=88" alt="Cinematic photographer at work" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.55)"}}/></motion.div><div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(23,23,20,.86),rgba(23,23,20,.16) 70%),linear-gradient(0deg,rgba(23,23,20,.55),transparent 45%)"}}/><div className="shell" style={{position:"relative",zIndex:2,minHeight:"100svh",display:"flex",alignItems:"center"}}><motion.div style={{maxWidth:850,y:textY,rotateX,rotateY,transformPerspective:1000}}><div className="eyebrow" style={{color:"#d3c8b9"}}>{subtitle}</div><h1 className="display" style={{fontSize:"clamp(58px,9vw,132px)",lineHeight:.84,margin:"24px 0 30px",maxWidth:900}}>{title}</h1><p style={{maxWidth:520,color:"#ddd7cc",fontSize:17,lineHeight:1.7}}>Cinematic photographs and films for weddings, people, brands and the moments that deserve to stay with you.</p><div style={{display:"flex",gap:12,marginTop:34,flexWrap:"wrap"}}><Link className="btn btn-light" href="/projects">View Our Work</Link><Link className="btn" href="/book" style={{border:"1px solid rgba(243,240,232,.4)",color:"#f3f0e8"}}>Book an Event</Link></div></motion.div></div><div style={{position:"absolute",bottom:32,left:0,right:0,zIndex:3}}><div className="shell" style={{display:"flex",justifyContent:"space-between",fontSize:10,letterSpacing:".16em",textTransform:"uppercase",opacity:.75}}><span>Scroll to explore</span><span>01 / 09</span></div></div></section>
}

"use client";
import Link from "next/link";
import { useState } from "react";
import { site } from "@/data/site";

export default function Header() {
  const [open,setOpen]=useState(false);
  return <header className="site-header">
    <div className="shell header-inner">
      <Link href="/" className="brand" onClick={()=>setOpen(false)}><strong>Phenomenal</strong><span>Shoots</span></Link>
      <nav className={open?"desktop-nav open":"desktop-nav"}>{site.nav.map(item=><Link key={item.href} href={item.href} onClick={()=>setOpen(false)}>{item.label}</Link>)}</nav>
      <div className="header-actions"><Link className="btn btn-light header-book" href="/book">Book an Event</Link><button className="menu-btn" aria-label="Toggle menu" onClick={()=>setOpen(v=>!v)}>{open?"Close":"Menu"}</button></div>
    </div>
  </header>
}

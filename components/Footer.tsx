"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSiteSettings } from "@/lib/publicData";
import type { SiteSettings } from "@/lib/types";

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({});
  useEffect(() => { void getSiteSettings().then(setSettings); }, []);
  // Only render a social link once the studio has actually set one in
  // Website Content — previously these were hardcoded "#" placeholders
  // regardless of what was saved there.
  const socials = [
    settings.instagram ? { label: "Instagram", href: settings.instagram } : null,
    settings.tiktok ? { label: "TikTok", href: settings.tiktok } : null,
    settings.youtube ? { label: "YouTube", href: settings.youtube } : null,
  ].filter((x): x is { label: string; href: string } => x !== null);

  return (
    <footer style={{background:"#211d18",color:"#f3f0e8",padding:"70px 0 24px"}}>
      <div className="shell">
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:40,paddingBottom:70}}>
          <div>
            <div className="eyebrow" style={{color:"#bdb5a8"}}>Let's make something memorable</div>
            <h2 className="display" style={{fontSize:"clamp(38px,6vw,78px)",lineHeight:.95,maxWidth:700,margin:"18px 0"}}>Your moment deserves more than a frame.</h2>
            <Link className="btn btn-light" href="/book">Start a booking</Link>
          </div>
          <div>
            <div className="eyebrow" style={{color:"#bdb5a8"}}>Explore</div>
            <div style={{display:"grid",gap:10,marginTop:18}}>
              <Link href="/projects">Projects</Link>
              <Link href="/stories">Stories</Link>
              <Link href="/services">Services</Link>
              <Link href="/packages">Packages</Link>
            </div>
          </div>
          <div>
            <div className="eyebrow" style={{color:"#bdb5a8"}}>Connect</div>
            <div style={{display:"grid",gap:10,marginTop:18}}>
              <Link href="/contact">Contact</Link>
              {settings.contactEmail && <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>}
              {settings.contactPhone && <a href={`tel:${settings.contactPhone.replace(/\s+/g,"")}`}>{settings.contactPhone}</a>}
              {socials.map(s => <a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label}</a>)}
            </div>
          </div>
        </div>
        <div style={{borderTop:"1px solid rgba(243,240,232,.17)",paddingTop:18,display:"flex",justifyContent:"space-between",fontSize:11,opacity:.65}}>
          <span>© 2026 Phenomenal Shoots</span>
          <span><Link href="/legal">Privacy & Terms</Link> · Photography · Films · Stories</span>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

export default function Footer() {
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
              <a href="#">Instagram</a>
              <a href="#">TikTok</a>
              <a href="#">YouTube</a>
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

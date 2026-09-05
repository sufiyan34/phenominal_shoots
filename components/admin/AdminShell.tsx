"use client";
import AdminGuard from "@/components/AdminGuard";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminShell({children}:{children:React.ReactNode}){
  const pathname=usePathname();
  const {signOutUser}=useAuth();
  if(pathname==="/admin/login") return <>{children}</>;
  const links=[
    ["/admin","Dashboard"],["/admin/projects","Projects"],["/admin/stories","Stories"],["/admin/promotions","Promotions"],
    ["/admin/packages","Packages"],["/admin/services","Services"],["/admin/testimonials","Testimonials"],["/admin/faq","FAQ"],
    ["/admin/bookings","Bookings"],["/admin/availability","Availability"],["/admin/messages","Messages"],["/admin/media","Media Library"],
    ["/admin/content","Website Content"],["/admin/audit","Audit Log"]
  ];
  return <AdminGuard><div style={{minHeight:"100vh",background:"#ebe6dc",color:"#171714"}}><aside style={{position:"fixed",left:0,top:0,bottom:0,width:250,padding:"28px 20px",background:"#211d18",color:"#f3f0e8",overflowY:"auto"}}>
    <Link href="/" style={{display:"grid",lineHeight:1,marginBottom:30}}><strong style={{fontSize:13,letterSpacing:".12em",textTransform:"uppercase"}}>Phenomenal</strong><span style={{fontSize:10,letterSpacing:".2em",textTransform:"uppercase",opacity:.7,marginTop:4}}>Admin Studio</span></Link>
    <nav style={{display:"grid",gap:5}}>{links.map(([href,label])=><Link key={href} href={href} style={{padding:"10px 12px",fontSize:13,borderLeft:pathname===href?"2px solid #9a6748":"2px solid transparent"}}>{label}</Link>)}</nav>
    <div style={{borderTop:"1px solid rgba(243,240,232,.14)",marginTop:18,paddingTop:18}}><Link href="/" style={{display:"block",padding:"8px 12px",fontSize:12,opacity:.7}}>Public site ↗</Link><button onClick={()=>void signOutUser()} style={{background:"transparent",border:0,color:"inherit",padding:"8px 12px",fontSize:12,cursor:"pointer"}}>Sign out</button></div>
  </aside><div style={{marginLeft:250,padding:"32px",maxWidth:1500}}>{children}</div></div></AdminGuard>;
}

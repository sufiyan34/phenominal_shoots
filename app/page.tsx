import Link from "next/link";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import ServiceStrip from "@/components/ServiceStrip";
import ProjectGrid from "@/components/ProjectGrid";
import StoryGrid from "@/components/StoryGrid";
import PackageCards from "@/components/PackageCards";
import PromotionHome from "@/components/PromotionHome";
import TestimonialHome from "@/components/TestimonialHome";

export default function HomePage() {
  return (
    <main>
      <Hero/>
      <ServiceStrip/>
      <PromotionHome/>

      <section className="section">
        <div className="shell">
          <Reveal>
            <div style={{maxWidth:800}}>
              <div className="eyebrow">Our philosophy</div>
              <h2 className="display" style={{fontSize:"clamp(48px,7vw,96px)",lineHeight:.95,margin:"18px 0"}}>
                Some moments are photographed.<br/><i>Others are remembered.</i>
              </h2>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{paddingTop:40}}>
        <div className="shell">
          <Reveal>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",gap:20,marginBottom:30}}>
              <div><div className="eyebrow">Selected work</div><h2 className="display" style={{fontSize:55,margin:"10px 0"}}>Our Projects</h2></div>
              <Link className="eyebrow" href="/projects">View all projects →</Link>
            </div>
          </Reveal>
          <ProjectGrid limit={4}/>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal>
            <div className="grid-12" style={{alignItems:"center"}}>
              <div style={{gridColumn:"span 5"}}>
                <div className="eyebrow">Featured story</div>
                <h2 className="display" style={{fontSize:"clamp(44px,6vw,78px)",lineHeight:.95}}>The art is in the details.</h2>
                <p style={{color:"var(--muted)",lineHeight:1.8}}>From the quiet before an event to the last frame of the night, our stories are built around atmosphere, movement and the people inside the moment.</p>
                <Link className="btn btn-dark" href="/stories">Explore stories</Link>
              </div>
              <div className="media" style={{gridColumn:"span 7",height:560}}>
                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=88" alt="Featured wedding story"/>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <TestimonialHome/>

      <section className="section dark">
        <div className="shell">
          <Reveal>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",marginBottom:32,gap:20}}>
              <div><div className="eyebrow">Choose your experience</div><h2 className="display" style={{fontSize:60,margin:"10px 0"}}>Packages</h2></div>
              <Link className="eyebrow" href="/packages">See all packages →</Link>
            </div>
          </Reveal>
          <PackageCards/>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1.6fr",gap:60,alignItems:"start"}}>
              <div>
                <div className="eyebrow">Stories</div>
                <h2 className="display" style={{fontSize:60,lineHeight:.96}}>Moments.<br/>Thoughts.<br/>Experiences.</h2>
              </div>
              <StoryGrid limit={3}/>
            </div>
          </Reveal>
        </div>
      </section>

      <TestimonialHome/>

      <section className="section dark">
        <div className="shell" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
          <div>
            <div className="eyebrow">About the studio</div>
            <h2 className="display" style={{fontSize:"clamp(44px,6vw,76px)",lineHeight:.95}}>We don't just capture the event. We capture how it felt.</h2>
          </div>
          <div style={{color:"#c9c1b6",lineHeight:1.9}}>
            <p>Phenomenal Shoots is a creative photography and videography studio focused on human stories, cinematic atmosphere and work that still feels meaningful years later.</p>
            <Link className="btn btn-light" href="/about">Meet the photographer</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal>
            <div style={{textAlign:"center",maxWidth:800,margin:"0 auto"}}>
              <div className="eyebrow">Let's create something beautiful</div>
              <h2 className="display" style={{fontSize:"clamp(50px,7vw,96px)",lineHeight:.9,margin:"18px 0 28px"}}>Your story starts here.</h2>
              <Link className="btn btn-dark" href="/book">Book an Event</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

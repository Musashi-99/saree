// A clay diya. `.diya-flame` and `.diya-glow` are left free for GSAP (ignition, flare); their children carry the CSS flicker.
export default function Diya({className=''}:{className?:string}){
 return <div className={`diya ${className}`} aria-hidden="true"><span className="diya-glow"><i/></span><span className="diya-bowl"/><span className="diya-rim"/><span className="diya-wick"/><span className="diya-flame"><span className="diya-fire"><i/></span></span></div>;
}

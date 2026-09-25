import { BadgeCheck, BriefcaseBusiness, Eye, Layers3 } from "lucide-react";

const items = [
  [Eye, "Career readiness", "See a clear starting point"],
  [BadgeCheck, "Evidence-led profiles", "Skills with context, not claims"],
  [Layers3, "Two connected workspaces", "Job seeker + recruiter"],
  [BriefcaseBusiness, "Built for real decisions", "From learning to hiring"],
];
export function TrustStrip() { return <section className="trust-strip"><div className="shell"><div className="trust-lead"><p className="section-kicker">One platform. One continuous journey.</p><p>Demo experience · illustrative product values</p></div><div className="trust-items">{items.map(([Icon, title, text]) => { const I = Icon as typeof Eye; return <div key={title as string}><I /><span><b>{title as string}</b><small>{text as string}</small></span></div>; })}</div></div></section>; }

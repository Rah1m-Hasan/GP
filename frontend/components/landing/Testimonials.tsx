import { Quote } from "lucide-react";
const quotes = [
  ["I know exactly which skills are blocking me from my target role — and what to do about them.", "Product scenario", "Career transition"],
  ["Instead of another pile of resumes, I can see the evidence behind each application.", "Product scenario", "Hiring workflow"],
  ["The next step feels smaller and more concrete when learning, proof, and jobs are connected.", "Example user experience", "Early-career professional"],
];
export function Testimonials() { return <section className="section testimonial-section"><div className="shell"><div className="section-heading"><p className="section-kicker">Clarity changes the experience</p><h2>Built around useful progress, not empty activity.</h2></div><div className="testimonial-grid">{quotes.map(([quote, label, type], i) => <article key={quote}><Quote size={22} /><blockquote>“{quote}”</blockquote><div><span className={`quote-avatar avatar-${i}`}>{i === 0 ? "CP" : i === 1 ? "HW" : "EP"}</span><p><b>{label}</b><small>{type}</small></p></div></article>)}</div></div></section>; }

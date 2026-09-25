import { Award, BookOpen, BriefcaseBusiness, ChartNoAxesCombined, CircleCheckBig, Code2, MessageSquareText, SearchCheck } from "lucide-react";

const steps = [
  [ChartNoAxesCombined, "Assess", "Understand your current capabilities."],
  [SearchCheck, "Identify gaps", "See what separates you from a target role."],
  [BookOpen, "Learn", "Follow a focused, personalized roadmap."],
  [Code2, "Practice", "Build practical skill confidence."],
  [Award, "Prove", "Verify progress through assessments."],
  [BriefcaseBusiness, "Apply", "Target roles where your evidence matters."],
  [MessageSquareText, "Interview", "Practice, reflect, and improve."],
  [CircleCheckBig, "Grow", "Keep building your career over time."],
];
export function WorkflowSection() { return <section className="section workflow-section" id="about"><div className="shell"><div className="section-heading centered"><p className="section-kicker">The Skillbridge workflow</p><h2>From capability to career momentum.</h2><p>A connected path that turns an uncertain next step into useful, visible progress.</p></div><div className="workflow-path">{steps.map(([Icon, title, copy], index) => { const I = Icon as typeof Award; return <article className="workflow-step" key={title as string}><span className="workflow-index">0{index + 1}</span><span className="workflow-icon"><I size={19} /></span><h3>{title as string}</h3><p>{copy as string}</p></article>; })}</div></div></section>; }

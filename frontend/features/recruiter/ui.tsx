import Link from "next/link";
import type { Candidate } from "./data";

export function RecruiterMetric({ label, value, note }: { label: string; value: string | number; note: string }) {
  return <div className="card p-5"><p className="text-sm muted">{label}</p><b className="mt-3 block text-3xl">{value}</b><p className="mt-2 text-xs text-brand">{note}</p></div>;
}

export function StageBadge({ stage }: { stage: string }) {
  const color = stage === "Rejected" ? "bg-destructive-surface text-destructive" : stage === "Offer" || stage === "Hired" ? "bg-mint text-brand" : "bg-muted text-muted-foreground";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${color}`}>{stage}</span>;
}

export function CandidateCard({ candidate, compact = false }: { candidate: Candidate; compact?: boolean }) {
  return <Link href={`/recruiter/candidates/${candidate.id}`} className="card block p-4 transition hover:border-brand hover:shadow-lift"><div className="flex items-start justify-between gap-2"><div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#d9c2e8] text-xs font-bold">{candidate.initials}</span><span><b className="block text-sm">{candidate.name}</b><small className="muted">{candidate.role} · {candidate.experience}</small></span></div><b className="text-brand">{candidate.match}%</b></div>{!compact && <><div className="mt-3 flex flex-wrap gap-1">{candidate.skills.slice(0, 3).map(skill => <span key={skill.name} className="rounded bg-muted px-2 py-1 text-[11px] text-foreground">{skill.name} {skill.score}%</span>)}</div><div className="mt-3 flex items-center justify-between"><StageBadge stage={candidate.stage} /><span className="text-xs muted">Applied {candidate.applied}</span></div></>}</Link>;
}

export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">{eyebrow}</p><h1 className="mt-2 text-3xl font-bold">{title}</h1><p className="mt-2 muted">{description}</p></div>{action}</div>;
}

export function Empty({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return <div className="card p-10 text-center"><h2 className="font-bold">{title}</h2><p className="mt-2 text-sm muted">{description}</p>{action && <div className="mt-5">{action}</div>}</div>;
}

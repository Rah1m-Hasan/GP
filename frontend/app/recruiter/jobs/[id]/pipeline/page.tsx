"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { api, ApiError, Candidate } from "@/lib/api";

const stages = ["Applied", "AI Screening", "Recruiter Review", "Assessment", "Assessment Review", "Interview", "Final Review", "Offer", "Hired", "Rejected"];

export default function Pipeline() {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);
  const [people, setPeople] = useState<Candidate[]>([]);
  const [active, setActive] = useState(stages[0]);
  const [error, setError] = useState("");
  const load = useCallback(() => api.recruiter.pipeline(jobId).then(result => { setPeople(result.candidates); setError(""); }).catch((reason: ApiError) => setError(reason.message)), [jobId]);
  useEffect(() => { if (Number.isInteger(jobId)) void load(); else setError("This job does not exist."); }, [jobId, load]);
  const move = async (candidate: Candidate, stage: string) => {
    const before = people;
    setPeople(items => items.map(item => item.id === candidate.id ? { ...item, stage } : item));
    try { await api.recruiter.moveCandidate(candidate.id, stage); }
    catch (reason) { setPeople(before); setError(reason instanceof ApiError ? reason.message : "Could not update candidate stage."); }
  };
  const card = (candidate: Candidate) => <article key={candidate.id} className="card p-4"><div className="flex justify-between gap-2"><Link href={`/recruiter/candidates/${candidate.id}`} className="font-bold hover:text-brand">{candidate.name}</Link><b className="text-brand">{candidate.match}%</b></div><p className="mt-1 text-sm muted">{candidate.role} · {candidate.experience}</p><div className="mt-3 flex flex-wrap gap-1">{candidate.skills.slice(0, 3).map(skill => <span key={skill.name} className="rounded bg-muted px-2 py-1 text-[11px] text-foreground">{skill.name} {skill.score}%</span>)}</div><select aria-label={`Move ${candidate.name}`} value={candidate.stage} onChange={event => void move(candidate, event.target.value)} className="mt-3 w-full rounded-lg border border-input bg-card p-2 text-xs text-foreground">{stages.map(stage => <option key={stage}>{stage}</option>)}</select></article>;

  return <><p className="eyebrow">Recruitment pipeline</p><h1 className="mt-2 text-3xl font-bold">Candidate movement stays in recruiter control.</h1><p className="mt-2 muted">Changes are persisted to the recruiter API. AI cannot advance or reject candidates.</p>{error && <div className="mt-5 rounded-xl bg-destructive-surface p-4 text-sm text-destructive">{error} <button onClick={() => void load()} className="ml-2 font-bold underline">Retry</button></div>}<div className="mt-6 lg:hidden"><select value={active} onChange={event => setActive(event.target.value)} className="w-full rounded-xl border border-input bg-card p-3 text-foreground">{stages.map(stage => <option key={stage}>{stage}</option>)}</select><div className="mt-4 space-y-3">{people.filter(candidate => candidate.stage === active).map(card)}</div></div><div className="mt-6 hidden gap-3 overflow-x-auto pb-3 lg:flex">{stages.map(stage => <section key={stage} className="w-[260px] shrink-0 rounded-2xl border border-border bg-muted p-3 text-foreground"><div className="mb-3 flex justify-between"><b className="text-sm">{stage}</b><span className="text-xs text-muted-foreground">{people.filter(candidate => candidate.stage === stage).length}</span></div><div className="space-y-3">{people.filter(candidate => candidate.stage === stage).map(card)}{!people.some(candidate => candidate.stage === stage) && <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">No candidates in this stage.</p>}</div></section>)}</div></>;
}

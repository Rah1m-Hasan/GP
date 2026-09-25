"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, GitBranch, Pause, Play, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { ApiError, api, RecruiterJob } from "@/lib/api";

export default function RecruiterJobDetail() {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);
  const [job, setJob] = useState<RecruiterJob>();
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!Number.isInteger(jobId)) { setError("This job does not exist."); return; }
    api.recruiter.job(jobId).then(setJob).catch((reason: ApiError) => setError(reason.message));
  }, [jobId]);

  const setStatus = async (status: "Active" | "Paused") => {
    if (!job) return;
    setUpdating(true); setError("");
    try { setJob(await api.recruiter.setJobStatus(job.id, status)); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Could not update this job."); }
    finally { setUpdating(false); }
  };

  if (!job) return <div className="card p-6"><b>{error ? "Unable to load job." : "Loading job…"}</b>{error && <p className="mt-2 muted">{error}</p>}<Link href="/recruiter/jobs" className="btn btn-secondary mt-4">Back to jobs</Link></div>;
  const canPause = job.status === "Active";
  return <>
    <Link href="/recruiter/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-brand"><ArrowLeft size={16} />Back to jobs</Link>
    <div className="mt-6 flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">Job management</p><h1 className="mt-2 text-3xl font-bold">{job.title}</h1><p className="mt-2 muted">{job.department || "Unassigned department"} · {job.location || "Location not specified"} · {job.work_mode}</p></div><div className="flex gap-2"><Link href={`/recruiter/jobs/${job.id}/pipeline`} className="btn btn-secondary"><GitBranch size={16} />Pipeline</Link>{canPause ? <button disabled={updating} onClick={() => void setStatus("Paused")} className="btn btn-secondary"><Pause size={16} />Pause job</button> : <button disabled={updating} onClick={() => void setStatus("Active")} className="btn btn-primary"><Play size={16} />Publish job</button>}</div></div>
    {error && <p className="mt-4 rounded-xl bg-[#fbebeb] p-3 text-sm text-[#a24747]">{error}</p>}
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Applications", job.applications], ["Qualified", job.qualified], ["Assessments", job.assessments], ["Interviews", job.interviews]].map(([label, value]) => <div className="card p-5" key={label as string}><p className="text-sm muted">{label as string}</p><b className="mt-2 block text-3xl text-brand">{value as number}</b></div>)}</div>
    <div className="mt-7 grid gap-6 xl:grid-cols-[1.25fr_.75fr]"><section className="card p-6"><h2 className="font-bold">Role description</h2><p className="mt-3 whitespace-pre-wrap leading-7 muted">{job.description || "No role description has been added."}</p><h2 className="mt-7 font-bold">Skill requirements</h2><div className="mt-4 space-y-3">{job.requirements.map(requirement => <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line p-4" key={requirement.name}><div><b className="text-sm">{requirement.name}</b><p className="mt-1 text-xs muted">{requirement.is_required ? "Required" : "Preferred"} · {requirement.priority} priority</p></div><b className="text-brand">{requirement.required_level}%</b></div>)}</div></section><aside className="card p-6"><Users className="text-brand" size={22} /><h2 className="mt-4 font-bold">Review candidate evidence</h2><p className="mt-2 text-sm leading-6 muted">Candidate match is calculated deterministically from shared job-relevant evidence. Final decisions remain human-controlled.</p><Link href={`/recruiter/jobs/${job.id}/pipeline`} className="btn btn-primary mt-5 w-full">Open pipeline</Link></aside></div>
  </>;
}

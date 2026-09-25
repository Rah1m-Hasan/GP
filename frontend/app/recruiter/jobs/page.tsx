"use client";

import Link from "next/link";
import { Pause, Play, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ApiError, api, RecruiterJob } from "@/lib/api";
import { PageHeading } from "@/features/recruiter/ui";

const statuses = ["All", "Draft", "Active", "Paused", "Closed"] as const;

export default function RecruiterJobs() {
  const [tab, setTab] = useState<(typeof statuses)[number]>("All");
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.recruiter.jobs().then(items => { setJobs(items); setError(""); }).catch((reason: ApiError) => setError(reason.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);
  const visible = useMemo(() => jobs.filter(job => (tab === "All" || job.status === tab) && `${job.title} ${job.department}`.toLowerCase().includes(query.toLowerCase())), [jobs, query, tab]);
  const setStatus = async (job: RecruiterJob, status: "Active" | "Paused") => {
    try { const changed = await api.recruiter.setJobStatus(job.id, status); setJobs(items => items.map(item => item.id === changed.id ? changed : item)); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Could not update this job."); }
  };

  return <>
    <PageHeading eyebrow="Job management" title="Jobs" description="Create structured roles and keep your hiring team aligned." action={<Link href="/recruiter/jobs/new" className="btn btn-primary"><Plus size={16} />Create job</Link>} />
    <div className="mt-7 flex flex-wrap gap-3"><label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-line bg-card px-3"><Search size={16} className="muted" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search jobs" className="w-full py-3 outline-none" /></label><div className="flex flex-wrap rounded-xl border border-line bg-card p-1">{statuses.map(status => <button onClick={() => setTab(status)} key={status} className={`rounded-lg px-3 py-2 text-sm font-bold ${tab === status ? "bg-mint text-brand" : "muted"}`}>{status}</button>)}</div></div>
    {error ? <div className="card mt-5 p-5"><b>Unable to load jobs.</b><p className="mt-2 text-sm muted">{error}</p><button onClick={load} className="btn btn-secondary mt-4">Retry</button></div> : <div className="card mt-5 overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-muted text-xs uppercase tracking-wide muted"><tr><th className="p-4">Job</th><th>Location</th><th>Status</th><th>Applications</th><th>Qualified</th><th>Assessments</th><th>Interviews</th><th className="p-4">Actions</th></tr></thead><tbody>{loading ? <tr><td colSpan={8} className="p-8 text-center muted">Loading jobs…</td></tr> : visible.map(job => <tr className="border-t border-line" key={job.id}><td className="p-4"><Link href={`/recruiter/jobs/${job.id}`} className="font-bold hover:text-brand">{job.title}</Link><span className="mt-1 block text-xs muted">{job.department || "No department"} · {job.employment_type}</span></td><td>{job.location || "—"}</td><td><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${job.status === "Active" ? "bg-mint text-brand" : "bg-muted text-muted-foreground"}`}>{job.status}</span></td><td>{job.applications}</td><td>{job.qualified}</td><td>{job.assessments}</td><td>{job.interviews}</td><td className="p-4"><div className="flex gap-2"><Link href={`/recruiter/jobs/${job.id}`} className="text-xs font-bold text-brand">View</Link>{job.status === "Active" ? <button onClick={() => void setStatus(job, "Paused")} aria-label={`Pause ${job.title}`} className="muted"><Pause size={15} /></button> : <button onClick={() => void setStatus(job, "Active")} aria-label={`Publish ${job.title}`} className="muted"><Play size={15} /></button>}</div></td></tr>)}{!loading && !visible.length && <tr><td colSpan={8} className="p-8 text-center muted">No jobs match these filters.</td></tr>}</tbody></table></div>}
  </>;
}

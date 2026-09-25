"use client";

import Link from "next/link";
import { Award } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Metric, SectionTitle, SkillBar } from "@/components/dashboard-ui";
import { api, ApiError, DashboardSummary, Job } from "@/lib/api";
import { skills } from "@/lib/demo-data";

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary>();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setError("");
    try {
      const [nextSummary, nextJobs] = await Promise.all([api.dashboard(), api.listJobs()]);
      setSummary(nextSummary);
      setJobs(nextJobs);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "Could not load your dashboard.");
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const readiness = summary?.readiness;
  return <>
    <p className="eyebrow">Career workspace</p>
    <h1 className="mt-2 text-3xl font-bold">Good morning, {summary?.user?.split(" ")[0] ?? "there"}</h1>
    <p className="mt-2 muted">Here&apos;s how you&apos;re progressing toward becoming a {summary?.target_role ?? "Backend Developer"}.</p>
    {error && <div className="mt-5 rounded-xl bg-[#fbebeb] p-4 text-sm text-[#a24747]">{error} <button onClick={() => void load()} className="ml-2 font-bold underline">Retry</button></div>}
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="Career Readiness" value={readiness === undefined ? "—" : `${readiness}%`} note="Deterministic backend score" />
      <Metric label="Verified Skills" value={summary?.verified_skills?.toString() ?? "—"} note="Evidence-backed skills" />
      <Metric label="Active Learning Paths" value={summary?.active_learning_paths?.toString() ?? "—"} note="1 module due today" />
      <Metric label="Job Matches" value={summary?.job_matches?.toString() ?? "—"} note="Backend-calculated matches" />
    </div>
    <div className="mt-7 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
      <section className="card p-6"><SectionTitle title="Your readiness" /><div className="grid gap-6 md:grid-cols-[180px_1fr] md:items-center"><div className="mx-auto grid h-40 w-40 place-items-center rounded-full border-[14px] border-brand text-center"><div><b className="text-4xl">{readiness === undefined ? "—" : `${readiness}%`}</b><p className="text-xs muted">Job Ready</p></div></div><div>{skills.slice(0, 6).map(skill => <SkillBar key={skill.name} {...skill} verified={skill.source === "Assessment Verified"} />)}</div></div></section>
      <section className="card p-6"><SectionTitle title="Next best actions" /><div className="space-y-4">{[["Complete Docker Fundamentals", "30 min lesson", "/dashboard/learning"], ["Take SQL assessment", "15 questions", "/dashboard/assessments"], ["Practice Backend Mock Interview", "20 min", "/dashboard/interview"], ["Review recommended jobs", "Backend-calculated match", "/dashboard/jobs"]].map(([action, note, href], index) => <Link key={action} href={href} className="flex gap-3 rounded-xl p-2 hover:bg-muted"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-mint text-xs font-bold text-brand">{index + 1}</span><span><b className="block text-sm">{action}</b><small className="muted">{note}</small></span></Link>)}</div></section>
    </div>
    <div className="mt-7 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
      <section><SectionTitle title="Recommended for you" />{!jobs.length && !error ? <div className="card p-5 text-sm muted">Loading recommended jobs…</div> : <div className="grid gap-3">{jobs.slice(0, 2).map(job => <Link href={`/dashboard/jobs/${job.id}`} key={job.id} className="card flex flex-wrap items-center justify-between gap-4 p-5 hover:border-brand"><div><h3 className="font-bold">{job.title}</h3><p className="mt-1 text-sm muted">{job.company} · {job.location}</p><div className="mt-3 flex flex-wrap gap-1">{job.skills.slice(0, 4).map(skill => <span key={skill} className="rounded bg-[#f2f6f5] px-2 py-1 text-xs">{skill}</span>)}</div></div><div className="text-right"><b className="text-xl text-brand">{job.match}%</b><p className="text-xs muted">Job match</p></div></Link>)}</div>}</section>
      <section className="card p-6"><SectionTitle title="Recent achievements" /><div className="space-y-4">{[["SQL Verified", "84% assessment result"], ["FastAPI module", "Learning milestone"], ["First application", "Nova Systems"]].map(([title, note]) => <div key={title} className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-mint"><Award size={17} className="text-brand" /></span><span><b className="block text-sm">{title}</b><small className="muted">{note}</small></span></div>)}</div></section>
    </div>
  </>;
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError, Application, ApplicationStage } from "@/lib/api";

const stages: ApplicationStage[] = ["Saved", "Applied", "Assessment", "Interview", "Offer", "Rejected"];

export default function Applications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [error, setError] = useState("");
  const load = useCallback(() => api.listApplications().then(setApps).catch((reason: ApiError) => setError(reason.message)), []);
  useEffect(() => { load(); }, [load]);
  const move = async (application: Application, stage: ApplicationStage) => {
    const previous = apps;
    setApps(items => items.map(item => item.id === application.id ? { ...item, stage } : item));
    try { await api.updateApplication(application.id, application.job_id, stage); }
    catch (reason) { setApps(previous); setError(reason instanceof ApiError ? reason.message : "Could not update this application."); }
  };

  return <><p className="eyebrow">Application tracker</p><h1 className="mt-2 text-3xl font-bold">Keep each opportunity moving.</h1><p className="mt-2 muted">Update a stage manually as you hear back.</p>{error && <div className="mt-5 rounded-xl bg-destructive-surface p-4 text-sm text-destructive">{error} <button onClick={load} className="ml-2 font-bold underline">Retry</button></div>}<div className="mt-7 grid gap-4 xl:grid-cols-3">{stages.map(stage => <section key={stage} className="min-w-0 rounded-2xl border border-border bg-kanban p-3 text-foreground"><div className="mb-3 flex justify-between px-1"><b className="text-sm">{stage}</b><span className="text-xs text-muted-foreground">{apps.filter(app => app.stage === stage).length}</span></div><div className="space-y-3">{apps.filter(app => app.stage === stage).map(app => <article key={app.id} className="card p-4"><p className="font-bold">{app.job ?? `Job #${app.job_id}`}</p><p className="mt-1 text-sm muted">{app.company ?? "Skillbridge opportunity"}</p><p className="mt-3 text-sm text-brand">{app.match_score}% match</p><select value={app.stage} onChange={event => move(app, event.target.value as ApplicationStage)} className="mt-4 w-full rounded-lg border border-input bg-card p-2 text-xs text-foreground">{stages.map(option => <option key={option}>{option}</option>)}</select></article>)}</div></section>)}</div></>;
}

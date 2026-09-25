"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { ApiError, api } from "@/lib/api";

type Requirement = { name: string; required_level: number; is_required: boolean; priority: "Low" | "Medium" | "High" };

export default function NewJob() {
  const router = useRouter();
  const [requirements, setRequirements] = useState<Requirement[]>([{ name: "Python", required_level: 70, is_required: true, priority: "High" }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const updateRequirement = (index: number, patch: Partial<Requirement>) => setRequirements(items => items.map((item, position) => position === index ? { ...item, ...patch } : item));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const experienceMin = Number(form.get("experience_min") ?? 0);
    const experienceMax = Number(form.get("experience_max") ?? 3);
    if (!title || !requirements.length || requirements.some(requirement => !requirement.name.trim())) { setError("Enter a job title and at least one named skill requirement."); return; }
    if (!Number.isFinite(experienceMin) || !Number.isFinite(experienceMax) || experienceMin < 0 || experienceMax < experienceMin) { setError("Set a valid experience range."); return; }
    setSaving(true); setError("");
    try {
      const created = await api.recruiter.createJob({
        title, department: String(form.get("department") ?? ""), location: String(form.get("location") ?? ""),
        work_mode: String(form.get("work_mode") ?? "Remote"), employment_type: String(form.get("employment_type") ?? "Full-time"),
        experience_min: experienceMin, experience_max: experienceMax, salary: String(form.get("salary") ?? ""),
        description: String(form.get("description") ?? ""), responsibilities: [], assessment_mode: "None",
        requirements: requirements.map(requirement => ({ ...requirement, name: requirement.name.trim() })),
      });
      await api.recruiter.publishJob(created.id);
      router.push(`/recruiter/jobs/${created.id}`);
    } catch (reason) { setError(reason instanceof ApiError ? reason.message : "Could not create this job."); }
    finally { setSaving(false); }
  };

  return <form onSubmit={submit}><p className="eyebrow">Create job</p><h1 className="mt-2 text-3xl font-bold">Build a role with clear evidence requirements.</h1><p className="mt-2 muted">Publishing is a recruiter action. AI never silently changes your criteria.</p>
    <section className="card mt-7 max-w-4xl p-6"><div className="grid gap-4 sm:grid-cols-2">
      <Label label="Job title"><input name="title" required defaultValue="Backend Developer" className="field" /></Label><Label label="Department"><input name="department" defaultValue="Engineering" className="field" /></Label>
      <Label label="Location"><input name="location" defaultValue="Remote · Bangladesh" className="field" /></Label><Label label="Salary range"><input name="salary" defaultValue="৳80,000–120,000 / month" className="field" /></Label>
      <Label label="Work mode"><select name="work_mode" className="field"><option>Remote</option><option>Hybrid</option><option>On-site</option></select></Label><Label label="Employment type"><select name="employment_type" className="field"><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option></select></Label>
      <Label label="Minimum experience"><input name="experience_min" type="number" min="0" max="50" defaultValue="1" className="field" /></Label><Label label="Maximum experience"><input name="experience_max" type="number" min="0" max="50" defaultValue="3" className="field" /></Label>
    </div><Label label="Description" className="mt-4"><textarea name="description" defaultValue="Build reliable APIs and data services that power financial workflows." className="field min-h-28" /></Label>
      <h2 className="mt-7 font-bold">Skill requirements</h2><div className="mt-3 space-y-2">{requirements.map((requirement, index) => <div key={index} className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-[1.5fr_.7fr_.9fr_.8fr_auto]">
        <input value={requirement.name} aria-label="Skill name" onChange={event => updateRequirement(index, { name: event.target.value })} className="rounded-lg border border-line px-2 py-2 text-sm" />
        <input type="number" min="0" max="100" value={requirement.required_level} aria-label="Required level" onChange={event => updateRequirement(index, { required_level: Number(event.target.value) })} className="rounded-lg border border-line px-2 py-2 text-sm" />
        <select value={requirement.is_required ? "Required" : "Preferred"} aria-label="Requirement type" onChange={event => updateRequirement(index, { is_required: event.target.value === "Required" })} className="rounded-lg border border-line px-2 py-2 text-sm"><option>Required</option><option>Preferred</option></select>
        <select value={requirement.priority} aria-label="Requirement priority" onChange={event => updateRequirement(index, { priority: event.target.value as Requirement["priority"] })} className="rounded-lg border border-line px-2 py-2 text-sm"><option>High</option><option>Medium</option><option>Low</option></select>
        <button type="button" disabled={requirements.length === 1} aria-label="Remove skill" onClick={() => setRequirements(items => items.filter((_, position) => position !== index))} className="p-2 muted"><Trash2 size={16} /></button>
      </div>)}</div><button type="button" onClick={() => setRequirements(items => [...items, { name: "", required_level: 50, is_required: false, priority: "Medium" }])} className="btn btn-secondary mt-4 text-sm"><Plus size={15} />Add skill</button>
      {error && <p className="mt-4 rounded-xl bg-[#fbebeb] p-3 text-sm text-[#a24747]">{error}</p>}<button disabled={saving} className="btn btn-primary mt-7"><ArrowRight size={16} />{saving ? "Publishing…" : "Create and publish job"}</button>
    </section></form>;
}

function Label({ label, className = "", children }: { label: string; className?: string; children: React.ReactNode }) { return <label className={`block text-sm font-bold ${className}`}>{label}<span className="mt-2 block">{children}</span></label>; }

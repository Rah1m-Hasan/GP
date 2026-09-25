export type Job = { id: number; slug: string; title: string; company: string; location: string; match: number; skills: string[] };
export type JobMatch = { score: number; strong: string[]; partial: string[]; missing: string[]; explanation: string };
export type ApplicationStage = "Saved" | "Applied" | "Assessment" | "Interview" | "Offer" | "Rejected";
export type Application = { id: number; job_id: number; job?: string; company?: string; stage: ApplicationStage; match_score: number };
export type ResumeUpload = { filename: string; text_preview: string; message: string };
export type AdvisorReply = { conversation_id: number; title: string; message: string; recommendations: string[]; ai_estimated: boolean };
export type Candidate = { id: number; name: string; initials: string; role: string; location: string; experience: string; education?: string; job_id: number; stage: string; match: number; assessment: number | null; interview: number | null; applied: string; skills: { name: string; score: number; source: string }[]; projects: string[]; notes: { id: number; author: string; created: string; body: string }[] };
export type RecruiterJob = { id: number; title: string; department: string; location: string; work_mode: string; employment_type: string; status: string; applications: number; qualified: number; assessments: number; interviews: number; created: string; description: string; requirements: { name: string; required_level: number; is_required: boolean; priority: string }[] };
export type Pipeline = { stages: string[]; candidates: Candidate[] };
export type DashboardSummary = { user: string; target_role: string; readiness: number; verified_skills: number; active_learning_paths: number; job_matches: number };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
export class ApiError extends Error { constructor(message: string, public readonly status: number) { super(message); } }

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try { response = await fetch(`${API_URL}${path}`, { ...init, headers: { ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }), "X-Company-ID": "1", ...init.headers } }); }
  catch { throw new ApiError("Unable to reach Skillbridge. Check that the API is running.", 0); }
  const body = await response.json().catch(() => null) as { detail?: string | { msg?: string }[] } | T | null;
  if (!response.ok) {
    const detail = typeof body === "object" && body && "detail" in body ? body.detail : undefined;
    const message = typeof detail === "string" ? detail : Array.isArray(detail) ? detail[0]?.msg : undefined;
    throw new ApiError(message || "Request failed. Please try again.", response.status);
  }
  return body as T;
}

export const api = {
  dashboard: () => request<DashboardSummary>("/api/dashboard"),
  listJobs: (q = "") => request<Job[]>(`/api/jobs${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  getJob: (id: number) => request<Job>(`/api/jobs/${id}`),
  getJobMatch: (id: number) => request<JobMatch>(`/api/jobs/${id}/match`),
  listApplications: () => request<Application[]>("/api/applications"),
  createApplication: (job_id: number, stage: ApplicationStage = "Saved") => request<Application>("/api/applications", { method: "POST", body: JSON.stringify({ job_id, stage }) }),
  updateApplication: (id: number, job_id: number, stage: ApplicationStage) => request<Application>(`/api/applications/${id}`, { method: "PUT", body: JSON.stringify({ job_id, stage }) }),
  uploadResume: async (file: File) => { const form = new FormData(); form.append("file", file); return request<ResumeUpload>("/api/resume/upload", { method: "POST", body: form }); },
  advisor: (message: string) => request<AdvisorReply>("/api/advisor/chat", { method: "POST", body: JSON.stringify({ message }) }),
  recruiter: {
    dashboard: () => request<{ metrics: Record<string, number>; pipeline: Record<string, number>; pending_actions: string[]; recent_applications: Candidate[] }>("/api/recruiter/dashboard"),
    jobs: () => request<RecruiterJob[]>("/api/recruiter/jobs"),
    job: (id: number) => request<RecruiterJob>(`/api/recruiter/jobs/${id}`),
    pipeline: (id: number) => request<Pipeline>(`/api/recruiter/jobs/${id}/pipeline`),
    createJob: (payload: Record<string, unknown>) => request<RecruiterJob>("/api/recruiter/jobs", { method: "POST", body: JSON.stringify(payload) }),
    publishJob: (id: number) => request<RecruiterJob>(`/api/recruiter/jobs/${id}/publish`, { method: "POST" }),
    setJobStatus: (id: number, status: "Draft" | "Active" | "Paused" | "Closed") => request<RecruiterJob>(`/api/recruiter/jobs/${id}/status`, { method: "POST", body: JSON.stringify({ status }) }),
    candidates: (query = "") => request<Candidate[]>(`/api/recruiter/candidates${query ? `?${query}` : ""}`),
    candidate: (id: number) => request<Candidate & { job: RecruiterJob; match_explanation: JobMatch }>(`/api/recruiter/candidates/${id}`),
    moveCandidate: (id: number, stage: string) => request<Candidate>(`/api/recruiter/candidates/${id}/stage`, { method: "POST", body: JSON.stringify({ stage }) }),
    addNote: (id: number, body: string) => request<Candidate["notes"][number]>(`/api/recruiter/candidates/${id}/notes`, { method: "POST", body: JSON.stringify({ body }) }),
  },
};

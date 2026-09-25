# SKILLBRIDGE AI

The AI-Powered Bridge Between Education and Employment. This monorepo provides a polished, job-seeker-first MVP: assess skills, identify evidence gaps, learn from validated resources, prove capability, target suitable jobs, apply, and practice interviews.

For exact local startup instructions, use [RUN_LOCAL.md](RUN_LOCAL.md).

## Stack

- `frontend/`: Next.js 14, React, TypeScript strict mode, Tailwind, Framer Motion, Lucide.
- `backend/`: FastAPI, Pydantic v2, SQLAlchemy 2, SQLite development fallback, PostgreSQL-ready Docker configuration.
- AI: provider abstraction selecting Groq when configured, with a safe mock fallback.

## Run locally

Copy `.env.example` to `.env`, then:

```bash
cd frontend && npm install && npm run dev
cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open `http://localhost:3000`. The API docs are at `http://localhost:8000/docs`.

## Environment

`DATABASE_URL`, `SECRET_KEY`, `GROQ_API_KEY`, `GROQ_MODEL`, `NEXT_PUBLIC_API_URL`, and `MAX_UPLOAD_MB` are described in `.env.example`. Never expose a Groq key to the browser.

## Demo account

Use `alex@skillbridge.demo` with any demo password on the sign-in screen. The core demo is Alex Morgan, a Backend Developer candidate with 68% readiness. Open Nova Systems, generate an improvement roadmap, complete an assessment, then save the application.

## API surface

- `GET /health`
- `GET /api/dashboard`
- `GET /api/jobs`, `GET /api/jobs/{id}`, `GET /api/jobs/{id}/match`
- `POST /api/resume/upload`
- `POST /api/advisor/chat`
- `GET/POST /api/applications`, `PUT /api/applications/{id}`
- Recruiter: `/api/recruiter/dashboard`, `/company`, `/jobs`, `/candidates`, `/assessments`, `/interviews`, `/comparisons`, `/analytics`, `/notifications`, `/activity`, and `/assistant/chat`.

## Recruiter workspace

The recruiter experience lives under `/recruiter`. Use the demo recruiter identity **Sarah Johnson** (`sarah@novasystems.demo`), Senior Technical Recruiter at Nova Systems. It provides onboarding, company configuration, jobs, editable skill requirements, pipeline controls, candidate evidence profiles, recruiter notes, assessment drafts, interview reports, comparisons, analytics, and offer drafts.

Recruiter AI is strictly decision support: it summarizes job-relevant evidence and suggests review questions. It cannot select, reject, rank for final hire, move a candidate, or send an offer without explicit recruiter action.

Run the local idempotent demo seed after installing backend requirements:

```bash
cd backend
python -m app.seed
```

## Important safeguards

Readiness and job matching are deterministic backend calculations. AI cannot verify a skill, invent a job, fabricate resume history, apply on a user’s behalf, or change scores. Resume binary data is parsed locally; only sanitized extracted text is eligible for AI analysis.

## Known MVP limitations

Frontend journey persistence currently uses local browser state for interactive demo actions while API contracts are available for migration. Full Alembic migrations, JWT routes, real code-sandbox execution, and live job integrations are planned extension points. Recruiter pages are deliberately limited to a coming-soon experience.

## Recruiter integration points

Reserved routes: `/recruiter/dashboard`, `/recruiter/jobs`, `/recruiter/candidates`, `/recruiter/assessments`, `/recruiter/interviews`. Backend models distinguish user roles and can grow into a recruiter workspace without changing job-seeker routes.

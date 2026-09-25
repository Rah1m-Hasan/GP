# Skillbridge AI — Project Handoff

## Current milestone

Initial functional job-seeker MVP scaffold is in place: premium Next.js UI, FastAPI API foundation, deterministic readiness/matching services, AI provider abstraction, and SQLite local fallback.

## Continue from here

1. Install frontend/backend dependencies and resolve build/test feedback.
2. Replace demo-local frontend state with API-client calls incrementally (dashboard, jobs, applications are first priorities).
3. Add Alembic environment and seed command for the complete data model.
4. Add JWT auth dependency/router and protect profile-changing endpoints.
5. Expand all requested relational models (resume, assessments, learning, interview, conversations, notifications) from the architecture list.

## Key implementation decisions

- Scores are always calculated by `backend/app/services/scoring.py`; the LLM only explains or recommends.
- Groq is chosen when `GROQ_API_KEY` exists; `MockProvider` gives a safe usable fallback otherwise.
- Resume parsing extracts text locally and only cleaned text may be sent to an AI provider.
- Recruiter routing is reserved under `/recruiter/*`; the workspace is intentionally not implemented.
- Demo identity: Alex Morgan, Backend Developer, 68% readiness. The Nova Systems role is the central demo flow.

## Git status

Repository initialized and first milestone committed: `b0a03cb feat: scaffold Skillbridge AI job seeker MVP`. No remote origin was supplied, so a GitHub push cannot happen until one is configured.

## Verification (2026-09-25)

- `frontend`: `npx tsc --noEmit` and `npm run build` both pass; 18 routes compile successfully.
- `backend`: Python syntax compilation passes (`python3 -m compileall -q app`). Dependency retrieval was started but did not complete in this environment, so `pytest` and a live FastAPI startup check remain outstanding.

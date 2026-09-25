# Skillbridge AI — Project Handoff

## Current milestone

Recruiter workspace extension is now implemented alongside the existing job-seeker MVP: recruiter routes, Nova Systems/Sarah Johnson demo data, evidence-first candidate workflows, recruiter API surface, persistent seed records, and recruiter domain models.

## Continue from here

1. Add Alembic environment/revisions for the new recruiter-domain tables; SQLite `create_all` remains the local fallback.
2. Add JWT/Supabase session integration and replace the current `X-Company-ID` demonstration boundary with server-side company membership validation.
3. Move the remaining demo presentation screens (profile, learning, assessments, interviews, comparisons, analytics, and settings) to the API client as their persistence endpoints mature.
4. Expand assessment question/answer persistence and connect an isolated code runner provider.

## Key implementation decisions

- Scores are always calculated by `backend/app/services/scoring.py`; the LLM only explains or recommends.
- Groq is chosen when `GROQ_API_KEY` exists; `MockProvider` gives a safe usable fallback otherwise.
- Resume parsing extracts text locally and only cleaned text may be sent to an AI provider.
- Recruiter routing is implemented under `/recruiter/*`; recruiter-specific models extend the shared `User`, `Job`, and `Application` domain rather than duplicating job-seeker data.
- Demo identity: Alex Morgan, Backend Developer, 68% readiness. The Nova Systems role is the central demo flow.
- The API client in `frontend/lib/api.ts` centralizes base URL handling, typed responses, readable failures, and recruiter demo headers. It drives job exploration, job-match detail, applications, advisor, resume upload, recruiter job publishing, pipeline moves, and candidate notes.
- `frontend/public/brand/logo.png` is the optimized transparent `logo_without_text.png` icon. Local WebP landing images replace the original remote Unsplash image dependencies.

## Git status

Repository initialized and first milestone committed: `b0a03cb feat: scaffold Skillbridge AI job seeker MVP`. No remote origin was supplied, so a GitHub push cannot happen until one is configured.

## Verification (2026-09-25)

- `frontend`: `npx tsc --noEmit` and `npm run build` pass; 31 routes compile successfully.
- `backend`: `pytest -q` passes (11 tests); `python -m app.seed` is idempotent and seeds Nova Systems plus Sarah Johnson.
- A local FastAPI smoke test returned 200 for health, deterministic job match, and candidate stage moves, and 201 for recruiter job creation.

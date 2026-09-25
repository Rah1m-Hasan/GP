# Skillbridge AI — Project Handoff

## Current milestone

Recruiter workspace extension is now implemented alongside the existing job-seeker MVP: recruiter routes, Nova Systems/Sarah Johnson demo data, evidence-first candidate workflows, recruiter API surface, persistent seed records, and recruiter domain models.

## Continue from here

1. Replace the local recruiter UI data adapter with authenticated API-client calls; endpoints are ready but existing UI remains demo-local for interruption-free browser demos.
2. Add Alembic environment/revisions for the new recruiter-domain tables; SQLite `create_all` remains the local fallback.
3. Add JWT/Supabase session integration and use server-side company membership validation instead of the current `X-Company-ID` demonstration boundary.
4. Expand assessment question/answer persistence and connect an isolated code runner provider.

## Key implementation decisions

- Scores are always calculated by `backend/app/services/scoring.py`; the LLM only explains or recommends.
- Groq is chosen when `GROQ_API_KEY` exists; `MockProvider` gives a safe usable fallback otherwise.
- Resume parsing extracts text locally and only cleaned text may be sent to an AI provider.
- Recruiter routing is implemented under `/recruiter/*`; recruiter-specific models extend the shared `User`, `Job`, and `Application` domain rather than duplicating job-seeker data.
- Demo identity: Alex Morgan, Backend Developer, 68% readiness. The Nova Systems role is the central demo flow.

## Git status

Repository initialized and first milestone committed: `b0a03cb feat: scaffold Skillbridge AI job seeker MVP`. No remote origin was supplied, so a GitHub push cannot happen until one is configured.

## Verification (2026-09-25)

- `frontend`: `npx tsc --noEmit` and `npm run build` both pass; 18 routes compile successfully.
- `backend`: `pytest -q` passes (9 tests); `python -m app.seed` is idempotent and seeds Nova Systems plus Sarah Johnson.

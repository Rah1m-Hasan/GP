# Run Skillbridge AI Locally

This guide starts the complete local demo using SQLite. You do **not** need PostgreSQL, Supabase, or a Groq key to view the website.

## Prerequisites

- Node.js 20 or newer
- Python 3.11 or newer
- `npm` and `pip`

## 1. Configure the backend

From the repository root:

```bash
cp .env.example backend/.env
```

The default `DATABASE_URL` uses SQLite. Do not put API keys in frontend environment files.

## 2. Start the backend

Open a terminal:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Check the API at http://127.0.0.1:8000/health. It should return `"status":"ok"`.

## 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev -- --port 3000
```

Open http://localhost:3000.

## Demo paths

- Job seeker dashboard: http://localhost:3000/dashboard
- Recruiter onboarding: http://localhost:3000/recruiter/onboarding
- Recruiter dashboard: http://localhost:3000/recruiter/dashboard
- API docs: http://127.0.0.1:8000/docs

Demo recruiter: **Sarah Johnson**, `sarah@novasystems.demo`, Nova Systems.

## Optional: activate Groq

Add these values to `backend/.env`, then stop and restart the backend:

```env
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.3-70b-versatile
```

Without a Groq key, Skillbridge uses its safe local mock AI provider.

## Stop the servers

In each terminal, press `Ctrl+C`.

If a port remains occupied, identify its process first:

```bash
fuser -n tcp 3000 8000
```

Then stop only the listed process IDs:

```bash
kill <pid>
```

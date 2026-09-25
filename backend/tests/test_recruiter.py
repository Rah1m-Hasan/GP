import asyncio
import pytest
from fastapi import HTTPException
from app.routers.recruiter import router as recruiter_router
from app.routers.recruiter.router import add_note, create_job, dashboard, generate_assessment, get_candidate, move_stage
from app.schemas.recruiter import AssessmentInput, PipelineMoveInput, RecruiterJobInput, RecruiterNoteInput

def test_recruiter_dashboard_and_company_isolation():
    assert dashboard(x_company_id=None)['recruiter']['name']=='Sarah Johnson'
    with pytest.raises(HTTPException) as error: dashboard(x_company_id=2)
    assert error.value.status_code==403

def test_job_and_pipeline_move():
    job=create_job(RecruiterJobInput(title='QA Engineer',requirements=[]),x_company_id=None)
    assert job['status']=='Draft'
    moved=move_stage(1,PipelineMoveInput(stage='Interview'),x_company_id=None)
    assert moved['stage']=='Interview'

def test_note_and_assessment_generation_schema():
    note=add_note(1,RecruiterNoteInput(body='Verify deployment evidence.'),x_company_id=None)
    assert note['author']=='Sarah Johnson'
    draft=asyncio.run(generate_assessment(AssessmentInput(title='API Review',job_id=1,skills=['Python','FastAPI'],difficulty='Intermediate',duration_minutes=45,question_count=2),x_company_id=None))
    assert draft['requires_recruiter_review'] is True

def test_candidate_match_is_evidence_based():
    candidate=get_candidate(1,x_company_id=None)
    assert 0 <= candidate['match_explanation']['score'] <= 100
    assert 'privacy' in candidate

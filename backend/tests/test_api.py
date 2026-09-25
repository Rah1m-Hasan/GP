from app.main import health
from app.routers import dashboard, jobs
from app.routers import applications
from fastapi import HTTPException
import pytest

def test_health():
    assert health()['status']=='ok'

def test_jobs():
    assert len(jobs.list_jobs())>=2

def test_job_list_score_uses_the_match_calculator():
    listed=next(job for job in jobs.list_jobs() if job['id']==1)
    assert listed['match']==jobs.job_match(1)['score']

def test_dashboard_payload():
    assert dashboard.dashboard()['readiness']>=0

def test_application_update_returns_404_for_unknown_id():
    with pytest.raises(HTTPException) as error:
        applications.update_application(99999, applications.ApplicationInput(job_id=1,stage='Applied'))
    assert error.value.status_code==404

from app.main import health
from app.routers import dashboard, jobs

def test_health():
    assert health()['status']=='ok'

def test_jobs():
    assert len(jobs.list_jobs())>=2

def test_dashboard_payload():
    assert dashboard.dashboard()['readiness']>=0

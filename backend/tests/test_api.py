from fastapi.testclient import TestClient
from app.main import app
def test_health():
    with TestClient(app) as client: assert client.get('/health').status_code==200
def test_jobs():
    with TestClient(app) as client: assert len(client.get('/api/jobs').json())>=2

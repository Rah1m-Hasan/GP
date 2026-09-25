from fastapi import APIRouter, HTTPException, status
from app.schemas.api import ApplicationInput
from app.routers.jobs import DEMO_JOBS, job_match_for
router=APIRouter(prefix='/api/applications',tags=['applications'])
apps=[{'id':1,'job_id':1,'job':'Backend Developer','company':'Nova Systems','stage':'Saved','match_score':job_match_for(DEMO_JOBS[0]).score}]
@router.get('')
def list_applications(): return apps
@router.post('')
def create_application(payload:ApplicationInput):
    job=next((job for job in DEMO_JOBS if job['id']==payload.job_id),None)
    if not job: raise HTTPException(status.HTTP_404_NOT_FOUND,'Job not found')
    if any(app['job_id']==payload.job_id for app in apps):
        raise HTTPException(status.HTTP_409_CONFLICT,'An application for this job already exists')
    app={'id':max((item['id'] for item in apps),default=0)+1,'job_id':payload.job_id,'job':job['title'],'company':job['company'],'stage':payload.stage,'match_score':job_match_for(job).score};apps.append(app);return app
@router.put('/{application_id}')
def update_application(application_id:int,payload:ApplicationInput):
    app=next((item for item in apps if item['id']==application_id),None)
    if not app: raise HTTPException(status.HTTP_404_NOT_FOUND,'Application not found')
    if app['job_id']!=payload.job_id: raise HTTPException(status.HTTP_400_BAD_REQUEST,'Application job cannot be changed')
    app['stage']=payload.stage;return app

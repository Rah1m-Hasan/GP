from fastapi import APIRouter
from app.schemas.api import ApplicationInput
router=APIRouter(prefix='/api/applications',tags=['applications'])
apps=[{'id':1,'job_id':1,'job':'Backend Developer','company':'Nova Systems','stage':'Saved','match_score':87}]
@router.get('')
def list_applications(): return apps
@router.post('')
def create_application(payload:ApplicationInput):
    app={'id':len(apps)+1,'job_id':payload.job_id,'stage':payload.stage,'match_score':87};apps.append(app);return app
@router.put('/{application_id}')
def update_application(application_id:int,payload:ApplicationInput):
    app=next(a for a in apps if a['id']==application_id);app['stage']=payload.stage;return app

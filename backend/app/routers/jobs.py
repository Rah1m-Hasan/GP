from fastapi import APIRouter, HTTPException
from app.services.scoring import calculate_job_match
router=APIRouter(prefix='/api/jobs',tags=['jobs'])
DEMO_JOBS=[{'id':1,'slug':'backend-nova','title':'Backend Developer','company':'Nova Systems','location':'Remote · Bangladesh','match':87,'skills':['Python','FastAPI','REST API','Docker','AWS']},{'id':2,'slug':'platform-arc','title':'Junior Platform Engineer','company':'Arc Cloud','location':'Dhaka · Hybrid','match':74,'skills':['Python','Docker','Kubernetes','AWS']}]
@router.get('')
def list_jobs(q:str=''): return [j for j in DEMO_JOBS if q.lower() in (j['title']+j['company']).lower()]
@router.get('/{job_id}')
def get_job(job_id:int):
    job=next((x for x in DEMO_JOBS if x['id']==job_id),None)
    if not job: raise HTTPException(404,'Job not found')
    return job
@router.get('/{job_id}/match',response_model=dict)
def job_match(job_id:int):
    job=get_job(job_id); user={'Python':(80,'Assessment Verified'),'FastAPI':(45,'AI Estimated'),'REST API':(65,'AI Estimated'),'Docker':(30,'Self Reported'),'AWS':(15,'AI Estimated')}
    res=calculate_job_match(user,[{'name':x,'required_level':70,'required':True} for x in job['skills']])
    return {**res.__dict__,'explanation':'Score is computed from skill evidence, experience and projects; AI explanations never alter the score.'}

from fastapi import APIRouter, HTTPException
from app.services.scoring import calculate_job_match
router=APIRouter(prefix='/api/jobs',tags=['jobs'])
DEMO_JOBS=[{'id':1,'slug':'backend-nova','title':'Backend Developer','company':'Nova Systems','location':'Remote · Bangladesh','skills':['Python','FastAPI','REST API','Docker','AWS']},{'id':2,'slug':'platform-arc','title':'Junior Platform Engineer','company':'Arc Cloud','location':'Dhaka · Hybrid','skills':['Python','Docker','Kubernetes','AWS']}]
DEMO_USER_SKILLS={'Python':(80,'Assessment Verified'),'FastAPI':(45,'AI Estimated'),'REST API':(65,'AI Estimated'),'Docker':(30,'Self Reported'),'AWS':(15,'AI Estimated')}
def job_match_for(job:dict):
    return calculate_job_match(DEMO_USER_SKILLS,[{'name':skill,'required_level':70,'required':True} for skill in job['skills']])
def serialized_job(job:dict):
    return {**job,'match':job_match_for(job).score}
@router.get('')
def list_jobs(q:str=''): return [serialized_job(job) for job in DEMO_JOBS if q.lower() in (job['title']+job['company']).lower()]
@router.get('/{job_id}')
def get_job(job_id:int):
    job=next((x for x in DEMO_JOBS if x['id']==job_id),None)
    if not job: raise HTTPException(404,'Job not found')
    return serialized_job(job)
@router.get('/{job_id}/match',response_model=dict)
def job_match(job_id:int):
    job=next((item for item in DEMO_JOBS if item['id']==job_id),None)
    if not job: raise HTTPException(404,'Job not found')
    res=job_match_for(job)
    return {**res.__dict__,'explanation':'Score is computed from skill evidence, experience and projects; AI explanations never alter the score.'}

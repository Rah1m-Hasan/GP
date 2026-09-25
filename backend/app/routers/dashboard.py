from fastapi import APIRouter
from app.services.scoring import calculate_readiness
router=APIRouter(prefix='/api/dashboard',tags=['dashboard'])
@router.get('')
def dashboard():
    skills=[{'score':80,'required':70,'status':'Assessment Verified'},{'score':55,'required':70,'status':'Assessment Verified'},{'score':45,'required':70,'status':'AI Estimated'},{'score':30,'required':60,'status':'Self Reported'}]
    return {'user':'Alex Morgan','target_role':'Backend Developer','readiness':calculate_readiness(skills,.7,.65,.78),'verified_skills':7,'active_learning_paths':3,'job_matches':24}

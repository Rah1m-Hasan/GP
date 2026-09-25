from datetime import datetime, timezone
from fastapi import APIRouter, Header, HTTPException, status
from app.schemas.recruiter import AssessmentInput, CompanyUpdate, InterviewInput, OfferInput, PipelineMoveInput, RecruiterAssistantInput, RecruiterJobInput, RecruiterNoteInput
from app.services.ai.service import analyze_skills
from app.services.scoring import calculate_job_match

router=APIRouter(prefix='/api/recruiter',tags=['recruiter'])
STAGES=['Applied','AI Screening','Recruiter Review','Assessment','Assessment Review','Interview','Final Review','Offer','Hired','Rejected']
company={'id':1,'name':'Nova Systems','website':'https://novasystems.demo','industry':'Financial technology','size':'51–200','headquarters':'Dhaka, Bangladesh','description':'Nova Systems builds dependable financial workflow tools for ambitious teams.','tech_stack':['Python','FastAPI','PostgreSQL','Docker','AWS'],'verified':True}
jobs=[
 {'id':1,'title':'Backend Developer','department':'Engineering','location':'Remote · Bangladesh','work_mode':'Remote','employment_type':'Full-time','status':'Active','applications':42,'qualified':18,'assessments':11,'interviews':5,'created':'2026-09-18','description':'Build reliable APIs and data services for financial workflows.','requirements':[{'name':'Python','required_level':70,'is_required':True,'priority':'High'},{'name':'FastAPI','required_level':65,'is_required':True,'priority':'High'},{'name':'SQL','required_level':65,'is_required':True,'priority':'High'},{'name':'REST API','required_level':70,'is_required':True,'priority':'High'},{'name':'Docker','required_level':60,'is_required':True,'priority':'Medium'},{'name':'AWS','required_level':50,'is_required':False,'priority':'Medium'}]},
 {'id':2,'title':'Frontend Developer','department':'Engineering','location':'Dhaka · Hybrid','work_mode':'Hybrid','employment_type':'Full-time','status':'Active','applications':67,'qualified':25,'assessments':14,'interviews':4,'created':'2026-09-15','description':'Create polished product experiences with React and TypeScript.','requirements':[{'name':'JavaScript','required_level':70,'is_required':True,'priority':'High'},{'name':'React','required_level':70,'is_required':True,'priority':'High'}]},
 {'id':3,'title':'DevOps Engineer','department':'Platform','location':'Remote','work_mode':'Remote','employment_type':'Full-time','status':'Active','applications':38,'qualified':14,'assessments':8,'interviews':3,'created':'2026-09-10','description':'Improve delivery systems and cloud reliability.','requirements':[{'name':'Docker','required_level':70,'is_required':True,'priority':'High'},{'name':'AWS','required_level':65,'is_required':True,'priority':'High'}]},
 {'id':4,'title':'Junior Data Analyst','department':'Data','location':'Dhaka','work_mode':'On-site','employment_type':'Full-time','status':'Draft','applications':0,'qualified':0,'assessments':0,'interviews':0,'created':'2026-09-22','description':'Turn data into clear product decisions.','requirements':[{'name':'SQL','required_level':65,'is_required':True,'priority':'High'}]},
 {'id':5,'title':'ML Engineer','department':'Data','location':'Remote','work_mode':'Remote','employment_type':'Full-time','status':'Paused','applications':29,'qualified':10,'assessments':5,'interviews':2,'created':'2026-09-02','description':'Deploy useful machine learning systems.','requirements':[{'name':'Python','required_level':75,'is_required':True,'priority':'High'}]}
]
candidates=[
 {'id':1,'name':'Alex Morgan','initials':'AM','role':'Junior Developer','location':'Dhaka, Bangladesh','experience':'1.5 years','job_id':1,'stage':'Assessment Review','match':87,'skills':[{'name':'Python','score':91,'source':'Assessment Verified'},{'name':'SQL','score':84,'source':'Assessment Verified'},{'name':'FastAPI','score':88,'source':'Project Verified'},{'name':'REST API','score':65,'source':'AI Estimated'},{'name':'Docker','score':52,'source':'AI Estimated'},{'name':'AWS','score':20,'source':'Self Reported'}],'assessment':84,'interview':85,'applied':'2026-09-20','projects':['Invoice API · FastAPI, PostgreSQL','Task board API · Python, REST'], 'education':'BSc in Computer Science','notes':[{'id':1,'author':'Sarah Johnson','created':'2026-09-23 10:10','body':'Strong API knowledge. Need to verify system design depth.'}]},
 {'id':2,'name':'Sam Rahman','initials':'SR','role':'Backend Engineer','location':'Dhaka, Bangladesh','experience':'2.5 years','job_id':1,'stage':'Interview','match':82,'skills':[{'name':'Python','score':87,'source':'Assessment Verified'},{'name':'SQL','score':90,'source':'Assessment Verified'},{'name':'FastAPI','score':76,'source':'Project Verified'},{'name':'Docker','score':65,'source':'Project Verified'}],'assessment':87,'interview':92,'applied':'2026-09-19','projects':['Event processing service · Python, Redis'],'education':'BSc in Software Engineering','notes':[]},
 {'id':3,'name':'Maya Das','initials':'MD','role':'Software Engineer','location':'Chattogram, Bangladesh','experience':'2 years','job_id':1,'stage':'Final Review','match':84,'skills':[{'name':'Python','score':94,'source':'Assessment Verified'},{'name':'SQL','score':71,'source':'Assessment Verified'},{'name':'FastAPI','score':88,'source':'Project Verified'},{'name':'Docker','score':58,'source':'AI Estimated'}],'assessment':82,'interview':79,'applied':'2026-09-18','projects':['Inventory service · FastAPI, Celery'],'education':'BSc in CSE','notes':[]},
 {'id':4,'name':'Priya Saha','initials':'PS','role':'Frontend Developer','location':'Dhaka, Bangladesh','experience':'2 years','job_id':2,'stage':'Recruiter Review','match':79,'skills':[{'name':'React','score':89,'source':'Project Verified'},{'name':'JavaScript','score':86,'source':'Assessment Verified'}],'assessment':None,'interview':None,'applied':'2026-09-21','projects':['Customer portal · React, TypeScript'],'education':'BSc in CSE','notes':[]},
 {'id':5,'name':'Nabil Hasan','initials':'NH','role':'Cloud Engineer','location':'Remote','experience':'3 years','job_id':3,'stage':'Assessment','match':81,'skills':[{'name':'Docker','score':84,'source':'Assessment Verified'},{'name':'AWS','score':78,'source':'Project Verified'}],'assessment':None,'interview':None,'applied':'2026-09-19','projects':['Kubernetes delivery platform'],'education':'BSc in IT','notes':[]}
]
assessments=[{'id':1,'title':'Backend API Foundations','job_id':1,'skills':['REST API','SQL','FastAPI','Docker','System Design'],'difficulty':'Intermediate','duration_minutes':45,'question_count':6,'status':'Active','assigned':11,'average_score':84},{'id':2,'title':'Frontend React Foundations','job_id':2,'skills':['React','JavaScript'],'difficulty':'Intermediate','duration_minutes':40,'question_count':8,'status':'Active','assigned':14,'average_score':79}]
interviews=[{'id':1,'candidate_id':2,'job_id':1,'type':'Technical','scheduled_for':'2026-09-26T11:00:00Z','duration_minutes':45,'interviewer':'Sarah Johnson','status':'Upcoming'},{'id':2,'candidate_id':1,'job_id':1,'type':'Technical','scheduled_for':'2026-09-23T11:00:00Z','duration_minutes':45,'interviewer':'Sarah Johnson','status':'Completed'}]
activity=[]
def require_company(x_company_id:int|None):
    if x_company_id not in (None,1): raise HTTPException(status.HTTP_403_FORBIDDEN,'Company access denied')
def record(entity:str,action:str,detail:str): activity.insert(0,{'id':len(activity)+1,'entity':entity,'action':action,'detail':detail,'created':datetime.now(timezone.utc).isoformat()})
def job_by_id(job_id:int):
    item=next((job for job in jobs if job['id']==job_id),None)
    if not item: raise HTTPException(404,'Job not found')
    return item
def candidate_by_id(candidate_id:int):
    item=next((candidate for candidate in candidates if candidate['id']==candidate_id),None)
    if not item: raise HTTPException(404,'Candidate not found or not shared with your company')
    return item
@router.get('/dashboard')
def dashboard(x_company_id:int|None=Header(default=None)):
    require_company(x_company_id); return {'recruiter':{'name':'Sarah Johnson','title':'Senior Technical Recruiter'},'company':company,'metrics':{'active_jobs':8,'applications':342,'assessment':74,'interviews':21,'awaiting_review':6},'pipeline':{'Applications':342,'Qualified':128,'Assessment':74,'Interview':21,'Final Review':6},'pending_actions':['3 assessments awaiting review','5 candidates ready for interview','2 offers awaiting approval'],'recent_applications':candidates[:3]}
@router.get('/profile')
def profile(x_company_id:int|None=Header(default=None)):
    require_company(x_company_id); return {'name':'Sarah Johnson','title':'Senior Technical Recruiter','email':'sarah@novasystems.demo','company':company}
@router.get('/company')
def get_company(x_company_id:int|None=Header(default=None)): require_company(x_company_id); return company
@router.put('/company')
def update_company(payload:CompanyUpdate,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id); company.update(payload.model_dump());record('company','updated','Sarah updated the company profile');return company
@router.get('/jobs')
def list_jobs(status_filter:str='',x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);return [job for job in jobs if not status_filter or job['status'].lower()==status_filter.lower()]
@router.post('/jobs',status_code=201)
def create_job(payload:RecruiterJobInput,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);job={'id':max(j['id'] for j in jobs)+1,**payload.model_dump(),'status':'Draft','applications':0,'qualified':0,'assessments':0,'interviews':0,'created':datetime.now().date().isoformat()};jobs.append(job);record('job','created',f"Sarah created {job['title']}");return job
@router.get('/jobs/{job_id}')
def get_recruiter_job(job_id:int,x_company_id:int|None=Header(default=None)): require_company(x_company_id);return job_by_id(job_id)
@router.put('/jobs/{job_id}')
def update_job(job_id:int,payload:RecruiterJobInput,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);job=job_by_id(job_id);job.update(payload.model_dump());record('job','updated',f"Sarah updated {job['title']}");return job
@router.post('/jobs/{job_id}/publish')
def publish_job(job_id:int,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);job=job_by_id(job_id);job['status']='Active';record('job','published',f"Sarah published {job['title']}");return job
@router.post('/jobs/{job_id}/status')
def set_job_status(job_id:int,payload:dict,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);job=job_by_id(job_id);job['status']=payload.get('status','Paused');record('job','status_changed',f"{job['title']} is now {job['status']}");return job
@router.get('/jobs/{job_id}/pipeline')
def pipeline(job_id:int,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);job_by_id(job_id); return {'stages':STAGES,'candidates':[candidate for candidate in candidates if candidate['job_id']==job_id]}
@router.get('/candidates')
def list_candidates(q:str='',job_id:int|None=None,stage:str='',x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);return [c for c in candidates if (not q or q.lower() in (c['name']+c['role']+' '.join(s['name'] for s in c['skills'])).lower()) and (job_id is None or c['job_id']==job_id) and (not stage or c['stage']==stage)]
@router.get('/candidates/{candidate_id}')
def get_candidate(candidate_id:int,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);candidate=candidate_by_id(candidate_id);job=job_by_id(candidate['job_id']); user_skills={s['name']:(s['score'],s['source']) for s in candidate['skills']}; match=calculate_job_match(user_skills,job['requirements'],.8,.7,.7);return {**candidate,'job':job,'match_explanation':match.__dict__,'privacy':'Candidate data shown is limited to the role application and shared evidence.'}
@router.post('/candidates/{candidate_id}/stage')
def move_stage(candidate_id:int,payload:PipelineMoveInput,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);candidate=candidate_by_id(candidate_id);previous=candidate['stage'];candidate['stage']=payload.stage;record('candidate','stage_moved',f"Sarah moved {candidate['name']} from {previous} to {payload.stage}");return candidate
@router.post('/candidates/{candidate_id}/notes',status_code=201)
def add_note(candidate_id:int,payload:RecruiterNoteInput,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);candidate=candidate_by_id(candidate_id);note={'id':len(candidate['notes'])+1,'author':'Sarah Johnson','created':datetime.now().strftime('%Y-%m-%d %H:%M'),'body':payload.body};candidate['notes'].append(note);record('candidate','note_added',f"Sarah added a note for {candidate['name']}");return note
@router.delete('/candidates/{candidate_id}/notes/{note_id}',status_code=204)
def delete_note(candidate_id:int,note_id:int,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);candidate=candidate_by_id(candidate_id);candidate['notes'][:]=[n for n in candidate['notes'] if n['id']!=note_id]
@router.get('/assessments')
def list_assessments(x_company_id:int|None=Header(default=None)): require_company(x_company_id);return assessments
@router.post('/assessments',status_code=201)
def create_assessment(payload:AssessmentInput,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);job_by_id(payload.job_id);assessment={'id':max(a['id'] for a in assessments)+1,**payload.model_dump(),'status':'Draft','assigned':0,'average_score':None};assessments.append(assessment);record('assessment','created',f"Sarah created {assessment['title']}");return assessment
@router.post('/assessments/generate')
async def generate_assessment(payload:AssessmentInput,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);analysis=await analyze_skills(f"Generate a neutral assessment draft for {payload.skills}. Do not evaluate candidates or make hiring decisions.");return {'draft':payload.model_dump(),'questions':[{'type':'MCQ','prompt':f'What is a sound practice when working with {skill}?','editable':True} for skill in payload.skills[:payload.question_count]],'ai_note':analysis.summary,'requires_recruiter_review':True}
@router.get('/assessments/{assessment_id}')
def get_assessment(assessment_id:int,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);assessment=next((a for a in assessments if a['id']==assessment_id),None)
    if not assessment: raise HTTPException(404,'Assessment not found')
    return assessment
@router.post('/assessments/{assessment_id}/assign')
def assign_assessment(assessment_id:int,payload:dict,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);assessment=next((a for a in assessments if a['id']==assessment_id),None)
    if not assessment: raise HTTPException(404,'Assessment not found')
    candidate=candidate_by_id(int(payload.get('candidate_id',0)));candidate['stage']='Assessment';assessment['assigned']+=1;record('assessment','assigned',f"Sarah assigned {assessment['title']} to {candidate['name']}");return {'assessment':assessment,'candidate':candidate}
@router.get('/assessment-results/{candidate_id}')
def assessment_result(candidate_id:int,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);candidate=candidate_by_id(candidate_id);return {'candidate_id':candidate_id,'overall':candidate['assessment'] or 0,'technical_knowledge':88,'problem_solving':91,'code_quality':79,'system_design':72,'communication':84,'ai_feedback_label':'AI-assisted feedback — recruiter review required'}
@router.get('/interviews')
def list_interviews(status_filter:str='',x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);return [i for i in interviews if not status_filter or i['status'].lower()==status_filter.lower()]
@router.post('/interviews',status_code=201)
def schedule_interview(payload:InterviewInput,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);candidate=candidate_by_id(payload.candidate_id);job_by_id(payload.job_id); interview={'id':max(i['id'] for i in interviews)+1,'candidate_id':payload.candidate_id,'job_id':payload.job_id,'type':payload.interview_type,'scheduled_for':payload.scheduled_for.isoformat(),'duration_minutes':payload.duration_minutes,'interviewer':payload.interviewer,'status':'Upcoming'};interviews.append(interview);candidate['stage']='Interview';record('interview','scheduled',f"Sarah scheduled {payload.interview_type} with {candidate['name']}");return interview
@router.get('/interviews/{interview_id}')
def get_interview(interview_id:int,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);interview=next((i for i in interviews if i['id']==interview_id),None)
    if not interview: raise HTTPException(404,'Interview not found')
    return {**interview,'report':{'technical':88,'problem_solving':91,'communication':76,'role_knowledge':84,'signal':85,'label':'Decision support — final decision remains with recruiter','strengths':['Clear API trade-offs','Pragmatic problem decomposition'],'areas_for_review':['Probe cache invalidation depth']}}
@router.post('/candidates/{candidate_id}/offer',status_code=201)
def create_offer(candidate_id:int,payload:OfferInput,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);candidate=candidate_by_id(candidate_id);candidate['stage']='Offer';record('offer','drafted',f"Sarah drafted an offer for {candidate['name']}");return {'candidate_id':candidate_id,**payload.model_dump(),'status':'Draft','final_decision_required':True}
@router.post('/comparisons')
def compare_candidates(payload:dict,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);ids=payload.get('candidate_ids',[])
    if not 2<=len(ids)<=5: raise HTTPException(422,'Select between 2 and 5 candidates')
    return {'candidates':[candidate_by_id(int(i)) for i in ids],'notice':'Evidence comparison only. Skillbridge does not select a winner or recommend a final hiring decision.'}
@router.get('/analytics')
def analytics(x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);return {'funnel':{'Applications':342,'Qualified':128,'Assessment':74,'Interview':21,'Offers':6,'Hires':4},'jobs':[{'title':j['title'],'applications':j['applications']} for j in jobs],'scores':[72,76,79,82,84,87,91],'time_in_stage':[{'stage':'Recruiter Review','days':3.1},{'stage':'Assessment','days':4.5},{'stage':'Interview','days':5.2}]}
@router.get('/notifications')
def notifications(x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);return [{'id':1,'text':'Alex Morgan completed Backend API Foundations.','type':'assessment'},{'id':2,'text':'5 candidates are ready for interview review.','type':'review'},{'id':3,'text':'Backend Developer job closes in 7 days.','type':'job'}]
@router.get('/activity')
def get_activity(x_company_id:int|None=Header(default=None)): require_company(x_company_id);return activity[:30]
@router.post('/assistant/chat')
async def assistant(payload:RecruiterAssistantInput,x_company_id:int|None=Header(default=None)):
    require_company(x_company_id);analysis=await analyze_skills(f"Recruiter question: {payload.message}. Use only job-relevant skills, evidence, assessments and role requirements. Never recommend hiring, rejecting, or name a best candidate.");return {'message':analysis.summary,'recommendations':analysis.recommendations,'guardrail':'Evidence support only; final hiring actions require recruiter confirmation.'}

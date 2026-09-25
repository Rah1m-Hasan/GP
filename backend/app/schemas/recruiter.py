from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl

PIPELINE_STAGES = ('Applied','AI Screening','Recruiter Review','Assessment','Assessment Review','Interview','Final Review','Offer','Hired','Rejected')

class CompanyUpdate(BaseModel):
    name: str = Field(min_length=2,max_length=150)
    website: str = ''
    industry: str = Field(default='',max_length=80)
    size: str = Field(default='11–50',max_length=30)
    headquarters: str = Field(default='',max_length=120)
    description: str = Field(default='',max_length=2000)
    tech_stack: list[str] = Field(default_factory=list,max_length=30)

class SkillRequirementInput(BaseModel):
    name: str = Field(min_length=1,max_length=100)
    required_level: int = Field(ge=0,le=100)
    is_required: bool = True
    priority: str = Field(default='Medium',pattern='^(Low|Medium|High)$')

class RecruiterJobInput(BaseModel):
    title: str = Field(min_length=2,max_length=150)
    department: str = Field(default='',max_length=100)
    location: str = Field(default='',max_length=120)
    work_mode: str = Field(default='Remote',pattern='^(Remote|Hybrid|On-site)$')
    employment_type: str = Field(default='Full-time',pattern='^(Full-time|Part-time|Contract|Internship)$')
    experience_min: float = Field(default=0,ge=0,le=50)
    experience_max: float = Field(default=3,ge=0,le=50)
    salary: str = Field(default='',max_length=80)
    description: str = Field(default='',max_length=5000)
    responsibilities: list[str] = Field(default_factory=list,max_length=20)
    requirements: list[SkillRequirementInput] = Field(default_factory=list,max_length=30)
    assessment_mode: str = Field(default='None',pattern='^(None|Existing|Generate AI)$')

class PipelineMoveInput(BaseModel):
    stage: str = Field(pattern='^(Applied|AI Screening|Recruiter Review|Assessment|Assessment Review|Interview|Final Review|Offer|Hired|Rejected)$')
    reason: str = Field(default='',max_length=600)

class RecruiterNoteInput(BaseModel):
    body: str = Field(min_length=1,max_length=3000)

class AssessmentInput(BaseModel):
    title: str = Field(min_length=2,max_length=150)
    job_id: int
    skills: list[str] = Field(min_length=1,max_length=10)
    difficulty: str = Field(default='Intermediate',pattern='^(Beginner|Intermediate|Advanced)$')
    duration_minutes: int = Field(default=45,ge=10,le=240)
    question_count: int = Field(default=6,ge=1,le=30)

class InterviewInput(BaseModel):
    candidate_id: int
    job_id: int
    interview_type: str = Field(pattern='^(Technical|Behavioral|System Design|HR|Final Interview)$')
    scheduled_for: datetime
    duration_minutes: int = Field(default=45,ge=15,le=180)
    interviewer: str = Field(default='Sarah Johnson',max_length=120)

class OfferInput(BaseModel):
    salary: str = Field(min_length=1,max_length=80)
    currency: str = Field(default='BDT',max_length=10)
    start_date: str = Field(default='',max_length=30)
    message: str = Field(default='',max_length=2000)

class RecruiterAssistantInput(BaseModel):
    message: str = Field(min_length=1,max_length=3000)
    company_id: int = 1

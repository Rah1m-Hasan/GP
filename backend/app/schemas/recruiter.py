from datetime import datetime
from pydantic import BaseModel, Field, field_validator, model_validator

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

    @field_validator('name')
    @classmethod
    def name_must_not_be_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError('Skill requirement name cannot be blank.')
        return value

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
    requirements: list[SkillRequirementInput] = Field(min_length=1,max_length=30)
    assessment_mode: str = Field(default='None',pattern='^(None|Existing|Generate AI)$')

    @field_validator('title')
    @classmethod
    def title_must_not_be_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError('Job title cannot be blank.')
        return value

    @model_validator(mode='after')
    def validate_ranges_and_requirements(self):
        if self.experience_min > self.experience_max:
            raise ValueError('Minimum experience cannot exceed maximum experience.')
        names = [requirement.name.strip().casefold() for requirement in self.requirements]
        if len(names) != len(set(names)):
            raise ValueError('Each skill requirement may be listed only once.')
        return self

class PipelineMoveInput(BaseModel):
    stage: str = Field(pattern='^(Applied|AI Screening|Recruiter Review|Assessment|Assessment Review|Interview|Final Review|Offer|Hired|Rejected)$')
    reason: str = Field(default='',max_length=600)

class RecruiterNoteInput(BaseModel):
    body: str = Field(min_length=1,max_length=3000)

    @field_validator('body')
    @classmethod
    def body_must_not_be_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError('Note cannot be blank.')
        return value

class AssessmentInput(BaseModel):
    title: str = Field(min_length=2,max_length=150)
    job_id: int = Field(gt=0)
    skills: list[str] = Field(min_length=1,max_length=10)
    difficulty: str = Field(default='Intermediate',pattern='^(Beginner|Intermediate|Advanced)$')
    duration_minutes: int = Field(default=45,ge=10,le=240)
    question_count: int = Field(default=6,ge=1,le=30)

    @field_validator('skills')
    @classmethod
    def validate_skills(cls, values: list[str]) -> list[str]:
        cleaned = [value.strip() for value in values if value.strip()]
        if not cleaned:
            raise ValueError('Select at least one skill.')
        if len({value.casefold() for value in cleaned}) != len(cleaned):
            raise ValueError('Each assessment skill may be listed only once.')
        return cleaned

class InterviewInput(BaseModel):
    candidate_id: int = Field(gt=0)
    job_id: int = Field(gt=0)
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

    @field_validator('message')
    @classmethod
    def message_must_not_be_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError('Message cannot be blank.')
        return value

class JobStatusInput(BaseModel):
    status: str = Field(pattern='^(Draft|Active|Paused|Closed)$')

class AssessmentAssignmentInput(BaseModel):
    candidate_id: int = Field(gt=0)

class CandidateComparisonInput(BaseModel):
    candidate_ids: list[int] = Field(min_length=2,max_length=5)

    @field_validator('candidate_ids')
    @classmethod
    def unique_candidate_ids(cls, values: list[int]) -> list[int]:
        if len(values) != len(set(values)):
            raise ValueError('A candidate can only be compared once.')
        return values

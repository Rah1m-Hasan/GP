from pydantic import BaseModel, Field
class SkillAnalysis(BaseModel):
    summary: str = Field(max_length=1500)
    recommendations: list[str] = Field(default_factory=list, max_length=8)
class ResumeExtraction(BaseModel):
    name: str|None=None; email: str|None=None; skills:list[str]=Field(default_factory=list,max_length=50); experience:list[str]=Field(default_factory=list,max_length=20); education:list[str]=Field(default_factory=list,max_length=10)

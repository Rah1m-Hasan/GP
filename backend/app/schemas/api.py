from pydantic import BaseModel, Field
class SkillInput(BaseModel): name:str=Field(min_length=1,max_length=100); score:int=Field(ge=0,le=100); status:str='Self Reported'; required:int=Field(default=60,ge=0,le=100)
class JobMatchResponse(BaseModel): score:int; strong:list[str]; partial:list[str]; missing:list[str]; explanation:str
class ApplicationInput(BaseModel): job_id:int; stage:str='Saved'
class ChatInput(BaseModel): message:str=Field(min_length=1,max_length=4000); conversation_id:int|None=None
class ResumeUploadResponse(BaseModel): filename:str; text_preview:str; message:str

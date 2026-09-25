from pydantic import BaseModel, Field, field_validator
class SkillInput(BaseModel): name:str=Field(min_length=1,max_length=100); score:int=Field(ge=0,le=100); status:str='Self Reported'; required:int=Field(default=60,ge=0,le=100)
class JobMatchResponse(BaseModel): score:int; strong:list[str]; partial:list[str]; missing:list[str]; explanation:str
class ApplicationInput(BaseModel):
    job_id: int = Field(gt=0)
    stage: str = Field(default='Saved', pattern='^(Saved|Applied|Assessment|Interview|Offer|Rejected)$')
class ChatInput(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    conversation_id: int | None = None

    @field_validator('message')
    @classmethod
    def message_must_not_be_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError('Message cannot be blank.')
        return value
class ResumeUploadResponse(BaseModel): filename:str; text_preview:str; message:str

from fastapi import APIRouter
from app.schemas.api import ChatInput
from app.services.ai.service import analyze_skills
router=APIRouter(prefix='/api/advisor',tags=['advisor'])
@router.post('/chat')
async def chat(payload:ChatInput):
    analysis=await analyze_skills(f'Alex is targeting Backend Developer. Current readiness 68%. User asks: {payload.message}')
    return {'conversation_id':payload.conversation_id or 1,'title':'Backend Developer career plan','message':analysis.summary,'recommendations':analysis.recommendations,'ai_estimated':True}

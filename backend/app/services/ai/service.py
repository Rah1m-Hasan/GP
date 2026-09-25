from app.core.config import settings
from app.services.ai.provider import AIProvider, MockProvider
from app.services.ai.groq_provider import GroqProvider
from app.services.ai.schemas import SkillAnalysis
def provider() -> AIProvider: return GroqProvider(settings.groq_api_key,settings.groq_model) if settings.groq_api_key else MockProvider()
async def analyze_skills(profile_text:str) -> SkillAnalysis:
    try:
        raw=await provider().generate_json('You are a careful career analyst. Do not claim verification. Return JSON with summary and recommendations.',profile_text)
        return SkillAnalysis.model_validate(raw)
    except Exception:
        return SkillAnalysis(summary='Analysis is temporarily unavailable. Your saved profile and deterministic scores remain available.',recommendations=['Complete Docker Fundamentals','Take the SQL assessment'])

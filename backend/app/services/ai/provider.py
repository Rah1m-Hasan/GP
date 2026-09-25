from abc import ABC, abstractmethod
class AIProvider(ABC):
    @abstractmethod
    async def generate_json(self, system: str, prompt: str) -> dict: ...
class MockProvider(AIProvider):
    async def generate_json(self, system: str, prompt: str) -> dict:
        return {'source':'mock','summary':'AI service is unavailable; this is a safe local fallback.','recommendations':['Complete Docker Fundamentals','Build a small deployment project','Take a skills assessment']}

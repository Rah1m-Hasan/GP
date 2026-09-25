import json
import httpx
from app.services.ai.provider import AIProvider
class GroqProvider(AIProvider):
    def __init__(self,key:str,model:str): self.key=key;self.model=model
    async def generate_json(self,system:str,prompt:str)->dict:
        payload={'model':self.model,'messages':[{'role':'system','content':system},{'role':'user','content':prompt}],'response_format':{'type':'json_object'},'temperature':.2}
        async with httpx.AsyncClient(timeout=25) as client:
            response=await client.post('https://api.groq.com/openai/v1/chat/completions',headers={'Authorization':f'Bearer {self.key}'},json=payload);response.raise_for_status()
        return json.loads(response.json()['choices'][0]['message']['content'])

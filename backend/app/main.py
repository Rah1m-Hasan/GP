from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.core.config import settings
from app.core.database import Base, engine
import app.models
from app.routers import advisor, applications, dashboard, jobs, resume, recruiter
@asynccontextmanager
async def lifespan(app:FastAPI):
    Base.metadata.create_all(bind=engine)
    yield
app=FastAPI(title='Skillbridge AI API',version='0.1.0',lifespan=lifespan)
app.add_middleware(CORSMiddleware,allow_origins=[x.strip() for x in settings.cors_origins.split(',')],allow_credentials=True,allow_methods=['*'],allow_headers=['*'])
@app.middleware('http')
async def security_headers(request,call_next):
    response=await call_next(request);response.headers['X-Content-Type-Options']='nosniff';response.headers['X-Frame-Options']='DENY';response.headers['Referrer-Policy']='strict-origin-when-cross-origin';return response
app.include_router(dashboard.router);app.include_router(jobs.router);app.include_router(resume.router);app.include_router(advisor.router);app.include_router(applications.router);app.include_router(recruiter.router)
@app.get('/health')
def health(): return {'status':'ok','ai_provider':'groq' if settings.groq_api_key else 'mock'}

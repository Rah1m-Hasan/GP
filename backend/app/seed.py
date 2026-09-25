"""Idempotent local seed entry point: `python -m app.seed`."""
from sqlalchemy import select
from app.core.database import Base, SessionLocal, engine
from app.models import Company, CompanyMember, RecruiterProfile, User

def seed() -> None:
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        company=db.scalar(select(Company).where(Company.name=='Nova Systems'))
        if company is None:
            company=Company(name='Nova Systems',website='https://novasystems.demo',industry='Financial technology',size='51–200',headquarters='Dhaka, Bangladesh',description='Demo company for Skillbridge AI.',verification_status='Verified')
            db.add(company); db.flush()
        recruiter=db.scalar(select(User).where(User.email=='sarah@novasystems.demo'))
        if recruiter is None:
            recruiter=User(email='sarah@novasystems.demo',full_name='Sarah Johnson',role='recruiter')
            db.add(recruiter); db.flush()
        if db.scalar(select(RecruiterProfile).where(RecruiterProfile.user_id==recruiter.id)) is None:
            db.add(RecruiterProfile(user_id=recruiter.id,company_id=company.id,job_title='Senior Technical Recruiter'))
            db.add(CompanyMember(company_id=company.id,user_id=recruiter.id,member_role='Recruiter'))
        db.commit()
    print('Seeded Nova Systems and sarah@novasystems.demo')

if __name__=='__main__': seed()

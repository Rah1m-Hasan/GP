"""Recruiter-domain persistence models. They extend shared User, Job, and Application data."""
from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
from app.models.models import Timestamped

class Company(Timestamped, Base):
    __tablename__='companies'
    id: Mapped[int]=mapped_column(primary_key=True)
    name: Mapped[str]=mapped_column(String(150),unique=True,index=True)
    website: Mapped[str]=mapped_column(String(255),default='')
    industry: Mapped[str]=mapped_column(String(80),default='')
    size: Mapped[str]=mapped_column(String(30),default='')
    headquarters: Mapped[str]=mapped_column(String(120),default='')
    description: Mapped[str]=mapped_column(Text,default='')
    verification_status: Mapped[str]=mapped_column(String(30),default='Pending')

class CompanyMember(Timestamped, Base):
    __tablename__='company_members'; __table_args__=(UniqueConstraint('company_id','user_id'),)
    id: Mapped[int]=mapped_column(primary_key=True)
    company_id: Mapped[int]=mapped_column(ForeignKey('companies.id',ondelete='CASCADE'),index=True)
    user_id: Mapped[int]=mapped_column(ForeignKey('users.id',ondelete='CASCADE'),index=True)
    member_role: Mapped[str]=mapped_column(String(30),default='Recruiter')

class RecruiterProfile(Timestamped, Base):
    __tablename__='recruiter_profiles'
    id: Mapped[int]=mapped_column(primary_key=True)
    user_id: Mapped[int]=mapped_column(ForeignKey('users.id',ondelete='CASCADE'),unique=True,index=True)
    company_id: Mapped[int]=mapped_column(ForeignKey('companies.id',ondelete='CASCADE'),index=True)
    job_title: Mapped[str]=mapped_column(String(120),default='Recruiter')
    phone: Mapped[str]=mapped_column(String(40),default='')

class RecruiterNote(Timestamped, Base):
    __tablename__='recruiter_notes'
    id: Mapped[int]=mapped_column(primary_key=True)
    author_id: Mapped[int]=mapped_column(ForeignKey('users.id',ondelete='CASCADE'),index=True)
    application_id: Mapped[int]=mapped_column(ForeignKey('applications.id',ondelete='CASCADE'),index=True)
    body: Mapped[str]=mapped_column(Text)

class RecruiterAssessment(Timestamped, Base):
    __tablename__='recruiter_assessments'
    id: Mapped[int]=mapped_column(primary_key=True)
    company_id: Mapped[int]=mapped_column(ForeignKey('companies.id',ondelete='CASCADE'),index=True)
    job_id: Mapped[int]=mapped_column(ForeignKey('jobs.id',ondelete='CASCADE'),index=True)
    title: Mapped[str]=mapped_column(String(150))
    status: Mapped[str]=mapped_column(String(20),default='Draft')
    config: Mapped[dict]=mapped_column(JSON,default=dict)

class RecruiterInterview(Timestamped, Base):
    __tablename__='recruiter_interviews'
    id: Mapped[int]=mapped_column(primary_key=True)
    company_id: Mapped[int]=mapped_column(ForeignKey('companies.id',ondelete='CASCADE'),index=True)
    application_id: Mapped[int]=mapped_column(ForeignKey('applications.id',ondelete='CASCADE'),index=True)
    interviewer_id: Mapped[int]=mapped_column(ForeignKey('users.id',ondelete='SET NULL'),nullable=True)
    interview_type: Mapped[str]=mapped_column(String(40))
    scheduled_for: Mapped[datetime]=mapped_column(DateTime)
    status: Mapped[str]=mapped_column(String(20),default='Upcoming')
    report: Mapped[dict]=mapped_column(JSON,default=dict)

class RecruiterNotification(Timestamped, Base):
    __tablename__='recruiter_notifications'
    id: Mapped[int]=mapped_column(primary_key=True)
    recipient_id: Mapped[int]=mapped_column(ForeignKey('users.id',ondelete='CASCADE'),index=True)
    company_id: Mapped[int]=mapped_column(ForeignKey('companies.id',ondelete='CASCADE'),index=True)
    notification_type: Mapped[str]=mapped_column(String(50))
    body: Mapped[str]=mapped_column(Text)
    read_at: Mapped[datetime|None]=mapped_column(DateTime,nullable=True)

class ActivityLog(Timestamped, Base):
    __tablename__='activity_logs'
    id: Mapped[int]=mapped_column(primary_key=True)
    company_id: Mapped[int]=mapped_column(ForeignKey('companies.id',ondelete='CASCADE'),index=True)
    actor_id: Mapped[int|None]=mapped_column(ForeignKey('users.id',ondelete='SET NULL'),nullable=True)
    entity_type: Mapped[str]=mapped_column(String(50),index=True)
    entity_id: Mapped[int]=mapped_column(Integer,index=True)
    action: Mapped[str]=mapped_column(String(80))
    details: Mapped[dict]=mapped_column(JSON,default=dict)

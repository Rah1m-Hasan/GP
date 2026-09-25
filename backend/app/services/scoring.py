from dataclasses import dataclass
@dataclass
class MatchResult:
    score: int; strong: list[str]; partial: list[str]; missing: list[str]
def calculate_readiness(skills: list[dict], experience_score: float=0.7, project_score: float=0.6, assessment_score: float=0.7) -> int:
    """Deterministic readiness. AI may explain this value but never creates it."""
    verified = [s['score'] for s in skills if s.get('status') in ('Assessment Verified','Project Verified')]
    all_levels = [min(s['score']/max(s.get('required',60),1),1) for s in skills]
    verified_factor = (sum(verified)/len(verified)/100) if verified else 0
    requirement_factor = sum(all_levels)/len(all_levels) if all_levels else 0
    return round(100*(.35*verified_factor + .30*requirement_factor + .15*experience_score + .10*project_score + .10*assessment_score))
def calculate_job_match(user_skills: dict[str, tuple[int,str]], requirements: list[dict], experience_match: float=.8, project_evidence: float=.6, education_match: float=.7) -> MatchResult:
    required=[r for r in requirements if r.get('required',True)]; preferred=[r for r in requirements if not r.get('required',True)]
    strong=[];partial=[];missing=[]
    def ratio(items):
        if not items:return 1.0
        vals=[]
        for r in items:
            score,status=user_skills.get(r['name'],(0,'None')); need=r.get('required_level',60); value=min(score/need,1)
            vals.append(value)
            (strong if value>=1 else partial if value>=.45 else missing).append(r['name'])
        return sum(vals)/len(vals)
    required_score=ratio(required); preferred_score=ratio(preferred)
    verified_count=sum(1 for name in strong if user_skills.get(name,(0,''))[1] in ('Assessment Verified','Project Verified'))
    verification_bonus=verified_count/max(len(required),1)
    score=100*(.45*required_score+.15*preferred_score+.10*verification_bonus+.15*experience_match+.10*project_evidence+.05*education_match)
    return MatchResult(round(min(score,100)),strong,partial,missing)

from app.services.scoring import calculate_job_match, calculate_readiness
def test_readiness_is_deterministic():
    skills=[{'score':80,'required':70,'status':'Assessment Verified'},{'score':30,'required':60,'status':'Self Reported'}]
    assert calculate_readiness(skills)==calculate_readiness(skills)
    assert 0<=calculate_readiness(skills)<=100
def test_match_identifies_gaps():
    result=calculate_job_match({'Python':(80,'Assessment Verified'),'Docker':(20,'Self Reported')},[{'name':'Python','required_level':70,'required':True},{'name':'Docker','required_level':60,'required':True},{'name':'AWS','required_level':50,'required':True}])
    assert 'Python' in result.strong and 'AWS' in result.missing
    assert 0<=result.score<=100

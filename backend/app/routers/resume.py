from pathlib import Path
from fastapi import APIRouter, File, HTTPException, UploadFile, status
from app.core.config import settings
from app.schemas.api import ResumeUploadResponse
router=APIRouter(prefix='/api/resume',tags=['resume'])
ALLOWED={'.pdf','.docx'}
@router.post('/upload',response_model=ResumeUploadResponse)
async def upload_resume(file:UploadFile=File(...)):
    suffix=Path(file.filename or '').suffix.lower()
    if suffix not in ALLOWED: raise HTTPException(415,'Only PDF and DOCX resumes are accepted.')
    if file.content_type not in {'application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/octet-stream'}:
        raise HTTPException(status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,'Only PDF and DOCX resumes are accepted.')
    content=await file.read()
    if not content: raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY,'The uploaded resume is empty.')
    if len(content)>settings.max_upload_mb*1024*1024: raise HTTPException(413,'Resume exceeds file size limit.')
    text=''
    try:
        if suffix=='.pdf':
            import fitz
            with fitz.open(stream=content,filetype='pdf') as document: text='\n'.join(p.get_text() for p in document)
        else:
            from docx import Document
            from io import BytesIO
            text='\n'.join(p.text for p in Document(BytesIO(content)).paragraphs)
    except Exception: raise HTTPException(422,'Resume could not be parsed. Try another file.')
    cleaned=' '.join(text.split())[:30000]
    if not cleaned: raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY,'No readable text was found in this resume.')
    return ResumeUploadResponse(filename=file.filename or 'resume',text_preview=cleaned[:500],message='Text extracted. Confirm structured fields before saving.')

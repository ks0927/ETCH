from fastapi import APIRouter, HTTPException, status
from ..service.news_service import fetch_and_store

router = APIRouter(prefix="/news", tags=["News"])

@router.post("/{company_name}", status_code=status.HTTP_201_CREATED)
def fetch_news(company_name: str):
    try:
        cnt = fetch_and_store(company_name)
        return {"company": company_name, "stored": cnt}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

from fastapi import APIRouter
from ..core.redis_client import r
from ..service.company_service import refresh_top10

router = APIRouter(prefix="/companies", tags=["Companies"])

@router.get("/top10")
def get_top10():
    if not r.exists("top10_companies"):
        rows = refresh_top10()
    keys = r.lrange("top10_companies", 0, -1)
    result = [r.hgetall(k) for k in keys]
    
    return result

from fastapi import APIRouter, status
router = APIRouter(prefix="/healthcheck", tags=["Health"])

@router.get("", status_code=status.HTTP_200_OK)
def healthcheck():
    return {"status": "ok"}

from fastapi import APIRouter
from sqlmodel import text

router = APIRouter()

@router.head("/health")
async def uptime():
    text('SELECT 1')
    return {"status": "ok!"}

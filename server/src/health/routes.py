from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio.session import AsyncSession
from src.db.main import session
from sqlmodel import text, select

router = APIRouter()

@router.api_route("/health", methods=["GET", "HEAD"])
async def uptime(session:AsyncSession = Depends(session)):
    await session.execute(select(text('1')))
    return {"status": "ok!"}

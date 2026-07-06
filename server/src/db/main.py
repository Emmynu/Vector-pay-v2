from sqlmodel import create_engine, SQLModel
from sqlalchemy.ext.asyncio import AsyncEngine
from  src.config import config
from src.db.models import Users
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio.session import AsyncSession


engine =  AsyncEngine(
    create_engine(
        url=config.DATABASE_URL,
        echo=True
    )
)

async def initDB():
    async with engine.begin() as connection:
        Users
        await connection.run_sync(SQLModel.metadata.create_all)



async def session():

    sessions =  sessionmaker(
        bind=engine,
        class_= AsyncSession,
        expire_on_commit=False
    )

    async with sessions() as s:
        yield s

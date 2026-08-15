from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from src.auth.routes import router as authRouter
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.db.main import initDB
import logging
from src.health.routes import router as healthRouter
from src.account.routes import router as accountRouter
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from .limiter import limiter

logger = logging.Logger("uvicorn.error")

@asynccontextmanager
async def lifeSpan(app:FastAPI):

    print("Starting....")
    await initDB()
    yield
    print("Stopping...")

version = "v1"

app = FastAPI(
    title= "VectorPay",
    description="A fintech application that allows users to deposit, transfer withdraw funds seamlessly without hidden fees",
    version=version,
    lifespan=lifeSpan
)


app.add_middleware(
    CORSMiddleware,
        allow_origins= ["http://localhost:3000"],
        allow_headers=["*"],
        allow_methods=["*"],
        allow_credentials=True
)

app.state.limiter = limiter

app.add_middleware(SlowAPIMiddleware)



@app.exception_handler(RateLimitExceeded)
async def custom_limit_exception_handler(req: Request, err:RateLimitExceeded):
    return JSONResponse(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        content={
            "status": "error",
            "msg": "Too many request.",
            "description": err.detail
        }
    )


@app.exception_handler(RequestValidationError)
async def custom_422_exception_handler(req: Request, err:RequestValidationError):
    logger.error(err)

    error_details = []
    for error in err.errors():
        field_name = ".".join([str(loc) for loc in error["loc"] if loc not in ("body", "query", "path")])
        
        error_details.append(
            f"{field_name or "request"}: {error["msg"]}"
        )

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content={
            "status": "error",
            "msg": "Validation Error",
            "description": error_details
        }
    )

@app.exception_handler(Exception)
async def custom_500_error_handler(request: Request, err:Exception):
    logger.error(err)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "msg": "Oops....something went wrong",
            "description": str(err)
        }
    )

app.include_router(authRouter, prefix="/api/{version}/auth", tags=["Auth"])
app.include_router(accountRouter, prefix="/api/{version}/account", tags=["Account"])
app.include_router(healthRouter, prefix="/api/{version}", tags=["Health"])

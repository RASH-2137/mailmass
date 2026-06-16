from fastapi import APIRouter
from sqlalchemy import text
from app.database.database import engine
from app.database.redis_client import redis_client

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
#endpoint to check database health
@router.get("/health/db")
def database_health():

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "database": "healthy"
        }

    except Exception as e:
        return {
            "database": "unhealthy",
            "error": str(e)
        }
#endpoint to check redis health
@router.get("/health/redis")
def redis_health():

    try:
        redis_client.ping()

        return {
            "redis": "healthy"
        }

    except Exception as e:
        return {
            "redis": "unhealthy",
            "error": str(e)
        }
    
#endpoint to check overall health
@router.get("/health/full")
def full_health():

    health_status = {
        "api": "healthy"
    }

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        health_status["database"] = "healthy"

    except Exception:
        health_status["database"] = "unhealthy"

    try:
        redis_client.ping()

        health_status["redis"] = "healthy"

    except Exception:
        health_status["redis"] = "unhealthy"

    return health_status

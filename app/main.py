from fastapi import FastAPI

from app.database.database import engine
from app.database.models import Base

from app.routes.user_routes import router as user_router
from app.routes import tracking_routes
from app.routes.health_routes import router as health_router

from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi import _rate_limit_exceeded_handler
from app.limiter import limiter
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(tracking_routes.router)
app.include_router(user_router)
app.include_router(health_router)
#rate limiter
app.state.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)
app.add_middleware(SlowAPIMiddleware)

@app.get("/")
def root():
    return {"message": "Email Platform Running"}
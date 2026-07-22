from fastapi import FastAPI

from app.database.database import engine
from app.database.models import Base
from app.routes import webhook_routes
from app.routes.auth_routes import router as auth_router
from app.routes.contact_routes import router as contact_router
from app.routes.template_routes import router as template_router
from app.routes.campaign_routes import router as campaign_router
from app.routes.analytics_routes import router as analytics_router
from app.routes.dashboard_routes import router as dashboard_router
from app.routes.tracking_routes import router as tracking_router
from app.routes.health_routes import router as health_router
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi import _rate_limit_exceeded_handler
from app.limiter import limiter
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router)
app.include_router(contact_router)
app.include_router(template_router)
app.include_router(campaign_router)
app.include_router(analytics_router)
app.include_router(dashboard_router)
app.include_router(tracking_router)
app.include_router(health_router)


#rate limiter
app.state.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://mailmass.spacekid.xyz"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    webhook_routes.router
)

@app.get("/")
def root():
    return {"message": "Email Platform Running"}
from celery import Celery
from app.config import REDIS_URL

celery_app = Celery(
    "email_sender",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["app.tasks"]
)

celery_app.conf.beat_schedule = {
    "check-scheduled-campaigns": {
        "task": "app.tasks.check_scheduled_campaigns",
        "schedule": 60.0,
    }
}

celery_app.conf.timezone = "UTC"
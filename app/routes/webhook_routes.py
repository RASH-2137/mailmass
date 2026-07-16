from fastapi import APIRouter
from fastapi import Request
from datetime import datetime, timezone

from app.database.database import SessionLocal
from app.database.models import CampaignSendLog

router = APIRouter(
    prefix="/webhooks",
    tags=["Webhooks"]
)

@router.post("/resend")
async def resend_webhook(request: Request):

    payload = await request.json()

    event_type = payload.get("type")
    data = payload.get("data", {})
    email_id = data.get("email_id")

    db = SessionLocal()
    try:
        log = (
            db.query(CampaignSendLog)
            .filter(CampaignSendLog.provider_message_id == email_id)
            .first()
        )

        if not log:
            return {"message": "Email not found"}

        if event_type == "email.delivered":
            log.delivered_at = datetime.now(timezone.utc)

        elif event_type == "email.opened":
            log.opened_at = datetime.now(timezone.utc)

        elif event_type == "email.bounced":
            log.bounced_at = datetime.now(timezone.utc)
            log.bounce_reason = data.get("reason")
        db.commit()

    finally:
        db.close()

    return {
        "message": "Webhook processed"
    }
from fastapi import APIRouter
from fastapi.responses import Response
from datetime import datetime

from app.database.database import SessionLocal
from app.database.models import CampaignSendLog, CampaignClickLog, Contact
from fastapi import Query, HTTPException
from fastapi.responses import RedirectResponse
router = APIRouter(
    prefix="/track",
    tags=["Tracking"]
)
#this will track if the mail is opened or not
@router.get("/open/{log_id}")
def track_open(log_id: int):


    db = SessionLocal()

    try:

        log = (
            db.query(CampaignSendLog)
            .filter(
                CampaignSendLog.id == log_id
            )
            .first()
        )


        if log and not log.opened_at:

            log.opened_at = datetime.utcnow()

            db.commit()


        return Response(
            content=b"",
            media_type="image/gif"
        )

    finally:
        db.close()
#this will track the clicks on the links sent via email
@router.get("/click/{log_id}")
def track_click(
    log_id: int,
    url: str = Query(...)
):

    db = SessionLocal()

    try:

        log = db.query(
            CampaignSendLog
        ).filter(
            CampaignSendLog.id == log_id
        ).first()

        if not log:
            return RedirectResponse(
                url=url
            )

        click_log = CampaignClickLog(
            campaign_send_log_id=log.id,
            clicked_url=url
        )

        db.add(click_log)

        if not log.clicked_at:
            log.clicked_at = datetime.utcnow()

        db.commit()

        return RedirectResponse(
            url=url
        )

    finally:
        db.close()
#this will allow users to unsubscrive from the mailing list using a unsubscribe button
@router.get("/unsubscribe/{token}")
def unsubscribe(token: str):

    db = SessionLocal()

    try:

        contact = db.query(Contact).filter(
            Contact.unsubscribe_token == token
        ).first()

        if not contact:
            raise HTTPException(
                status_code=404,
                detail="Invalid unsubscribe link"
            )

        contact.is_subscribed = False

        db.commit()

        return {
            "message":
            "You have been unsubscribed successfully."
        }

    finally:
        db.close()
from fastapi import (
    APIRouter,
    Depends
)
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import (
    User,
    Contact,
    Campaign,
    CampaignSendLog,
    CampaignClickLog
)
from app.security.oauth2 import get_current_user

router = APIRouter(tags=["Dashboard"])

#creating a protected route to get dashboard analytics
@router.get("/dashboard")
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    total_contacts = (
        db.query(Contact)
        .filter(
            Contact.owner_id == current_user.id
        )
        .count()
    )

    total_campaigns = (
        db.query(Campaign)
        .filter(
            Campaign.owner_id == current_user.id
        )
        .count()
    )

    total_emails_sent = (
        db.query(CampaignSendLog)
        .join(
            Campaign,
            CampaignSendLog.campaign_id == Campaign.id
        )
        .filter(
            Campaign.owner_id == current_user.id
        )
        .count()
    )

    opens = (
        db.query(CampaignSendLog)
        .join(
            Campaign,
            CampaignSendLog.campaign_id == Campaign.id
        )
        .filter(
            Campaign.owner_id == current_user.id,
            CampaignSendLog.opened_at != None
        )
        .count()
    )

    clicks = (
        db.query(CampaignClickLog)
        .join(
            CampaignSendLog,
            CampaignClickLog.campaign_send_log_id == CampaignSendLog.id
        )
        .join(
            Campaign,
            CampaignSendLog.campaign_id == Campaign.id
        )
        .filter(
            Campaign.owner_id == current_user.id
        )
        .count()
    )

    open_rate = (
        round(
            (opens / total_emails_sent) * 100,
            2
        )
        if total_emails_sent > 0
        else 0
    )

    click_rate = (
        round(
            (clicks / total_emails_sent) * 100,
            2
        )
        if total_emails_sent > 0
        else 0
    )

    return {
        "total_contacts": total_contacts,
        "total_campaigns": total_campaigns,
        "emails_sent": total_emails_sent,
        "opens": opens,
        "clicks": clicks,
        "open_rate": open_rate,
        "click_rate": click_rate
    }
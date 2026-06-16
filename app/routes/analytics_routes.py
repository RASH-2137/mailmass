from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.database.models import (
    User,
    Contact,
    Campaign,
    CampaignSendLog,
    CampaignClickLog,
    CampaignRecipient
)
from app.security.oauth2 import get_current_user

router = APIRouter(tags=["Analytics"])

#creating a protected route to get campaign logs
@router.get("/campaigns/{campaign_id}/logs")
def get_campaign_logs(
    campaign_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id,
        Campaign.owner_id == current_user.id
    ).first()

    if not campaign:
        raise HTTPException(
            status_code=404,
            detail="Campaign not found"
        )

    logs = db.query(CampaignSendLog).filter(
        CampaignSendLog.campaign_id == campaign_id
    ).all()

    result = []

    for log in logs:

        contact = db.query(Contact).filter(
            Contact.id == log.contact_id
        ).first()

        if contact:
            result.append({
            "contact_name": contact.name,
            "email": contact.email,
            "status": log.status,
            "sent_at": log.sent_at,
            "opened_at": log.opened_at,
            "clicked_at": log.clicked_at,
            "opened": log.opened_at is not None,
            "clicked": log.clicked_at is not None
        })

    return result
#creating a protected route to get campaign statistics
@router.get("/campaigns/{campaign_id}/stats")
def get_campaign_stats(
    campaign_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id,
        Campaign.owner_id == current_user.id
    ).first()

    if not campaign:
        raise HTTPException(
            status_code=404,
            detail="Campaign not found"
        )

    total_recipients = db.query(CampaignRecipient).filter(
        CampaignRecipient.campaign_id == campaign_id
    ).count()

    total_logs = db.query(CampaignSendLog).filter(
        CampaignSendLog.campaign_id == campaign_id
    ).count()

    return {
        "campaign_id": campaign.id,
        "campaign_name": campaign.name,
        "total_recipients": total_recipients,
        "emails_sent": total_logs,
        "total_logs": total_logs
    }
#creating a protected route to get campaign analytics
@router.get("/campaigns/{campaign_id}/analytics")
def get_campaign_analytics(
    campaign_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id,
        Campaign.owner_id == current_user.id
    ).first()

    if not campaign:
        raise HTTPException(
            status_code=404,
            detail="Campaign not found"
        )
    
    emails_sent = db.query(
        CampaignSendLog
    ).filter(
        CampaignSendLog.campaign_id == campaign_id
    ).count()

    opens = db.query(
        CampaignSendLog
    ).filter(
        CampaignSendLog.campaign_id == campaign_id,
        CampaignSendLog.opened_at != None
    ).count()

    clicks = db.query(
        CampaignClickLog
    ).join(
        CampaignSendLog,
        CampaignClickLog.campaign_send_log_id ==
        CampaignSendLog.id
    ).filter(
        CampaignSendLog.campaign_id == campaign_id
    ).count()

    top_links = (
        db.query(
            CampaignClickLog.clicked_url,
            func.count(
                CampaignClickLog.id
            ).label("click_count")
        )
        .join(
            CampaignSendLog,
            CampaignClickLog.campaign_send_log_id
            == CampaignSendLog.id
        )
        .filter(
            CampaignSendLog.campaign_id
            == campaign_id
        )
        .group_by(
            CampaignClickLog.clicked_url
        )
        .order_by(
            func.count(
                CampaignClickLog.id
            ).desc()
        )
        .all()
    )
    
    formatted_links = []

    for link in top_links:

        formatted_links.append(
            {
                "url": link.clicked_url,
                "clicks": link.click_count
            }
    )

    open_rate = 0
    click_rate = 0

    if emails_sent > 0:

        open_rate = round(
            (opens / emails_sent) * 100,
            2
        )

        click_rate = round(
            (clicks / emails_sent) * 100,
            2
        )
    return {
            "campaign_id": campaign_id,
            "emails_sent": emails_sent,
            "opens": opens,
            "open_rate": open_rate,
            "clicks": clicks,
            "click_rate": click_rate,
            "top_links": formatted_links
    }

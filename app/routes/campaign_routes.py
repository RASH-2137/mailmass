from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request
)
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import (
    User,
    Contact,
    Campaign,
    Template,
    CampaignRecipient,
    CampaignSendLog
)
from app.schemas.user_schema import (
    CampaignCreate,
    CampaignUpdate,
    AddRecipients
)
from app.security.oauth2 import get_current_user
from app.tasks import send_campaign_task
from app.limiter import limiter

router = APIRouter(tags=["Campaigns"])

#creating a protected route to create campaigns
@router.post("/campaigns")
@limiter.limit("20/minute")
def create_campaign(
    request: Request,
    campaign: CampaignCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    template = db.query(Template).filter(
        Template.id == campaign.template_id,
        Template.owner_id == current_user.id
    ).first()

    if not template:
        raise HTTPException(
            status_code=404,
            detail="Template not found"
        )

    new_campaign = Campaign(
        name=campaign.name,
        template_id=campaign.template_id,
        owner_id=current_user.id,
        send_at=campaign.send_at
    )

    db.add(new_campaign)
    db.commit()
    db.refresh(new_campaign)

    return {
        "message": "Campaign created successfully",
        "campaign_id": new_campaign.id
    }
#creating a protected route to get campaigns
@router.get("/campaigns")
def get_campaigns(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    campaigns = db.query(Campaign).filter(
        Campaign.owner_id == current_user.id
    ).all()

    result = []

    for campaign in campaigns:

        recipient_count = db.query(
            CampaignRecipient
        ).filter(
            CampaignRecipient.campaign_id == campaign.id
        ).count()

        emails_sent = db.query(
            CampaignSendLog
        ).filter(
            CampaignSendLog.campaign_id == campaign.id
        ).count()

        result.append({
            "id": campaign.id,
            "name": campaign.name,
            "status": campaign.status,
            "template_id": campaign.template_id,
            "recipient_count": recipient_count,
            "emails_sent": emails_sent,
            "send_at": campaign.send_at
        })

    return result

#creating a protected route to get campaign details
@router.get("/campaigns/{campaign_id}")
def get_campaign(
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
    
    template = db.query(Template).filter(
    Template.id == campaign.template_id
    ).first()

    recipients = db.query(CampaignRecipient).filter(
    CampaignRecipient.campaign_id == campaign_id
    ).all()
    recipient_list = []
    print(recipients)

    for recipient in recipients:
        contact = db.query(Contact).filter(
        Contact.id == recipient.contact_id
    ).first()
        if contact:
            recipient_list.append({
                "id": contact.id,
                "name": contact.name,
                "email": contact.email
            })
    

    #print(contact.name)
    #print(contact.email)

    return {
    "campaign_id": campaign.id,
    "campaign_name": campaign.name,
    "status": campaign.status,

    "template": {
        "id": template.id,
        "name": template.name,
        "subject": template.subject,
        "body": template.body
    },

    "recipients": recipient_list
}
#creating a protected route to update campaigns
@router.put("/campaigns/{campaign_id}")
def update_campaign(
    campaign_id: int,
    updated_campaign: CampaignUpdate,
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

    campaign.name = updated_campaign.name
    campaign.template_id = updated_campaign.template_id

    db.commit()
    db.refresh(campaign)

    return {
        "message": "Campaign updated successfully",
        "campaign": {
        "id": campaign.id,
        "name": campaign.name,
        "status": campaign.status,
        "template_id": campaign.template_id
        }
    }

#creating a protected route to add recipients to a campaign
@router.post("/campaigns/{campaign_id}/recipients")
def add_recipients(
    campaign_id: int,
    data: AddRecipients,
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

    for contact_id in data.contact_ids:

        contact = db.query(Contact).filter(
            Contact.id == contact_id,
            Contact.owner_id == current_user.id
        ).first()

        if not contact:
            continue
        
        existing_recipient = db.query(CampaignRecipient).filter(
        CampaignRecipient.campaign_id == campaign_id,
        CampaignRecipient.contact_id == contact_id
        ).first()

        if existing_recipient:
            continue

        recipient = CampaignRecipient(
            campaign_id=campaign_id,
            contact_id=contact_id
        )

        db.add(recipient)

    db.commit()

    return {
        "message": "Recipients added successfully"
    }

#creating a protected route to get campaign recipients
@router.get("/campaigns/{campaign_id}/recipients")
def get_campaign_recipients(
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

    recipients = db.query(CampaignRecipient).filter(
        CampaignRecipient.campaign_id == campaign_id
    ).all()

    result = []

    for recipient in recipients:

        contact = db.query(Contact).filter(
            Contact.id == recipient.contact_id
        ).first()

        if contact:
            result.append({
                "id": contact.id,
                "name": contact.name,
                "email": contact.email
            })

    return result

#creating a protected route to remove a repeated recipient from a campaign or a mistakenly added recipient
@router.delete("/campaigns/{campaign_id}/recipients/{contact_id}")
def remove_recipient(
    campaign_id: int,
    contact_id: int,
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

    recipient = db.query(CampaignRecipient).filter(
        CampaignRecipient.campaign_id == campaign_id,
        CampaignRecipient.contact_id == contact_id
    ).first()

    if not recipient:
        raise HTTPException(
            status_code=404,
            detail="Recipient not found in campaign"
        )

    db.delete(recipient)
    db.commit()

    return {
        "message": "Recipient removed successfully"
    }

#creating a protected route to send campaign emails
@router.post("/campaigns/{campaign_id}/send")
@limiter.limit("2/minute")
def send_campaign(
    request: Request,
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
    campaign.status = "queued"
    db.commit()
    send_campaign_task.delay(campaign_id)

    return {
    "message": "Campaign queued successfully"
    }
#creating a protected route to delete a campaign
@router.delete("/campaigns/{campaign_id}")
def delete_campaign(
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

    db.delete(campaign)
    db.commit()

    return {
        "message": "Campaign deleted successfully"
    }

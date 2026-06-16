from unittest import result
import re
from fastapi import APIRouter, UploadFile, File, Request
from fastapi import Depends, Query

from sqlalchemy.orm import Session

from app.limiter import limiter
from app.schemas.user_schema import AddRecipients, TemplateUpdate, UserCreate
from app.database.database import get_db
from app.database.models import CampaignClickLog, CampaignRecipient, User, Contact

from app.security.hashing import hash_password

from app.schemas.user_schema import UserLogin
from app.security.hashing import verify_password

from app.security.jwt_handler import create_access_token
from fastapi import HTTPException
from app.security.oauth2 import get_current_user
from app.schemas.user_schema import ContactCreate
from app.schemas.user_schema import ContactUpdate, ContactImportConfirm

from app.database.models import Template
from app.schemas.user_schema import TemplateCreate
from fastapi.responses import Response

from app.database.models import Campaign
from app.schemas.user_schema import CampaignCreate , CampaignUpdate
from app.email.email_sender import send_email
from app.database.models import CampaignSendLog, CampaignClickLog
from app.tasks import send_campaign_task
from sqlalchemy import func, or_
import uuid
import json
import csv
import io


from app.database.redis_client import redis_client
router = APIRouter()


@router.get("/test")
def test():
    return {"message": "User Routes Working"}
#creating a user signup route
@router.post("/signup")
@limiter.limit("3/minute")
def signup(
    request: Request,
    user: UserCreate,
    db: Session = Depends(get_db)
):
#checking if the user already exists in the database
    existing_user = db.query(User).filter(
    User.email == user.email
    ).first()
    
    if existing_user:
        raise HTTPException(
        status_code=409,
        detail="User already exists"
        )
#hashing the password before it enters the database
    hashed_password = hash_password(
    user.password
    )
    new_user = User(
    name=user.name,
    email=user.email,
    password=hashed_password
    )
#adding the user to the database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
    "message": "User created successfully",
    "user_id": new_user.id
    }
#creating a user login route
@router.post("/login")
@limiter.limit("5/minute")
def login(
    request: Request,
    user: UserLogin,
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(
    User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )
    #verifying the password
    is_valid = verify_password(
    user.password,
    db_user.password
    )

    if not is_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    access_token = create_access_token(
            data={
                "sub": db_user.email
            }
    )

    return {
    "access_token": access_token,
    "token_type": "bearer"
    }


#creating a protected route
@router.get("/profile")
def profile(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }

#creating a route to add contacts
@router.post("/contacts")
def create_contact(
    contact: ContactCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print("CONTACT ROUTE HIT")

    new_contact = Contact(
        name=contact.name,
        email=contact.email,
        owner_id=current_user.id,
        unsubscribe_token=str(uuid.uuid4())
    )

    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)

    return {
        "message": "Contact created successfully",
        "contact_id": new_contact.id
    }
#creating a route to get contacts
@router.get("/contacts")
def get_contacts(
    page: int = Query(
        default=1,
        ge=1
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=100
    ),
    search: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit
    query = db.query(Contact).filter(
        Contact.owner_id == current_user.id
    )
    if search:

        query = query.filter(
            or_(
                Contact.name.ilike(f"%{search}%"),
                Contact.email.ilike(f"%{search}%")
            )
        )
    total_contacts = query.count()
    contacts = (
        query
        .offset(offset)
        .limit(limit)
        .all()
    )
    contact_list = [
        {
            "id": contact.id,
            "name": contact.name,
            "email": contact.email
        }
        for contact in contacts
    ]

    return {
        "page": page,
        "limit": limit,
        "total_contacts": total_contacts,
        "contacts": contact_list
    }
#creating a route to delete contacts
@router.delete("/contacts/{contact_id}")
def delete_contact(
    contact_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    
    contact = db.query(Contact).filter(
        Contact.id == contact_id,
        Contact.owner_id == current_user.id
    ).first()

    if not contact:
        raise HTTPException(
            status_code=404,
            detail="Contact not found"
        )

    db.delete(contact)
    db.commit()

    return {
        "message": "Contact deleted successfully"
    }
#creating a route to update contacts
@router.put("/contacts/{contact_id}")
def update_contact(
    contact_id: int,
    updated_contact: ContactUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    contact = db.query(Contact).filter(
        Contact.id == contact_id,
        Contact.owner_id == current_user.id
    ).first()

    if not contact:
        raise HTTPException(
            status_code=404,
            detail="Contact not found"
        )

    contact.name = updated_contact.name
    contact.email = updated_contact.email

    db.commit()
    db.refresh(contact)

    return {
        "message": "Contact updated successfully",
        "contact": {
            "id": contact.id,
            "name": contact.name,
            "email": contact.email
        }
    }

#creating a protected route to add templates
@router.post("/templates")
@limiter.limit("30/minute")
def create_template(
    request: Request,
    template: TemplateCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_template = Template(
        name=template.name,
        subject=template.subject,
        body=template.body,
        owner_id=current_user.id
    )

    db.add(new_template)
    db.commit()
    db.refresh(new_template)

    return {
        "message": "Template created successfully",
        "template_id": new_template.id
    }

#creating a protected route to get templates
@router.get("/templates")
def get_templates(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    templates = db.query(Template).filter(
        Template.owner_id == current_user.id
    ).all()

    return [
        {
            "id": template.id,
            "name": template.name,
            "subject": template.subject,
            "body": template.body
        }
        for template in templates
    ]
#creating a route to update templates
@router.put("/templates/{template_id}")
def update_template(
    template_id: int,
    updated_template: TemplateUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    template = db.query(Template).filter(
        Template.id == template_id,
        Template.owner_id == current_user.id
    ).first()

    if not template:
        raise HTTPException(
            status_code=404,
            detail="Template not found"
        )

    template.name = updated_template.name
    template.subject = updated_template.subject
    template.body = updated_template.body

    db.commit()
    db.refresh(template)

    return {
        "message": "Template updated successfully"
    }

#creating a route to delete templates
@router.delete("/templates/{template_id}")
def delete_template(
    template_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    template = db.query(Template).filter(
        Template.id == template_id,
        Template.owner_id == current_user.id
    ).first()

    if not template:
        raise HTTPException(
            status_code=404,
            detail="Template not found"
        )

    db.delete(template)
    db.commit()

    return {
        "message": "Template deleted successfully"
    }

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
#helper function to validate email addresses using regex
def is_valid_email(email):

    pattern = r"^[^@]+@[^@]+\.[^@]+$"
    return re.match(pattern, email) is not None
#creating a protected route to preview & confirm contacts before uploading them to database
@router.post("/contacts/import/preview")
@limiter.limit("5/minute")
async def preview_contacts_import(
    request: Request,
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    content = await file.read()

    content = content.decode("utf-8")

    csv_file = io.StringIO(content)

    reader = csv.DictReader(
        csv_file,
        delimiter=","
    )
    print("HEADERS:", reader.fieldnames)

    total_rows = 0
    valid_contacts = 0
    invalid_contacts = 0
    duplicates = 0
    already_exists = 0

    seen_emails = set()
    valid_contacts_data = []
    for row in reader:

        total_rows += 1
        print("ROW:", row)
        name = row.get("name", "").strip()
        email = row.get("email", "").strip().lower()
        print("NAME:", name)
        print("EMAIL:", email)
        print("VALID:", is_valid_email(email))
        if not name:
            invalid_contacts += 1
            continue

        if not is_valid_email(email):
            invalid_contacts += 1
            continue

        if email in seen_emails:
            duplicates += 1
            continue

        existing_contact = (
            db.query(Contact)
            .filter(
                Contact.email == email,
                Contact.owner_id == current_user.id
            )
            .first()
        )

        if existing_contact:
            already_exists += 1
            continue

        seen_emails.add(email)

        valid_contacts_data.append(
            {
                "name": name,
                "email": email
            }
        )
        valid_contacts += 1
    import_id = str(uuid.uuid4())

    redis_client.setex(
        f"contact_import:{import_id}",
        3600,  # Expire after 1 hour
        json.dumps(valid_contacts_data)
    )
    print(
    redis_client.get(
            f"contact_import:{import_id}"
        )
    )

    return {
            "total_rows": total_rows,
            "valid_contacts": valid_contacts,
            "duplicates": duplicates,
            "already_exists": already_exists,
            "invalid_contacts": invalid_contacts,
            "preview": valid_contacts_data,
            "import_id": import_id
    }

#creating a protected route to confirm contact import and save contacts to database
@router.post("/contacts/import/confirm")
@limiter.limit("5/minute")
def confirm_contacts_import(
    request: Request,
    confirm_data: ContactImportConfirm,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    preview_data = redis_client.get(
        f"contact_import:{confirm_data.import_id}"
    )
    if not preview_data:
        raise HTTPException(
            status_code=404,
            detail="Import preview not found or expired"
        )
    
    contacts_data = json.loads(preview_data)
    contacts_to_create = []
    for contact_data in contacts_data:
        new_contact = Contact(
        name=contact_data["name"],
        email=contact_data["email"],
        owner_id=current_user.id,
        unsubscribe_token=str(uuid.uuid4())
    )
        contacts_to_create.append(new_contact)

    db.add_all(contacts_to_create)
    db.commit()
    imported_count = len(contacts_to_create)
    redis_client.delete(
        f"contact_import:{confirm_data.import_id}"
    )

    return {
        "message": "Contacts imported successfully",
        "contacts_imported": imported_count
    }

#create a protected route to export contacts as a CSV file
@router.get("/contacts/export")
def export_contacts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    contacts = db.query(Contact).filter(
        Contact.owner_id == current_user.id
    ).all()

    output = io.StringIO()

    writer = csv.writer(output)
    writer.writerow([
        "name",
        "email"
    ])
    for contact in contacts:
        writer.writerow([
            contact.name,
            contact.email
        ])
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=contacts.csv"
        }
    )
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
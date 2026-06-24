from app.celery_worker import celery_app

from app.database.database import SessionLocal
from app.config import BASE_URL
from app.database.models import (
    Campaign,
    Template,
    Contact,
    CampaignRecipient,
    CampaignSendLog
)
from app.utils.email_tracking import rewrite_links

from app.email.email_sender import send_email

from datetime import datetime, timezone
#this will send the campaign mails and also track the status of mails opened
@celery_app.task
def send_campaign_task(campaign_id):

    db = SessionLocal()

    try:

        campaign = db.query(Campaign).filter(
            Campaign.id == campaign_id
        ).first()

        if not campaign:
            return

        campaign.status = "sending"
        db.commit()

        template = db.query(Template).filter(
            Template.id == campaign.template_id
        ).first()

        recipients = db.query(CampaignRecipient).filter(
            CampaignRecipient.campaign_id == campaign_id
        ).all()

        print("CAMPAIGN:", campaign.id)

        print("RECIPIENT COUNT:", len(recipients))

        for recipient in recipients:

            contact = db.query(Contact).filter(
                Contact.id == recipient.contact_id
            ).first()

            print("CONTACT:", contact)
            print("SUBSCRIBED:", contact.is_subscribed)
            
            if not contact:
                continue
            if not contact.is_subscribed:
                continue

            log = CampaignSendLog(
                campaign_id=campaign.id,
                contact_id=contact.id,
                status="pending"
            )

            db.add(log)
            db.commit()
            db.refresh(log)

            tracking_pixel = f"""
            <img
                src="{BASE_URL}/track/open/{log.id}"
                width="1"
                height="1"
            />
            """

            personalized_body = template.body.replace(
                "{{name}}",
                contact.name
            )
            
            personalized_body = rewrite_links(personalized_body, log.id)

            personalized_body += tracking_pixel


            unsubscribe_link = f"""
                <br><br>
                <hr>
                <p>
                If you no longer wish to receive these emails,
                <a href="{BASE_URL}/track/unsubscribe/{contact.unsubscribe_token}">
                unsubscribe here
                </a>
                </p>
                """
            personalized_body += unsubscribe_link

            print("Sending to:", contact.email)

            try:
                response = send_email(
                    to_email=contact.email,
                    subject=template.subject,
                    body=personalized_body
                )
                log.provider_message_id = response["id"]

                log.status = "sent"
                db.commit()

                print("PROVIDER MESSAGE ID:", response["id"])
                print("EMAIL SENT:", contact.email)

            except Exception as e:

                log.status = "failed"
                db.commit()
                print("EMAIL FAILED:", contact.email)
                print("ERROR:", str(e))

        campaign.status = "completed"
        db.commit()

    except Exception as e:

        if campaign:
            campaign.status = "failed"
            db.commit()

        raise e

    finally:
        db.close()

#this will check for the completion status of the scheduled mails
@celery_app.task
def check_scheduled_campaigns():

    db = SessionLocal()

    try:

        now = datetime.utcnow()

        campaigns = (
            db.query(Campaign)
            .filter(
                Campaign.send_at <= now,
                Campaign.status == "draft"
            )
            .all()
        )

        for campaign in campaigns:

            campaign.status = "queued"
            db.commit()

            send_campaign_task.delay(campaign.id)

    finally:
        db.close()
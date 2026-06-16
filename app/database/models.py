from sqlalchemy import Boolean, Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

from sqlalchemy.orm import relationship

from app.database.database import Base

from sqlalchemy import DateTime
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False)

    password = Column(String, nullable=False)

    contacts = relationship(
        "Contact",
        back_populates="owner"
    )


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, nullable=False)

    is_subscribed = Column(
        Boolean,
        default=True,
        nullable=False
    )

    unsubscribe_token = Column(
        String,
        unique=True,
        nullable=False
    )

    owner_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    owner = relationship(
        "User",
        back_populates="contacts"
    )
    


class Template(Base):
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    subject = Column(String, nullable=False)

    body = Column(String, nullable=False)

    owner_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    owner = relationship(
        "User"
    )
#creating a campaign model to store info about the campaigns
class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    status = Column(
        String,
        default="draft"
    )
    send_at = Column(DateTime(timezone=True), nullable=True)

    owner_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    template_id = Column(
        Integer,
        ForeignKey("templates.id")
    )

    owner = relationship("User")

    template = relationship("Template")

    recipients = relationship(
        "CampaignRecipient",
        back_populates="campaign",
        cascade="all, delete"
    )
    
#creating a campaign recipient model to store info about the recipients
class CampaignRecipient(Base):
    __tablename__ = "campaign_recipients"

    id = Column(Integer, primary_key=True, index=True)

    campaign_id = Column(
        Integer,
        ForeignKey("campaigns.id")
    )

    contact_id = Column(
        Integer,
        ForeignKey("contacts.id")
    )

    campaign = relationship(
        "Campaign",
        back_populates="recipients"
    )

    contact = relationship("Contact")
#creating a campaign send log to store info about the mails sent
class CampaignSendLog(Base):
    __tablename__ = "campaign_send_logs"

    id = Column(Integer, primary_key=True, index=True)

    campaign_id = Column(
        Integer,
        ForeignKey("campaigns.id")
    )

    contact_id = Column(
        Integer,
        ForeignKey("contacts.id")
    )

    status = Column(
        String,
        default="sent"
    )

    sent_at = Column(
        DateTime,
        default=datetime.utcnow
    )
    opened_at = Column(
        DateTime,
        nullable=True
    )
    clicked_at = Column(
    DateTime,
    nullable=True
    )
    campaign = relationship("Campaign")

    contact = relationship("Contact")
#create a campaign send log to store other clicking info about the mail sent
class CampaignClickLog(Base):

    __tablename__ = "campaign_click_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    campaign_send_log_id = Column(
        Integer,
        ForeignKey("campaign_send_logs.id")
    )

    clicked_url = Column(
        String
    )

    clicked_at = Column(
        DateTime,
        default=datetime.utcnow
    )
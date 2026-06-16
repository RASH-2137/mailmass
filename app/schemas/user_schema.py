from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ContactCreate(BaseModel):
    name: str
    email: EmailStr

class ContactUpdate(BaseModel):
    name: str
    email: EmailStr

class TemplateCreate(BaseModel):
    name: str
    subject: str
    body: str

class TemplateUpdate(BaseModel):
    name: str
    subject: str
    body: str

class CampaignCreate(BaseModel):
    name: str
    template_id: int
    send_at: datetime | None = None

class AddRecipients(BaseModel):
    contact_ids: list[int]

class CampaignUpdate(BaseModel):
    name: str
    template_id: int

class ContactImportConfirm(BaseModel):
    import_id: str
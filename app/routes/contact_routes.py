import re
import csv
import io
import uuid
import json

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Request,
    Query
)

from fastapi.responses import Response

from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database.database import get_db
from app.database.models import (
    User,
    Contact
)

from app.database.redis_client import redis_client

from app.schemas.user_schema import (
    ContactCreate,
    ContactUpdate,
    ContactImportConfirm
)

from app.security.oauth2 import get_current_user

from app.limiter import limiter

router = APIRouter(tags=["Contacts"])

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
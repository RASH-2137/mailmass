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
    Template
)
from app.schemas.user_schema import (
    TemplateCreate,
    TemplateUpdate
)
from app.security.oauth2 import get_current_user
from app.limiter import limiter

router = APIRouter(tags=["Templates"])

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

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import os
import secrets
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.database.database import get_db
from app.database.models import User
from app.schemas.user_schema import UserCreate, UserLogin, GoogleLoginRequest
from app.security.hashing import (
    hash_password,
    verify_password
)
from app.security.jwt_handler import create_access_token
from app.security.oauth2 import get_current_user
from app.limiter import limiter

router = APIRouter(tags=["Authentication"])

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


@router.post("/google-login")
@limiter.limit("5/minute")
def google_login(
    request: Request,
    google_request: GoogleLoginRequest,
    db: Session = Depends(get_db)
):
    try:
        # Verify the token
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        if not client_id:
            raise HTTPException(status_code=500, detail="Google Client ID not configured")
            
        idinfo = id_token.verify_oauth2_token(
            google_request.credential, 
            google_requests.Request(), 
            client_id
        )

        email = idinfo.get("email")
        name = idinfo.get("name", "Google User")
        
        if not email:
            raise HTTPException(status_code=400, detail="Google token did not contain an email")

        db_user = db.query(User).filter(User.email == email).first()

        if not db_user:
            # Create a new user with a random unusable password
            random_password = secrets.token_urlsafe(32)
            hashed_password = hash_password(random_password)
            
            db_user = User(
                name=name,
                email=email,
                password=hashed_password
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)

        # Generate standard MailMass JWT
        access_token = create_access_token(
            data={
                "sub": db_user.email
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    except ValueError as e:
        print("GOOGLE TOKEN VERIFICATION ERROR:", repr(e))
        raise HTTPException(
            status_code=401,
            detail="Invalid Google token"
        )

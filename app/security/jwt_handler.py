from jose import jwt
from datetime import datetime
from datetime import timedelta
from app.config import SECRET_KEY
from app.config import ALGORITHM


#this create the jwt authetication token for the user when they log in (changes every 30 minutes)
def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=30)

    to_encode.update({
        "exp": expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt
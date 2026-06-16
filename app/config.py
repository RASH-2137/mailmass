from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
BASE_URL = os.getenv("BASE_URL")
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
REDIS_URL = os.getenv("REDIS_URL")

if not REDIS_URL:
    raise ValueError("REDIS_URL not found")

if not SECRET_KEY:
    raise ValueError("SECRET_KEY not found")

if not BASE_URL:
    raise ValueError("BASE_URL not found")

if not EMAIL_ADDRESS:
    raise ValueError("EMAIL_ADDRESS not found")

if not EMAIL_PASSWORD:
    raise ValueError("EMAIL_PASSWORD not found")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found")
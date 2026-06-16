import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.config import EMAIL_ADDRESS
from app.config import EMAIL_PASSWORD

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

EMAIL = EMAIL_ADDRESS
APP_PASSWORD = EMAIL_PASSWORD #generating an in app pass for Gmail for security


def send_email(
    to_email: str,
    subject: str,
    body: str
):

    message = MIMEMultipart()

    message["From"] = EMAIL
    message["To"] = to_email
    message["Subject"] = subject

    message.attach(
        MIMEText(body, "html")
    )

    server = smtplib.SMTP(
        SMTP_SERVER,
        SMTP_PORT
    )

    server.starttls()

    server.login(
        EMAIL_ADDRESS,
        EMAIL_PASSWORD
    )

    server.send_message(message)

    server.quit()
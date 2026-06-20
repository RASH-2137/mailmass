import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.config import (
    EMAIL_ADDRESS,
    EMAIL_PASSWORD
)

from app.email.providers.base import EmailProvider


SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587


class SMTPProvider(EmailProvider):

    def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str
    ):

        message = MIMEMultipart()

        message["From"] = EMAIL_ADDRESS
        message["To"] = to_email
        message["Subject"] = subject

        message.attach(
            MIMEText(html_content, "html")
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
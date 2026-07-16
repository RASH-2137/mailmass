from app.config import EMAIL_PROVIDER

from app.email.providers.smtp_provider import SMTPProvider
from app.email.providers.resend_provider import ResendProvider


if EMAIL_PROVIDER == "resend":
    provider = ResendProvider()
else:
    provider = SMTPProvider()

def send_email(
    to_email: str,
    subject: str,
    body: str
):
    return provider.send_email(
        to_email,
        subject,
        body
    )
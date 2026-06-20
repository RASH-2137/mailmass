from app.config import EMAIL_PROVIDER

from app.email.providers.smtp_provider import SMTPProvider
from app.email.providers.resend_provider import ResendProvider

print("EMAIL PROVIDER =", EMAIL_PROVIDER)

if EMAIL_PROVIDER == "resend":
    print("USING RESEND PROVIDER")
    provider = ResendProvider()
else:
    print("USING SMTP PROVIDER")
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
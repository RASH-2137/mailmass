import requests

from app.email.providers.base import EmailProvider

from app.config import (
    RESEND_API_KEY,
    FROM_EMAIL
)


class ResendProvider(EmailProvider):

    def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str
    ):

        response = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "from": FROM_EMAIL,
                "to": [to_email],
                "subject": subject,
                "html": html_content
            }
        )

        response.raise_for_status()

        return response.json()
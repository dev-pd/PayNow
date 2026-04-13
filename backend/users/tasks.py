from celery import shared_task
import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

@shared_task
def send_payment_confirmation_email(to_email, new_amount_paid):
    api_key = getattr(settings, "MAILGUN_API_KEY", "")
    domain = getattr(settings, "MAILGUN_DOMAIN", "")
    from_email = getattr(settings, "MAILGUN_FROM_EMAIL", "")

    if not api_key or not domain or not from_email:
        logger.error("Mailgun is not configured (MAILGUN_API_KEY/DOMAIN/FROM_EMAIL missing)")
        return "Mailgun is not configured"

    url = f"https://api.mailgun.net/v3/{domain}/messages"

    data = {
        "from": from_email,
        "to": to_email,
        "subject": 'Hello',
        "text": f'Your payment ${new_amount_paid} is successful!'
    }

    headers = {
        'Authorization': f'Basic {requests.auth._basic_auth_str("api", api_key)}'
    }

    response = requests.post(url, auth=("api", api_key), data=data, headers=headers)
    if response.status_code == 200:
        logger.info("Email sent successfully")
        return "Email sent successfully"
    else:
        logger.error(f"Failed to send email: {response.text}")
        return f"Failed to send email, status code: {response.status_code}"
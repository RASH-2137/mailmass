from fastapi import APIRouter
from fastapi import Request

router = APIRouter(
    prefix="/webhooks",
    tags=["Webhooks"]
)

@router.post("/resend")
async def resend_webhook(request: Request):

    payload = await request.json()

    print("WEBHOOK RECEIVED:")
    print(payload)

    return {
        "message": "Webhook received"
    }
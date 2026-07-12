"""add resend webhook fields

Revision ID: 66b77ab2992c
Revises: d3124a1ba0cd
Create Date: 2026-06-25 11:37:47.482604

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '66b77ab2992c'
down_revision: Union[str, Sequence[str], None] = 'd3124a1ba0cd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        "campaign_send_logs",
        sa.Column("provider_message_id", sa.String(), nullable=True)
    )

    op.add_column(
        "campaign_send_logs",
        sa.Column("delivered_at", sa.DateTime(), nullable=True)
    )

    op.add_column(
        "campaign_send_logs",
        sa.Column("bounced_at", sa.DateTime(), nullable=True)
    )

    op.add_column(
        "campaign_send_logs",
        sa.Column("bounce_reason", sa.String(), nullable=True)
    )

def downgrade():
    op.drop_column("campaign_send_logs", "bounce_reason")
    op.drop_column("campaign_send_logs", "bounced_at")
    op.drop_column("campaign_send_logs", "delivered_at")
    op.drop_column("campaign_send_logs", "provider_message_id")
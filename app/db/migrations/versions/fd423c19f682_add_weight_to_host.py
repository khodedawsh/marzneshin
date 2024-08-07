"""add weight to host

Revision ID: fd423c19f682
Revises: 35774c98f945
Create Date: 2024-08-07 19:04:35.197465

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "fd423c19f682"
down_revision = "35774c98f945"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "hosts",
        sa.Column("weight", sa.Integer(), nullable=False, server_default="1"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("hosts", "weight")
    # ### end Alembic commands ###

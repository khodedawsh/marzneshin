"""add node backends

Revision ID: 35774c98f945
Revises: c4fb5f6423a8
Create Date: 2024-08-01 08:29:56.436001

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "35774c98f945"
down_revision = "c4fb5f6423a8"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "backends",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=64), nullable=False),
        sa.Column("node_id", sa.Integer(), nullable=True),
        sa.Column("backend_type", sa.String(length=32), nullable=False),
        sa.Column("version", sa.String(length=32), nullable=True),
        sa.Column("running", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(
            ["node_id"],
            ["nodes.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_backends_node_id"), "backends", ["node_id"])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_backends_node_id"), table_name="backends")
    op.drop_table("backends")
    # ### end Alembic commands ###

"""add fragment settings and mux columns to hosts table

Revision ID: 74e234a3bd4b
Revises: e8325f600a49
Create Date: 2024-05-22 00:26:26.865255

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "74e234a3bd4b"
down_revision = "e8325f600a49"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "hosts",
        sa.Column(
            "mux", sa.Boolean(), server_default=sa.sql.true(), nullable=False
        ),
    )
    op.add_column("hosts", sa.Column("fragment", sa.JSON(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("hosts", "fragment")
    op.drop_column("hosts", "mux")
    # ### end Alembic commands ###

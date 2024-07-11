"""Add services and subscription url prefix to admins

Revision ID: 3acfdeb79b78
Revises: a83e4dd22672
Create Date: 2024-07-08 12:50:12.570534

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "3acfdeb79b78"
down_revision = "a83e4dd22672"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "admins_services",
        sa.Column("admin_id", sa.Integer(), nullable=False),
        sa.Column("service_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["admin_id"],
            ["admins.id"],
        ),
        sa.ForeignKeyConstraint(
            ["service_id"],
            ["services.id"],
        ),
        sa.PrimaryKeyConstraint("admin_id", "service_id"),
    )
    op.add_column(
        "admins",
        sa.Column(
            "all_services_access",
            sa.Boolean(),
            server_default=sa.sql.false(),
            nullable=False,
        ),
    )
    op.add_column(
        "admins",
        sa.Column(
            "modify_users_access",
            sa.Boolean(),
            server_default=sa.sql.false(),
            nullable=False,
        ),
    )
    op.add_column(
        "admins",
        sa.Column(
            "enabled",
            sa.Boolean(),
            server_default=sa.sql.true(),
            nullable=False,
        ),
    )
    op.add_column(
        "admins",
        sa.Column(
            "subscription_url_prefix",
            sa.String(length=256),
            nullable=False,
            server_default="",
        ),
    )


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("admins", "subscription_url_prefix")
    op.drop_column("admins", "all_services_access")
    op.drop_column("admins", "enabled")
    op.drop_column("admins", "modify_users_access")
    op.drop_table("admins_services")
    # ### end Alembic commands ###

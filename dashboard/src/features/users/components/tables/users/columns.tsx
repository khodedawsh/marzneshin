import {
    type UserType,
    OnlineStatus,
    UserUsedTraffic,
    UserActivatedPill,
    UserExpireStrategyPill,
    UserExpirationValue
} from "@marzneshin/features/users";
import { DataTableColumnHeader } from "@marzneshin/components/data-table/column-header";
import i18n from "@marzneshin/features/i18n";
import {
    CopyToClipboardButton,
    DataTableActionsCell,
    buttonVariants,
    NoPropogationButton,
} from "@marzneshin/components";
import { LinkIcon } from "lucide-react";
import { getSubscriptionLink } from "@marzneshin/utils";
import type { ColumnActions, ColumnDefWithSudoRole } from "@marzneshin/features/entity-table";

export const columns = (actions: ColumnActions<UserType>): ColumnDefWithSudoRole<UserType>[] => [
    {
        accessorKey: "username",
        header: ({ column }) => (
            <DataTableColumnHeader title={i18n.t("username")} column={column} />
        ),
        cell: ({ row }) => (
            <div className="flex flex-row gap-2 items-center">
                <OnlineStatus user={row.original} /> {row.original.username}
            </div>
        ),
    },
    {
        accessorKey: "activated",
        enableSorting: false,
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("activated")}
                column={column}
            />
        ),
        cell: ({ row }) => <UserActivatedPill user={row.original} />,
    },
    {
        accessorKey: "owner_username",
        enableSorting: false,
        sudoVisibleOnly: true,
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("owner")}
                column={column}
            />
        ),
    },
    {
        accessorKey: "used_traffic",
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("page.users.used_traffic")}
                column={column}
            />
        ),
        cell: ({ row }) => <UserUsedTraffic user={row.original} />,
    },
    {
        accessorKey: "expire_strategy",
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("page.users.expire_method")}
                column={column}
            />
        ),
        cell: ({ row }) => <UserExpireStrategyPill user={row.original} />,
        enableSorting: false,
    },
    {
        accessorKey: "expire_date",
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("page.users.expire_date")}
                column={column}
            />
        ),
        cell: ({ row }) => <UserExpirationValue user={row.original} />,
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <NoPropogationButton row={row} actions={actions}>
                <CopyToClipboardButton
                    text={getSubscriptionLink(row.original.subscription_url)}
                    successMessage={i18n.t(
                        "page.users.settings.subscription_link.copied",
                    )}
                    copyIcon={LinkIcon}
                    className={buttonVariants({
                        variant: "secondary",
                        className: "size-8",
                    })}
                    tooltipMsg={i18n.t("page.users.settings.subscription_link.copy")}
                />
                <DataTableActionsCell {...actions} row={row} />
            </NoPropogationButton>
        )
    }
];

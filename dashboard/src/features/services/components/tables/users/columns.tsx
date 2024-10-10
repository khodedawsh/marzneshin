import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@marzneshin/features/entity-table"
import i18n from "@marzneshin/features/i18n"
import {
    UserType,
    UserActivatedPill,
    UserUsedTraffic,
    UserExpirationValue,
    userTrafficSortingFn,
} from "@marzneshin/modules/users"

export const columns: ColumnDef<UserType>[] = [
    {
        accessorKey: "username",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('username')} column={column} />,
    },
    {
        accessorKey: "activated",
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("activated")}
                column={column}
            />
        ),
        cell: ({ row }) => <UserActivatedPill user={row.original} />,
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
        sortingFn: (rowA, rowB) => userTrafficSortingFn(rowA.original, rowB.original)
    },
    {
        accessorKey: "expire",
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("page.users.expire_date")}
                column={column}
            />
        ),
        cell: ({ row }) => <UserExpirationValue user={row.original} />,
    },
];

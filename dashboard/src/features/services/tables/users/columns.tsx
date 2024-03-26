import { ColumnDef } from "@tanstack/react-table"
import { UserType } from '@marzneshin/features/users'
import { DataTableColumnHeader } from "@marzneshin/components/data-table/column-header"
import i18n from "@marzneshin/features/i18n"
import { Badge } from "@marzneshin/components"

export const columns: ColumnDef<UserType>[] = [
    {
        accessorKey: "username",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('username')} column={column} />,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('status')} column={column} />,
        cell: ({ row }) => (
            <Badge className="py-1 px-2"> {row.original.status} </Badge>
        )
    },
    {
        accessorKey: 'services',
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('services')} column={column} />,
        cell: ({ row }) => row.original.services.length
    },
    {
        accessorKey: 'expire',
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('expire')} column={column} />,
        cell: ({ row }) => row.original.expire?.toString
    }
];

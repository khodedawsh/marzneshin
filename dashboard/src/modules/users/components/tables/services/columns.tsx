import { ColumnDef } from "@tanstack/react-table"
import {
    DataTableColumnHeader
} from "@marzneshin/features/entity-table"
import i18n from "@marzneshin/features/i18n"
import { Checkbox } from "@marzneshin/components"
import { ServiceType } from "@marzneshin/features/services"

export const columns: ColumnDef<ServiceType>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => {
                    table.toggleAllPageRowsSelected(!!value)
                }}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('name')} column={column} />,
    },
    {
        accessorKey: 'users',
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('users')} column={column} />,
        cell: ({ row }) => row.original.user_ids.length
    },
    {
        accessorKey: 'inbounds',
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('inbounds')} column={column} />,
        cell: ({ row }) => row.original.inbound_ids.length
    }
];

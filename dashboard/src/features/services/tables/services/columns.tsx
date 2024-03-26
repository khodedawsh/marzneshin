import { ColumnDef } from "@tanstack/react-table"
import { ServiceType } from "@marzneshin/features/services"
import { DataTableColumnHeader } from "@marzneshin/components/data-table/column-header"
import i18n from "@marzneshin/features/i18n"
import { DataTableActionsCell } from "@marzneshin/components"

interface ColumnAction {
    onDelete: (service: ServiceType) => void;
    onOpen: (node: ServiceType) => void;
    onEdit: (node: ServiceType) => void;
}


export const columns = (actions: ColumnAction): ColumnDef<ServiceType>[] => ([
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('name')} column={column} />,
    },
    {
        accessorKey: "users",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('users')} column={column} />,
        cell: ({ row }) => `${row.original.users.length}`
    },
    {
        accessorKey: "inbounds",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('inbounds')} column={column} />,
        cell: ({ row }) => `${row.original.inbounds.length}`
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableActionsCell {...actions} row={row} />
    },
]);

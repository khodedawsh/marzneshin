
import { ColumnDef } from "@tanstack/react-table"
import { InboundType } from "@marzneshin/features/inbounds"
import { DataTableColumnHeader } from "@marzneshin/components/data-table/column-header"
import i18n from "@marzneshin/features/i18n"
import { Badge, Checkbox } from "@marzneshin/components"

export const columns: ColumnDef<InboundType>[] = [
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
        accessorKey: "tag",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('tag')} column={column} />,
    },
    {
        accessorKey: 'protocol',
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('protocol')} column={column} />,
        cell: ({ row }) => (
            <Badge className="py-1 px-2"> {row.original.protocol} </Badge>
        )
    },
    {
        accessorKey: 'node',
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('nodes')} column={column} />,
        cell: ({ row }) => (
            <Badge className="py-1 px-2"> {row.original.node.name} </Badge>
        )
    }
];

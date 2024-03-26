import {
    ColumnDef,
    ColumnFiltersState,
    OnChangeFn,
    RowSelectionState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Button,
    Input,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@marzneshin/components"

import { useTranslation } from "react-i18next"
import { DataTablePagination } from "./pagination"
import { useState } from "react"
import { DataTableViewOptions } from "./table-view-option"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filteredColumn: string
    onCreate?: () => void
    onOpen?: (object: TData) => void
    setSelectedRow?: OnChangeFn<RowSelectionState> | undefined
    selectedRow?: RowSelectionState | undefined
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onCreate,
    onOpen,
    filteredColumn,
    selectedRow,
    setSelectedRow,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setSelectedRow,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection: selectedRow !== undefined ? selectedRow : {},
        },
    })
    const { t } = useTranslation();
    return (
        <div>
            <div className="flex items-center py-4">
                <Input
                    placeholder={t('table.filter-placeholder', { name: filteredColumn })}
                    value={(table.getColumn(filteredColumn)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(filteredColumn)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DataTableViewOptions table={table} />
                {onCreate && (<Button onClick={onCreate}>{t('create')}</Button>)}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={() => onOpen !== undefined && onOpen(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {t('table.no-result')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <DataTablePagination table={table} />
            </div>
        </div>
    )
}

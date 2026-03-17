import type { ColumnDef } from "@tanstack/react-table"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
} from "@tanstack/react-table"
import * as React from "react"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableSkeleton } from "./data-table-skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    isLoading?: boolean
    footer?: React.ReactNode
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isLoading,
    footer,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
        },
    })

    if (isLoading) {
        return <DataTableSkeleton columns={columns} />
    }

    return (
        <div className="overflow-x-auto no-scrollbar rounded-md border">
            <Table className="border-b bg-card">
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
                                className="cursor-pointer h-[40px]"
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
                            <TableCell colSpan={columns.length} className="h-[240px] text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                {footer}
            </Table>
            <DataTablePagination table={table} />
        </div>
    )
}
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DataTablePaginationSkeleton } from "./data-table-pagination-skeleton"
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

interface DataTableSkeletonProps {
    columns: ColumnDef<any, any>[]
    rowCount?: number
}

export function DataTableSkeleton({
    columns,
    rowCount = 10,
}: DataTableSkeletonProps) {

    return (
        <div className="rounded-md border">
            <Table className="border-b">
                <TableHeader>
                    <TableRow className="h-[40px]">
                        {columns.map((column, i) => (
                            <TableHead key={i}>
                                {column.id === "select" ? (
                                    <Checkbox disabled />
                                ) : typeof column.header === "string" ? (
                                    column.header
                                ) : (
                                    <Skeleton className="h-4 w-[80px]" />
                                )}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: rowCount }).map((_, i) => (
                        <TableRow key={i} className="h-[40px]">
                            {columns.map((column, j) => (
                                <TableCell key={j}>
                                    {column.id === "select" ? (
                                        <Checkbox disabled />
                                    ) : (
                                        <Skeleton className="h-4 w-full" />
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <DataTablePaginationSkeleton />
        </div>
    )
}

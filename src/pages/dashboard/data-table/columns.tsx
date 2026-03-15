import { formatDate } from "@/lib/utils"
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { UserRoundPen, MoveUpRight, MoveDownLeft, IterationCw } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Transaction = {
    id: string
    processId: number
    processStatus: string
    createdBy: string
    referenceNo: string
    documentNo: string
    createdAt: string
    updatedAt: string
    transactionType: string
    description: string
    documentDate: string
    accountingPeriod: string
    status?: string
    email?: string
    amount?: number
}


export const columns: ColumnDef<Transaction>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
        accessorKey: "processId",
        header: "Process ID",
        cell: ({ row }) => {
            const processId = row.getValue("processId") as number
            return (
                <p className="font-light opacity-70">
                    {processId}
                </p>
            )
        }

    },
    {
        accessorKey: "processStatus",
        header: "Process Status",
        cell: ({ row }) => {
            const status = row.getValue("processStatus") as string
            const statusSuffix = status.split("_")[1]
            const variant =
                statusSuffix === "CREATED"
                    ? "default"
                    : statusSuffix === "APPROVED"
                        ? "secondary"
                        : statusSuffix === "ACCEPTED"
                            ? "secondary"
                            : statusSuffix === "REJECTED"
                                ? "destructive"
                                : "default"
            return (
                <Badge variant={variant}>
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "createdBy",
        header: "Created By",
        cell: ({ row }) => {
            const createdBy = row.getValue("createdBy") as string
            return (
                <Badge variant="secondary">
                    <UserRoundPen />
                    {createdBy}
                </Badge>
            )
        }
    },
    {
        accessorKey: "referenceNo",
        header: "Reference No",
        cell: ({ row }) => {
            const referenceNo = row.getValue("referenceNo") as string
            return (
                <p className="font-light opacity-70">
                    {referenceNo}
                </p>
            )
        }
    },
    {
        accessorKey: "documentNo",
        header: "Document No",
        cell: ({ row }) => {
            const documentNo = row.getValue("documentNo") as string
            return (
                <p className="font-light opacity-70">
                    {documentNo}
                </p>
            )
        }
    },
    {
        accessorKey: "transactionType",
        header: "Transaction Type",
        cell: ({ row }) => {
            const transactionType = row.getValue("transactionType") as string
            const variant =
                transactionType === "EXP"
                    ? <MoveUpRight />
                    : transactionType === "INC"
                        ? <MoveDownLeft />
                        : transactionType === "TRF"
                            ? <IterationCw />
                            : "default"
            return (
                <Badge variant="secondary">
                    {variant}
                    {transactionType}
                </Badge>
            )
        }
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => <Badge variant="secondary">
            {formatDate(row.getValue("createdAt"))}
        </Badge>,
        enableColumnFilter: true,
    },
    {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => <Badge variant="secondary">
            {formatDate(row.getValue("updatedAt"))}
        </Badge>,
    },
]

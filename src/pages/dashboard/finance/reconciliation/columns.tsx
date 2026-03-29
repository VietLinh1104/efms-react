import type { ColumnDef } from "@tanstack/react-table";
import type { BankTransactionResponse } from "@/api/generated/core";
import { Badge } from "@components/ui/badge.tsx";
import { Button } from "@components/ui/button.tsx";
import { Link } from "react-router-dom";
import { FileSearch, Unlink } from "lucide-react";

const formatDate = (dateStr?: string) => {
    if (!dateStr) return "---";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(dateStr));
};

const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "---";
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
};

export function getColumns(onUnmatch: (row: BankTransactionResponse) => void): ColumnDef<BankTransactionResponse>[] {
    return [
        {
            accessorKey: "transactionDate",
            header: "Ngày sao kê",
            cell: ({ row }) => <span>{formatDate(row.original.transactionDate)}</span>,
        },
        {
            accessorKey: "description",
            header: "Diễn giải",
            cell: ({ row }) => (
                <span className="max-w-[300px] truncate" title={row.original.description}>
                    {row.original.description || "---"}
                </span>
            ),
        },
        {
            accessorKey: "bankAmount", // Actually amount from bank side
            header: "Số tiền NH",
            cell: ({ row }) => (
                <span className={`font-medium ${row.original.type === 'in' ? 'text-green-600' : 'text-orange-600'}`}>
                    {formatCurrency(row.original.amount)}
                </span>
            ),
        },
        {
            id: "systemAmount",
            header: "Số tiền HT",
            cell: ({ row }) => (
                <span className="text-muted-foreground italic">
                    {row.original.isReconciled ? formatCurrency(row.original.amount) : "---"}
                </span>
            ),
        },
        {
            accessorKey: "isReconciled",
            header: "Trạng thái",
            cell: ({ row }) => (
                <Badge
                    variant={row.original.isReconciled ? "default" : "secondary"}
                    className={row.original.isReconciled ? "bg-green-100 text-green-800 border-none px-2" : "border-none px-2"}
                >
                    {row.original.isReconciled ? "Khớp" : "Chưa khớp"}
                </Badge>
            ),
        },
        {
            accessorKey: "journalEntryId",
            header: "Chứng từ KT",
            cell: ({ row }) => row.original.journalEntryId ? (
                <Link
                    to={`/accounting/journal/${row.original.journalEntryId}`}
                    className="flex items-center gap-1.5 text-blue-600 hover:underline font-mono text-xs"
                >
                    <FileSearch className="h-3 w-3" />
                    {row.original.journalEntryId.substring(0, 8)}...
                </Link>
            ) : "---",
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => row.original.isReconciled && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    title="Gỡ liên kết (Un-match)"
                    onClick={() => onUnmatch(row.original)}
                >
                    <Unlink className="h-4 w-4" />
                </Button>
            ),
        },
    ];
}

import type { ColumnDef } from "@tanstack/react-table";
import type { BankTransactionResponse } from "@/api/generated/api.ts";
import { Badge } from "@components/ui/badge.tsx";
import { Button } from "@components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu.tsx";
import { MoreHorizontal, Trash2 } from "lucide-react";

const formatDate = (d?: string) => {
    if (!d) return "---";
    return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(d));
};

const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "---";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

export function getColumns(
    onDelete: (row: BankTransactionResponse) => void,
): ColumnDef<BankTransactionResponse>[] {
    return [
        {
            accessorKey: "transactionDate",
            header: "Ngày",
            cell: ({ row }) => (
                <span className="text-sm whitespace-nowrap">{formatDate(row.original.transactionDate)}</span>
            ),
        },
        {
            accessorKey: "bankAccountName",
            header: "TK Ngân hàng",
            cell: ({ row }) => (
                <span className="text-sm font-medium">{row.original.bankAccountName || "---"}</span>
            ),
        },
        {
            accessorKey: "description",
            header: "Mô tả",
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground max-w-[220px] block truncate">
                    {row.original.description || "---"}
                </span>
            ),
        },
        {
            accessorKey: "type",
            header: "Loại",
            cell: ({ row }) => {
                const isIn = row.original.type?.toLowerCase() === "in";
                return (
                    <Badge className={`border-none font-medium ${
                        isIn
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                    }`}>
                        {isIn ? "Thu vào" : "Chi ra"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "amount",
            header: "Số tiền",
            cell: ({ row }) => {
                const isIn = row.original.type?.toLowerCase() === "in";
                return (
                    <span className={`text-sm font-semibold ${isIn ? "text-green-700" : "text-orange-700"}`}>
                        {formatCurrency(row.original.amount)}
                    </span>
                );
            },
        },
        {
            accessorKey: "reference",
            header: "Tham chiếu",
            cell: ({ row }) => (
                <span className="font-mono text-xs text-muted-foreground">
                    {row.original.reference || "---"}
                </span>
            ),
        },
        {
            accessorKey: "isReconciled",
            header: "Đối chiếu",
            cell: ({ row }) => (
                row.original.isReconciled ? (
                    <Badge className="bg-blue-100 text-blue-800 border-none hover:bg-blue-200">Đã khớp</Badge>
                ) : (
                    <Badge variant="secondary" className="text-muted-foreground">Chưa khớp</Badge>
                )
            ),
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => {
                const tx = row.original;
                const canDelete = !tx.isReconciled;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => onDelete(tx)}
                                disabled={!canDelete}
                                className={canDelete ? "text-destructive" : "text-muted-foreground"}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {canDelete ? "Xóa giao dịch" : "Đã đối chiếu (không xóa)"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}

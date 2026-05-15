import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@components/ui/badge.tsx"
import { MoreHorizontal, Eye } from "lucide-react"
import type { JournalEntryResponse } from "@/api/generated/core"
import { Button } from "@components/ui/button.tsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu.tsx"

const formatDate = (dateStr: string) => {
    if (!dateStr) return "---";
    return new Intl.DateTimeFormat("vi-VN").format(new Date(dateStr));
};

const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "---";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(dateStr));
};

const formatCurrency = (value: number) =>
    value > 0
        ? new Intl.NumberFormat("vi-VN", { style: "decimal" }).format(value)
        : "—";

const getStatusBadge = (status: string) => {
    switch (status) {
        case "posted":   return <Badge variant="default">Đã ghi sổ</Badge>;
        case "draft":    return <Badge variant="secondary">Nháp</Badge>;
        case "cancelled": return <Badge variant="destructive">Đã huỷ</Badge>;
        default:         return <Badge variant="outline">{status}</Badge>;
    }
};

const getSourceLabel = (source: string | undefined) => {
    switch (source) {
        case "invoice":  return <Badge variant="outline" className="text-blue-500 border-blue-500/40">Hóa đơn</Badge>;
        case "payment":  return <Badge variant="outline" className="text-green-500 border-green-500/40">Thanh toán</Badge>;
        case "manual":   return <Badge variant="outline" className="text-amber-500 border-amber-500/40">Thủ công</Badge>;
        default:         return <Badge variant="outline" className="text-muted-foreground">Hệ thống</Badge>;
    }
};

export const getColumns = (
    onView: (journal: JournalEntryResponse) => void,
): ColumnDef<JournalEntryResponse>[] => [
    {
        accessorKey: "entryDate",
        header: "Ngày bút toán",
        cell: ({ row }) => (
            <span className="font-medium">{formatDate(row.getValue("entryDate"))}</span>
        ),
    },
    {
        accessorKey: "reference",
        header: "Tham chiếu",
        cell: ({ row }) => (
            <div className="max-w-[130px] truncate font-mono text-sm">
                {row.getValue("reference") || "—"}
            </div>
        ),
    },
    {
        accessorKey: "source",
        header: "Nguồn",
        cell: ({ row }) => getSourceLabel(row.getValue("source")),
    },
    {
        accessorKey: "description",
        header: "Mô tả",
        cell: ({ row }) => (
            <div className="max-w-[260px] truncate text-muted-foreground text-sm">
                {row.getValue("description") || "—"}
            </div>
        ),
    },
    {
        id: "totalDebit",
        header: () => <div className="text-right">Tổng ghi Nợ</div>,
        cell: ({ row }) => {
            const total = row.original.lines?.reduce(
                (sum, line) => sum + (Number(line.debit) || 0), 0
            ) ?? 0;
            return (
                <div className="text-right font-semibold tabular-nums">
                    {formatCurrency(total)}
                </div>
            );
        },
    },
    {
        id: "totalCredit",
        header: () => <div className="text-right">Tổng ghi Có</div>,
        cell: ({ row }) => {
            const total = row.original.lines?.reduce(
                (sum, line) => sum + (Number(line.credit) || 0), 0
            ) ?? 0;
            return (
                <div className="text-right font-semibold tabular-nums">
                    {formatCurrency(total)}
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
        accessorKey: "createdAt",
        header: "Thời gian tạo",
        cell: ({ row }) => (
            <span className="text-muted-foreground text-sm">
                {formatDateTime(row.getValue("createdAt"))}
            </span>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const journal = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onView(journal)}>
                            <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

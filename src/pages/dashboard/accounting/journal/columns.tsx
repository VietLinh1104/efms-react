import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@components/ui/badge.tsx"
import { MoreHorizontal, Eye, Trash2, CheckCircle2 } from "lucide-react"
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
import { Checkbox } from "@components/ui/checkbox.tsx";

const formatDate = (dateStr: string) => {
    if (!dateStr) return "---";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("vi-VN").format(date);
};

const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "---";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

export const getColumns = (
    onView: (journal: JournalEntryResponse) => void,
    onDelete: (journal: JournalEntryResponse) => void,
    onPost: (journal: JournalEntryResponse) => void
): ColumnDef<JournalEntryResponse>[] => [
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
            accessorKey: "entryDate",
            header: "Ngày",
            cell: ({ row }) => formatDate(row.getValue("entryDate")),
        },
        {
            accessorKey: "reference",
            header: "Tham chiếu",
            cell: ({ row }) => <div className="max-w-[120px] truncate">{row.getValue("reference") || "---"}</div>,
        },
        {
            accessorKey: "description",
            header: "Mô tả",
            cell: ({ row }) => <div className="max-w-[250px] truncate text-muted-foreground">{row.getValue("description") || "---"}</div>,
        },
        {
            id: "totalDebit",
            header: "Tổng ghi nợ",
            cell: ({ row }) => {
                const journal = row.original;
                const total = journal.lines?.reduce((sum, line) => sum + (line.debit || 0), 0) || 0;
                return <div className="font-semibold text-right">{total.toLocaleString()}</div>;
            },
        },
        {
            id: "totalCredit",
            header: "Tổng ghi có",
            cell: ({ row }) => {
                const journal = row.original;
                const total = journal.lines?.reduce((sum, line) => sum + (line.credit || 0), 0) || 0;
                return <div className="font-semibold text-right">{total.toLocaleString()}</div>;
            },
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
                let label = status;

                switch (status) {
                    case "posted":
                        variant = "default";
                        label = "Posted";
                        break;
                    case "draft":
                        variant = "secondary";
                        label = "Draft";
                        break;
                    case "cancelled":
                        variant = "destructive";
                        label = "Cancelled";
                        break;
                }

                return <Badge variant={variant}>{label}</Badge>;
            },
        },
        {
            accessorKey: "createdBy",
            header: "Người tạo",
            cell: ({ row }) => <div className="text-sm">{row.getValue("createdBy") || "System"}</div>,
        },
        {
            accessorKey: "createdAt",
            header: "Ngày tạo",
            cell: ({ row }) => formatDateTime(row.getValue("createdAt")),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const journal = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onView(journal)}>
                                <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                            </DropdownMenuItem>
                            {journal.status === "draft" && (
                                <>
                                    <DropdownMenuItem onClick={() => onPost(journal)}>
                                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Ghi sổ (Post)
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => onDelete(journal)}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" /> Xoá
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

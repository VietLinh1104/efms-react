import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@components/ui/badge.tsx";
import { MoreHorizontal, Eye, Trash2, Edit } from "lucide-react";
import type { InvoiceResponse } from "@/api/generated/core";
import { Button } from "@components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu.tsx";
import { Checkbox } from "@components/ui/checkbox.tsx";

const formatDate = (dateStr?: string) => {
    if (!dateStr) return "---";
    return new Intl.DateTimeFormat("vi-VN").format(new Date(dateStr));
};

const formatCurrency = (amount?: number, currency = "VND") => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: currency,
    }).format(amount || 0);
};

export const getColumns = (
    onView: (invoice: InvoiceResponse) => void,
    onEdit: (invoice: InvoiceResponse) => void,
    onDelete: (invoice: InvoiceResponse) => void,
): ColumnDef<InvoiceResponse>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
            accessorKey: "invoiceNumber",
            header: "Số HĐ",
            cell: ({ row }) => <div className="">{row.getValue("invoiceNumber") || "DRAFT"}</div>,
        },
        {
            accessorKey: "invoiceType",
            header: "Loại",
            cell: ({ row }) => {
                const type = row.getValue("invoiceType") as string;
                return (
                    <Badge variant={type === "AR" ? "default" : "outline"} className="font-medium">
                        {type === "AR" ? "HĐ Bán (AR)" : "HĐ Mua (AP)"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "invoiceDate",
            header: "Ngày HĐ",
            cell: ({ row }) => <div>{formatDate(row.getValue("invoiceDate"))}</div>,
        },
        {
            accessorKey: "partnerName",
            header: "Đối tác",
            cell: ({ row }) => <div className="max-w-[180px] truncate font-medium">{row.getValue("partnerName") || "---"}</div>,
        },
        {
            accessorKey: "totalAmount",
            header: () => <div className="text-right">Tổng tiền</div>,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("totalAmount"));
                return <div className="text-right font-semibold">{formatCurrency(amount, row.original.currencyCode)}</div>;
            },
        },
        {
            id: "remaining",
            header: () => <div className="text-right">Còn nợ</div>,
            cell: ({ row }) => {
                const total = row.original.totalAmount || 0;
                const paid = row.original.paidAmount || 0;
                const remaining = total - paid;
                return (
                    <div className={`text-right`}>
                        {formatCurrency(remaining, row.original.currencyCode)}
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                const statusStyles: Record<string, string> = {
                    draft: "bg-gray-100 text-gray-800",
                    open: "bg-blue-100 text-blue-800",
                    paid: "bg-green-100 text-green-800",
                    cancelled: "bg-red-100 text-red-800",
                    partial: "bg-yellow-100 text-yellow-800",
                };
                return (
                    <Badge className={`${statusStyles[status] || ""} border-none capitalize`}>
                        {status || "N/A"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "approvalStatus",
            header: "Phê duyệt",
            cell: ({ row }) => {
                const status = row.getValue("approvalStatus") as string;
                const isAR = row.original.invoiceType === "AR";
                
                if (isAR) {
                    return <span className="text-muted-foreground text-xs pl-4">—</span>;
                }

                const statusStyles: Record<string, string> = {
                    pending: "bg-amber-100 text-amber-800 hover:bg-amber-200",
                    approved: "bg-green-100 text-green-800 hover:bg-green-200",
                    rejected: "bg-red-100 text-red-800 hover:bg-red-200",
                };

                const labels: Record<string, string> = {
                    pending: "Chờ duyệt",
                    approved: "Đã duyệt",
                    rejected: "Từ chối",
                };

                return (
                    <Badge className={`${statusStyles[status] || "bg-gray-100 text-gray-800"} border-none`}>
                        {labels[status] || status || "Chờ duyệt"}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const invoice = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onView(invoice)}>
                                <Eye className="mr-2 h-4 w-4" />Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(invoice)}
                                className=""
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Hủy/Xóa
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
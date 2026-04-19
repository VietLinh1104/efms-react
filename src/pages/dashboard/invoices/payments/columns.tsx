import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@components/ui/badge.tsx";
import { MoreHorizontal, Eye, Trash2, Edit } from "lucide-react";
import type { PaymentResponse } from "@/api/generated/core";
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
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(new Date(dateStr));
};

const formatCurrency = (amount?: number, currencyCode = "VND") => {
    if (amount === undefined || amount === null) return "---";
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: currencyCode || "VND",
    }).format(amount);
};

export const getColumns = (
    onView: (payment: PaymentResponse) => void,
    onEdit: (payment: PaymentResponse) => void,
    onDelete: (payment: PaymentResponse) => void,
): ColumnDef<PaymentResponse>[] => [
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
            accessorKey: "paymentDate",
            header: "Ngày thanh toán",
            cell: ({ row }) => <div>{formatDate(row.getValue("paymentDate"))}</div>,
        },
        {
            accessorKey: "paymentType",
            header: "Loại",
            cell: ({ row }) => {
                const type = row.getValue("paymentType") as string;
                // Based on typical system type design: in -> receipt, out -> expenditure
                const isReceipt = type?.toLowerCase() === "in";
                return (
                    <Badge variant={isReceipt ? "default" : "secondary"} className={`font-medium`}>
                        {isReceipt ? "Thu (In)" : "Chi (Out)"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "partnerName",
            header: "Đối tác",
            cell: ({ row }) => <div className="max-w-[180px] truncate font-medium">{row.getValue("partnerName") || "---"}</div>,
        },
        {
            accessorKey: "amount",
            header: () => <div className="text-right">Số tiền</div>,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("amount"));
                return <div className="text-right">{formatCurrency(amount, row.original.currencyCode)}</div>;
            },
        },
        {
            accessorKey: "paymentMethod",
            header: "Phương thức",
            cell: ({ row }) => {
                const method = (row.getValue("paymentMethod") as string) || "---";
                return <div className="capitalize">{method.toUpperCase()}</div>;
            },
        },
        {
            accessorKey: "reference",
            header: "Tham chiếu",
            cell: ({ row }) => <div className="max-w-[120px] truncate text-muted-foreground">{row.getValue("reference") || "---"}</div>,
        },
        {
            accessorKey: "journalEntryId",
            header: "Trạng thái",
            cell: ({ row }) => {
                const isPosted = !!row.getValue("journalEntryId");
                return (
                    <Badge variant={isPosted ? "default" : "outline"} className={`border-none ${isPosted ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : "bg-gray-100 text-gray-800"}`}>
                        {isPosted ? "Đã ghi sổ" : "Nháp"}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const payment = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onView(payment)}>
                                <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(payment)} disabled={!!payment.journalEntryId}>
                                <Edit className="mr-2 h-4 w-4" /> {payment.journalEntryId ? "Khóa sửa" : "Chỉnh sửa"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(payment)}
                                className="text-destructive focus:text-destructive"
                                disabled={!!payment.journalEntryId}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Hủy/Xóa
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
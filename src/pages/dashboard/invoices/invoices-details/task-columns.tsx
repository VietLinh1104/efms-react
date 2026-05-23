import type { ColumnDef } from "@tanstack/react-table";
import type { InvoiceResponse } from "@/api/generated/core";
import { Button } from "@components/ui/button.tsx";
import { Badge } from "@/components/ui/badge";

type TaskInvoiceResponse = InvoiceResponse & {};

export function getTasksColumns(
    navigate: (path: string) => void,
    error: (msg: string) => void
): ColumnDef<TaskInvoiceResponse>[] {
    return [
        {
            accessorKey: "invoiceNumber",
            header: "Số hóa đơn",
            cell: ({ row }) => <div>{row.original.invoiceNumber || "DRAFT"}</div>,
        },
        {
            accessorKey: "partner",
            header: "Đối tác",
            cell: ({ row }) => <div>{row.original.partnerName || "---"}</div>,
        },
        {
            accessorKey: "totalAmount",
            header: () => <div className="text-right">Tổng tiền</div>,
            cell: ({ row }) => {
                const amt = row.original.totalAmount || 0;
                return (
                    <div className="text-right font-medium">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: row.original.currencyCode || "VND" }).format(amt)}
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => {
                const status = row.original?.approvalStatus || "pending";
                return <Badge className="uppercase" variant="secondary">{status}</Badge>;
            },
        },
        {
            id: "actions",
            header: () => <div className="text-center">Thao tác</div>,
            cell: ({ row }) => {
                const invoice = row.original;
                return (
                    <div className="flex justify-center">
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-none"
                            onClick={() => {
                                if (invoice?.id) {
                                    navigate(`/invoices/${invoice.id}`);
                                } else {
                                    error("Tác vụ không có ID hóa đơn hợp lệ.");
                                }
                            }}
                        >
                            Chi tiết
                        </Button>
                    </div>
                );
            },
        },
    ];
}

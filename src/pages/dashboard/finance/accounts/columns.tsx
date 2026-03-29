import type { ColumnDef } from "@tanstack/react-table";
import type { BankAccountResponse } from "@/api/generated/core";
import { Badge } from "@components/ui/badge.tsx";
import { Button } from "@components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu.tsx";
import { MoreHorizontal, Pencil, PowerOff, Power } from "lucide-react";

const accountTypeLabel: Record<string, string> = {
    checking: "Ngân hàng",
    savings: "Tiết kiệm",
    cash: "Tiền mặt",
};

const formatCurrency = (amount?: number, code = "VND") => {
    if (amount === undefined || amount === null) return "---";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: code || "VND" }).format(amount);
};

export function getColumns(
    onEdit: (row: BankAccountResponse) => void,
    onToggleActive: (row: BankAccountResponse) => void,
): ColumnDef<BankAccountResponse>[] {
    return [
        {
            accessorKey: "name",
            header: "Tên TK",
            cell: ({ row }) => (
                <div>
                    <p className="font-medium">{row.original.name}</p>
                    {row.original.bankName && (
                        <p className="text-xs text-muted-foreground">{row.original.bankName}</p>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "accountNumber",
            header: "Số tài khoản",
            cell: ({ row }) => (
                <span className="font-mono text-sm">
                    {row.original.accountNumber || "---"}
                </span>
            ),
        },
        {
            accessorKey: "type",
            header: "Loại",
            cell: ({ row }) => {
                const t = row.original.type || "";
                return (
                    <Badge variant="outline">
                        {accountTypeLabel[t.toLowerCase()] ?? t}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "currencyCode",
            header: "Tiền tệ",
            cell: ({ row }) => (
                <Badge variant="secondary">{row.original.currencyCode || "VND"}</Badge>
            ),
        },
        {
            accessorKey: "openingBalance",
            header: "Số dư đầu kỳ",
            cell: ({ row }) => formatCurrency(row.original.openingBalance, row.original.currencyCode),
        },
        {
            accessorKey: "glAccountCode",
            header: "TK kế toán",
            cell: ({ row }) => (
                <span className="font-mono text-xs text-muted-foreground">
                    {row.original.glAccountCode || "---"}
                </span>
            ),
        },
        {
            accessorKey: "isActive",
            header: "Trạng thái",
            cell: ({ row }) => (
                row.original.isActive ? (
                    <Badge className="bg-green-100 text-green-800 border-none hover:bg-green-200">Hoạt động</Badge>
                ) : (
                    <Badge variant="secondary" className="text-muted-foreground">Vô hiệu</Badge>
                )
            ),
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => {
                const account = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(account)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onToggleActive(account)}
                                className={account.isActive ? "text-destructive" : "text-green-600"}
                            >
                                {account.isActive ? (
                                    <><PowerOff className="mr-2 h-4 w-4" /> Vô hiệu hóa</>
                                ) : (
                                    <><Power className="mr-2 h-4 w-4" /> Kích hoạt</>
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}

import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Power } from "lucide-react"
import type { AccountResponse } from "@/api/generated"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const getColumns = (
    onEdit: (account: AccountResponse) => void,
    onToggleActive: (account: AccountResponse) => void
): ColumnDef<AccountResponse>[] => [
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
        accessorKey: "code",
        header: "Mã TK",
        cell: ({ row }) => <div className="font-medium">{row.getValue("code")}</div>,
    },
    {
        accessorKey: "name",
        header: "Tên tài khoản",
        cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "type",
        header: "Loại",
        cell: ({ row }) => {
            const type = row.getValue("type") as string;
            return (
                <Badge variant="outline" className="capitalize">
                    {type}
                </Badge>
            );
        },
    },
    {
        accessorKey: "balanceType",
        header: "Số dư",
        cell: ({ row }) => {
            const balanceType = row.getValue("balanceType") as string;
            return (
                <Badge 
                    variant={balanceType === "debit" ? "default" : "secondary"}
                    className="capitalize"
                >
                    {balanceType}
                </Badge>
            );
        },
    },
    {
        accessorKey: "parentName",
        header: "Tài khoản cha",
        cell: ({ row }) => (
            <div className="text-muted-foreground text-sm">
                {row.getValue("parentName") || "---"}
            </div>
        ),
    },
    {
        accessorKey: "isActive",
        header: "Trạng thái",
        cell: ({ row }) => {
            const isActive = row.getValue("isActive") as boolean;
            return (
                <div className="flex items-center gap-2 text-sm">
                    <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span>
                        {isActive ? "Hoạt động" : "Tắt"}
                    </span>
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const account = row.original;

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
                        <DropdownMenuItem onClick={() => onEdit(account)}>
                            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleActive(account)}>
                            <Power className="mr-2 h-4 w-4" /> 
                            {account.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

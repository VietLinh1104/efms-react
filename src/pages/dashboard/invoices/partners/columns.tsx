import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@components/ui/badge.tsx"
import { MoreHorizontal, Eye, Trash2, UserCog } from "lucide-react"
import type { PartnerResponse } from "@/api/generated/core"
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

const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "---";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

export const getColumns = (
    onView: (partner: PartnerResponse) => void,
    onEdit: (partner: PartnerResponse) => void, // Thay onPost bằng onEdit cho hợp lý với Partner
    onDelete: (partner: PartnerResponse) => void,
): ColumnDef<PartnerResponse>[] => [
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
            accessorKey: "name",
            header: "Tên đối tác",
            cell: ({ row }) => <div className="font-semibold max-w-[200px]">{row.getValue("name") || "---"}</div>,
        },
        {
            accessorKey: "type",
            header: "Loại",
            cell: ({ row }) => {
                const type = row.getValue("type") as string;
                return <Badge variant="outline" className="capitalize">{type || "N/A"}</Badge>;
            },
        },
        {
            accessorKey: "taxCode",
            header: "Mã số thuế",
            cell: ({ row }) => <div>{row.getValue("taxCode") || "---"}</div>,
        },
        {
            accessorKey: "phone",
            header: "Điện thoại",
            cell: ({ row }) => <div className="text-sm">{row.getValue("phone") || "---"}</div>,
        },
        {
            accessorKey: "isActive",
            header: "Trạng thái",
            cell: ({ row }) => {
                const isActive = row.getValue("isActive") as boolean;
                return (
                    <Badge variant={isActive ? "default" : "secondary"}>
                        {isActive ? "Đang hoạt động" : "Ngừng dùng"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "arAccountCode",
            header: "TK Phải thu",
            cell: ({ row }) => <div className="text-xs font-mono">{row.getValue("arAccountCode") || "---"}</div>,
        },
        {
            accessorKey: "apAccountCode",
            header: "TK Phải trả",
            cell: ({ row }) => <div className="text-xs font-mono">{row.getValue("apAccountCode") || "---"}</div>,
        },
        {
            accessorKey: "createdAt",
            header: "Ngày tạo",
            cell: ({ row }) => formatDateTime(row.getValue("createdAt")),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const partner = row.original;

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
                            <DropdownMenuItem onClick={() => onView(partner)}>
                                <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(partner)}>
                                <UserCog className="mr-2 h-4 w-4" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(partner)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Xoá đối tác
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
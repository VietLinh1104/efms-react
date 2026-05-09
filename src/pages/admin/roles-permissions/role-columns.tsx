import type { ColumnDef } from "@tanstack/react-table";
import type { RoleResponse } from "@/api/generated/identity/api";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const getRoleColumns = (
    onEdit: (role: RoleResponse) => void,
    onDelete: (role: RoleResponse) => void
): ColumnDef<RoleResponse>[] => [
        {
            accessorKey: "name",
            header: "Tên vai trò",
            cell: ({ row }) => <Badge variant="outline" >
                {row.original.name}
            </Badge>,
        },
        {
            accessorKey: "description",
            header: "Mô tả",
            cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.description || "---"}</span>,
        },
        {
            accessorKey: "permissions",
            header: "Số lượng quyền",
            cell: ({ row }) => <Badge variant="secondary">{row.original.permissions?.length || 0} quyền</Badge>,
        },
        {
            accessorKey: "isActive",
            header: "Trạng thái",
            cell: ({ row }) => (
                row.original.isActive ? (
                    <Badge variant="outline" >
                        <div className="bg-green-600 w-2 h-2 rounded-full mr-2"></div>
                        Hoạt động
                    </Badge>
                ) : (
                    <Badge variant="outline" >
                        <div className="bg-red-600 w-2 h-2 rounded-full mr-2"></div>
                        Tạm ngưng
                    </Badge>
                )
            ),
        },
        {
            id: "actions",
            header: () => <div className="text-center">Thao tác</div>,
            cell: ({ row }) => {
                const role = row.original;
                return (
                    <div className="flex justify-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => onEdit(role)}>
                                    <Edit className="mr-2 h-4 w-4 " /> Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => onDelete(role)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> Xóa vai trò
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

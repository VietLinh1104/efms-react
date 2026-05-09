import type { ColumnDef } from "@tanstack/react-table";
import type { UserResponse } from "@/api/generated/identity/api";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, MoreHorizontal, UserCog, Trash2 } from "lucide-react";
import { Button } from "@components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const getColumns = (
    onEdit: (user: UserResponse) => void,
    onDelete: (user: UserResponse) => void
): ColumnDef<UserResponse>[] => [
        {
            accessorKey: "name",
            header: "Họ và tên",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.name}</span>
                    <span className="text-xs text-muted-foreground">{row.original.email}</span>
                </div>
            ),
        },
        {
            accessorKey: "role",
            header: "Vai trò",
            cell: ({ row }) => {
                const role = row.original.role;
                return role ? (
                    <Badge variant="outline" >
                        {role.name}
                    </Badge>
                ) : (
                    <span className="text-muted-foreground">---</span>
                );
            },
        },
        {
            accessorKey: "company",
            header: "Công ty",
            cell: ({ row }) => <span>{row.original.company?.name || "---"}</span>,
        },
        {
            accessorKey: "isActive",
            header: "Trạng thái",
            cell: ({ row }) => {
                const isActive = row.original.isActive;
                return isActive ? (
                    <Badge variant="outline" >
                        <div className="bg-green-600 w-2 h-2 rounded-full mr-2"></div>
                        Hoạt động
                    </Badge>
                ) : (
                    <Badge variant="outline" >
                        <div className="bg-red-600 w-2 h-2 rounded-full mr-2"></div>
                        Bị khóa
                    </Badge>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "Ngày tạo",
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">
                    {row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString("vi-VN") : "---"}
                </span>
            ),
        },
        {
            id: "actions",
            header: () => <div className="text-center">Thao tác</div>,
            cell: ({ row }) => {
                const user = row.original;
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
                                <DropdownMenuItem onClick={() => onEdit(user)}>
                                    <UserCog className="mr-2 h-4 w-4" /> Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => onDelete(user)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> Xóa tài khoản
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

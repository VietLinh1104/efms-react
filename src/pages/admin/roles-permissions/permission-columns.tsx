import type { ColumnDef } from "@tanstack/react-table";
import type { PermissionResponse } from "@/api/generated/identity/api";
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

export const getPermissionColumns = (
    onEdit: (perm: PermissionResponse) => void,
    onDelete: (perm: PermissionResponse) => void
): ColumnDef<PermissionResponse>[] => [
        {
            accessorKey: "resource",
            header: "Tài nguyên",
            cell: ({ row }) => <Badge variant="secondary" className="">{row.original.resource}</Badge>,
        },
        {
            accessorKey: "action",
            header: "Hành động",
            cell: ({ row }) => <Badge variant="secondary" className="">{row.original.action}</Badge>,
        },
        {
            accessorKey: "description",
            header: "Mô tả",
            cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.description || "---"}</span>,
        },
        {
            id: "actions",
            header: () => <div className="text-center">Thao tác</div>,
            cell: ({ row }) => {
                const perm = row.original;
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
                                <DropdownMenuItem onClick={() => onEdit(perm)}>
                                    <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => onDelete(perm)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> Xóa quyền
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

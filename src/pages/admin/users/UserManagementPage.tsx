import React, { useEffect, useState, useCallback, useMemo } from "react";
import { DataTable } from "@components/ui/data-table.tsx";
import { Button } from "@components/ui/button.tsx";
import { RefreshCcw, Search } from "lucide-react";
import { identityUserControllerApi, identityRoleControllerApi } from "@/api";
import type { UserResponse, RoleResponse, UserUpdateRequest } from "@/api/generated/identity/api";
import { useToastApp } from "@hooks/use-toast-app.ts";
import { Input } from "@components/ui/input.tsx";
import { getColumns } from "./columns";
import UserEditDialog from "./UserEditDialog";
import { isForbidden } from "@/lib/utils";

const UserManagementPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
    const [editValues, setEditValues] = useState<UserUpdateRequest>({
        name: "",
        isActive: true,
        roleId: "",
    });

    const { success, error } = useToastApp();

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await identityUserControllerApi.getAllUsers() as any;
            const content = response.data.data?.content || response.data.data || [];
            setUsers(content);
        } catch (err) {
            if (isForbidden(err)) return;
            console.error("Error fetching users:", err);
            error("Không thể tải danh sách người dùng.");
        } finally {
            setIsLoading(false);
        }
    }, [error]);

    const fetchRoles = useCallback(async () => {
        try {
            const response = await identityRoleControllerApi.getAllRoles();
            setRoles(response.data.data || []);
        } catch (err) {
            console.error("Error fetching roles:", err);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, [fetchUsers, fetchRoles]);

    const handleEditUser = useCallback((user: UserResponse) => {
        setEditingUser(user);
        setEditValues({
            name: user.name || "",
            isActive: user.isActive ?? true,
            roleId: user.role?.id || "",
        });
        setIsEditDialogOpen(true);
    }, []);

    const handleUpdateUser = async () => {
        if (!editingUser?.id) return;
        setIsLoading(true);
        try {
            const res = await identityUserControllerApi.updateUser({
                id: editingUser.id,
                userUpdateRequest: editValues,
            });
            if (res.data.status === 200) {
                success("Cập nhật người dùng thành công");
                setIsEditDialogOpen(false);
                fetchUsers();
            } else {
                error("Cập nhật thất bại");
            }
        } catch (err) {
            if (isForbidden(err)) return;
            console.error("Error updating user:", err);
            error("Đã xảy ra lỗi khi cập nhật.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = useCallback(async (user: UserResponse) => {
        if (!user.id) return;
        if (!window.confirm(`Bạn có chắc muốn xóa người dùng ${user.email}?`)) return;

        setIsLoading(true);
        try {
            const res = await identityUserControllerApi.deleteUser({ id: user.id });
            if (res.data.status === 200) {
                success("Xóa người dùng thành công");
                fetchUsers();
            } else {
                error("Xóa thất bại");
            }
        } catch (err) {
            if (isForbidden(err)) return;
            console.error("Error deleting user:", err);
            error("Đã xảy ra lỗi khi xóa.");
        } finally {
            setIsLoading(false);
        }
    }, [success, error, fetchUsers]);

    const columns = useMemo(() => 
        getColumns(handleEditUser, handleDeleteUser), 
        [handleEditUser, handleDeleteUser]
    );

    const filteredUsers = useMemo(() => 
        users.filter(user => 
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [users, searchTerm]
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight">Quản lý người dùng</h2>
                <p className="text-muted-foreground">
                    Xem danh sách, phân quyền và quản lý trạng thái tài khoản người dùng trong hệ thống.
                </p>
            </div>

            <div className="flex justify-between items-center gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Tìm theo tên, email..." 
                        className="pl-8" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={fetchUsers} disabled={isLoading}>
                        <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredUsers}
                isLoading={isLoading}
            />

            <UserEditDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                user={editingUser}
                roles={roles}
                values={editValues}
                onValuesChange={setEditValues}
                onSave={handleUpdateUser}
                isLoading={isLoading}
            />
        </div>
    );
};

export default UserManagementPage;

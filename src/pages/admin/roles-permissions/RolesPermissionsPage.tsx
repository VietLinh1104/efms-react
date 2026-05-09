import React, { useEffect, useState, useCallback, useMemo } from "react";
import { DataTable } from "@components/ui/data-table.tsx";
import { Button } from "@components/ui/button.tsx";
import { 
    Plus, 
    RefreshCcw, 
    Lock,
    Key
} from "lucide-react";
import { identityRoleControllerApi, identityPermissionControllerApi } from "@/api";
import type { 
    RoleResponse, 
    RoleRequest, 
    PermissionResponse, 
    PermissionRequest 
} from "@/api/generated/identity/api";
import { useToastApp } from "@hooks/use-toast-app.ts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRoleColumns } from "./role-columns";
import { getPermissionColumns } from "./permission-columns";
import RoleEditDialog from "./RoleEditDialog";
import PermissionEditDialog from "./PermissionEditDialog";
import { isForbidden } from "@/lib/utils";

const RolesPermissionsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState("roles");
    const [isLoading, setIsLoading] = useState(false);
    const { success, error } = useToastApp();

    /* --- ROLES STATE --- */
    const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleResponse | null>(null);
    const [roleForm, setRoleForm] = useState<RoleRequest>({
        name: "",
        description: "",
        isActive: true,
        permissionIds: [],
    });

    /* --- PERMISSIONS STATE --- */
    const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
    const [isPermDialogOpen, setIsPermDialogOpen] = useState(false);
    const [editingPerm, setEditingPerm] = useState<PermissionResponse | null>(null);
    const [permForm, setPermForm] = useState<PermissionRequest>({
        resource: "",
        action: "",
        description: "",
    });

    /* --- DATA FETCHING --- */
    const fetchRoles = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await identityRoleControllerApi.getAllRoles();
            setRoles(res.data.data || []);
        } catch (err) {
            if (isForbidden(err)) return;
            console.error(err);
            error("Không thể tải danh sách vai trò.");
        } finally {
            setIsLoading(false);
        }
    }, [error]);

    const fetchPermissions = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await identityPermissionControllerApi.getAllPermissions();
            setPermissions(res.data.data || []);
        } catch (err) {
            if (isForbidden(err)) return;
            console.error(err);
            error("Không thể tải danh sách quyền.");
        } finally {
            setIsLoading(false);
        }
    }, [error]);

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, [fetchRoles, fetchPermissions]);

    /* --- ROLE ACTIONS --- */
    const handleAddRole = () => {
        setEditingRole(null);
        setRoleForm({ name: "", description: "", isActive: true, permissionIds: [] });
        setIsRoleDialogOpen(true);
    };

    const handleEditRole = useCallback((role: RoleResponse) => {
        setEditingRole(role);
        setRoleForm({
            name: role.name || "",
            description: role.description || "",
            isActive: role.isActive ?? true,
            permissionIds: role.permissions?.map(p => p.id!) || [],
        });
        setIsRoleDialogOpen(true);
    }, []);

    const handleSaveRole = async () => {
        setIsLoading(true);
        try {
            if (editingRole?.id) {
                await identityRoleControllerApi.updateRole({
                    id: editingRole.id,
                    roleRequest: roleForm
                });
                success("Cập nhật vai trò thành công");
            } else {
                await identityRoleControllerApi.createRole({
                    roleRequest: roleForm
                });
                success("Tạo vai trò mới thành công");
            }
            setIsRoleDialogOpen(false);
            fetchRoles();
        } catch (err) {
            if (isForbidden(err)) return;
            console.error(err);
            error("Lưu vai trò thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteRole = useCallback(async (role: RoleResponse) => {
        if (!role.id || !window.confirm(`Xóa vai trò ${role.name}?`)) return;
        try {
            await identityRoleControllerApi.deleteRole({ id: role.id });
            success("Đã xóa vai trò");
            fetchRoles();
        } catch (err) {
            if (isForbidden(err)) return;
            error("Xóa vai trò thất bại");
        }
    }, [success, error, fetchRoles]);

    const togglePermission = useCallback((permId: string) => {
        setRoleForm(prev => {
            const current = [...(prev.permissionIds || [])];
            const index = current.indexOf(permId);
            if (index > -1) {
                current.splice(index, 1);
            } else {
                current.push(permId);
            }
            return { ...prev, permissionIds: current };
        });
    }, []);

    /* --- PERMISSION ACTIONS --- */
    const handleAddPerm = () => {
        setEditingPerm(null);
        setPermForm({ resource: "", action: "", description: "" });
        setIsPermDialogOpen(true);
    };

    const handleEditPerm = useCallback((perm: PermissionResponse) => {
        setEditingPerm(perm);
        setPermForm({
            resource: perm.resource || "",
            action: perm.action || "",
            description: perm.description || "",
        });
        setIsPermDialogOpen(true);
    }, []);

    const handleSavePerm = async () => {
        setIsLoading(true);
        try {
            if (editingPerm?.id) {
                await identityPermissionControllerApi.updatePermission({
                    id: editingPerm.id,
                    permissionRequest: permForm
                });
                success("Cập nhật quyền thành công");
            } else {
                await identityPermissionControllerApi.createPermission({
                    permissionRequest: permForm
                });
                success("Tạo quyền mới thành công");
            }
            setIsPermDialogOpen(false);
            fetchPermissions();
        } catch (err) {
            if (isForbidden(err)) return;
            error("Lưu quyền thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletePerm = useCallback(async (perm: PermissionResponse) => {
        if (!perm.id || !window.confirm(`Xóa quyền ${perm.resource}:${perm.action}?`)) return;
        try {
            await identityPermissionControllerApi.deletePermission({ id: perm.id });
            success("Đã xóa quyền");
            fetchPermissions();
        } catch (err) {
            if (isForbidden(err)) return;
            error("Xóa quyền thất bại");
        }
    }, [success, error, fetchPermissions]);

    /* --- COLUMNS --- */
    const roleColumns = useMemo(() => 
        getRoleColumns(handleEditRole, handleDeleteRole),
        [handleEditRole, handleDeleteRole]
    );

    const permColumns = useMemo(() => 
        getPermissionColumns(handleEditPerm, handleDeletePerm),
        [handleEditPerm, handleDeletePerm]
    );

    const permissionsByResource = useMemo(() => {
        const groups: Record<string, PermissionResponse[]> = {};
        permissions.forEach(p => {
            if (!groups[p.resource!]) groups[p.resource!] = [];
            groups[p.resource!].push(p);
        });
        return groups;
    }, [permissions]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight">Vai trò & Quyền hạn</h2>
                <p className="text-muted-foreground">
                    Quản lý danh sách các vai trò (Roles) và các quyền chi tiết (Permissions) trên tài nguyên hệ thống.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-4">
                    <TabsList>
                        <TabsTrigger value="roles" className="flex items-center gap-2">
                            <Lock className="w-4 h-4" /> Vai trò
                        </TabsTrigger>
                        <TabsTrigger value="permissions" className="flex items-center gap-2">
                            <Key className="w-4 h-4" /> Quyền hạn
                        </TabsTrigger>
                    </TabsList>
                    
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={activeTab === 'roles' ? fetchRoles : fetchPermissions} disabled={isLoading}>
                            <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button onClick={activeTab === 'roles' ? handleAddRole : handleAddPerm}>
                            <Plus className="w-4 h-4 mr-2" /> 
                            {activeTab === 'roles' ? "Thêm vai trò" : "Thêm quyền"}
                        </Button>
                    </div>
                </div>

                <TabsContent value="roles" className="border-none p-0 outline-none">
                    <DataTable columns={roleColumns} data={roles} isLoading={isLoading} />
                </TabsContent>

                <TabsContent value="permissions" className="border-none p-0 outline-none">
                    <DataTable columns={permColumns} data={permissions} isLoading={isLoading} />
                </TabsContent>
            </Tabs>

            <RoleEditDialog
                open={isRoleDialogOpen}
                onOpenChange={setIsRoleDialogOpen}
                editingRole={editingRole}
                roleForm={roleForm}
                onFormChange={setRoleForm}
                permissionsByResource={permissionsByResource}
                togglePermission={togglePermission}
                onSave={handleSaveRole}
                isLoading={isLoading}
            />

            <PermissionEditDialog
                open={isPermDialogOpen}
                onOpenChange={setIsPermDialogOpen}
                editingPerm={editingPerm}
                permForm={permForm}
                onFormChange={setPermForm}
                onSave={handleSavePerm}
                isLoading={isLoading}
            />
        </div>
    );
};

export default RolesPermissionsPage;

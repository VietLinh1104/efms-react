import type { RoleResponse, RoleRequest, PermissionResponse } from "@/api/generated/identity/api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@components/ui/button.tsx";

interface RoleEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingRole: RoleResponse | null;
    roleForm: RoleRequest;
    onFormChange: (form: RoleRequest) => void;
    permissionsByResource: Record<string, PermissionResponse[]>;
    togglePermission: (permId: string) => void;
    onSave: () => void;
    isLoading: boolean;
}

const RoleEditDialog: React.FC<RoleEditDialogProps> = ({
    open,
    onOpenChange,
    editingRole,
    roleForm,
    onFormChange,
    permissionsByResource,
    togglePermission,
    onSave,
    isLoading,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{editingRole ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}</DialogTitle>
                    <DialogDescription>
                        Định nghĩa tên vai trò và gán các quyền tương ứng.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 overflow-y-auto pr-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role-name" className="text-right">Tên</Label>
                        <Input id="role-name" value={roleForm.name} className="col-span-3" onChange={(e) => onFormChange({ ...roleForm, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role-desc" className="text-right">Mô tả</Label>
                        <Textarea id="role-desc" value={roleForm.description} className="col-span-3" onChange={(e) => onFormChange({ ...roleForm, description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Trạng thái</Label>
                        <div className="flex items-center space-x-2 col-span-3">
                            <Switch checked={roleForm.isActive} onCheckedChange={(v) => onFormChange({ ...roleForm, isActive: v })} />
                            <span className="text-sm text-muted-foreground">{roleForm.isActive ? "Hoạt động" : "Tạm ngưng"}</span>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <Label className="text-base font-bold">Gán quyền hạn</Label>
                        <div className="space-y-6">
                            {Object.entries(permissionsByResource).map(([resource, perms]) => (
                                <div key={resource} className="space-y-2">
                                    <h4 className="text-sm font-semibold text-slate-900 bg-slate-50 p-1 px-2 rounded">{resource}</h4>
                                    <div className="grid grid-cols-2 gap-2 pl-2">
                                        {perms.map(p => (
                                            <div key={p.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`p-${p.id}`}
                                                    checked={roleForm.permissionIds?.includes(p.id!)}
                                                    onCheckedChange={() => togglePermission(p.id!)}
                                                />
                                                <label htmlFor={`p-${p.id}`} className="text-sm font-medium leading-none cursor-pointer">
                                                    {p.action}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
                    <Button onClick={onSave} disabled={isLoading}>Lưu</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RoleEditDialog;

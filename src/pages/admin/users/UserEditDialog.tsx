import React from "react";
import type { UserResponse, RoleResponse, UserUpdateRequest } from "@/api/generated/identity/api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@components/ui/button.tsx";

interface UserEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: UserResponse | null;
    roles: RoleResponse[];
    values: UserUpdateRequest;
    onValuesChange: (values: UserUpdateRequest) => void;
    onSave: () => void;
    isLoading: boolean;
}

const UserEditDialog: React.FC<UserEditDialogProps> = ({
    open,
    onOpenChange,
    user,
    roles,
    values,
    onValuesChange,
    onSave,
    isLoading,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                    <DialogDescription>
                        Thay đổi thông tin cơ bản và vai trò của người dùng {user?.email}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-name">Họ và tên</Label>
                        <Input
                            id="edit-name"
                            value={values.name}
                            onChange={(e) => onValuesChange({ ...values, name: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-role">Vai trò</Label>
                        <Select
                            value={values.roleId}
                            onValueChange={(v) => onValuesChange({ ...values, roleId: v })}
                        >
                            <SelectTrigger id="edit-role">
                                <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map(role => (
                                    <SelectItem key={role.id} value={role.id!}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between space-x-2 pt-2">
                        <Label htmlFor="edit-active" className="flex flex-col gap-1">
                            <span>Trạng thái hoạt động</span>
                            <span className="font-normal text-xs text-muted-foreground">
                                Cho phép người dùng đăng nhập vào hệ thống.
                            </span>
                        </Label>
                        <Switch
                            id="edit-active"
                            checked={values.isActive}
                            onCheckedChange={(v) => onValuesChange({ ...values, isActive: v })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
                    <Button onClick={onSave} disabled={isLoading}>Lưu thay đổi</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UserEditDialog;

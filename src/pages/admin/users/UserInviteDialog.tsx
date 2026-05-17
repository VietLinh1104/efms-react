import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@components/ui/dialog.tsx";
import { Button } from "@components/ui/button.tsx";
import { Input } from "@components/ui/input.tsx";
import { Label } from "@components/ui/label.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select.tsx";
import type { InviteUserRequest, RoleResponse } from "@/api/generated/identity/api";

interface UserInviteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roles: RoleResponse[];
    values: InviteUserRequest;
    onValuesChange: (values: InviteUserRequest) => void;
    onSave: () => void;
    isLoading: boolean;
}

const UserInviteDialog: React.FC<UserInviteDialogProps> = ({
    open,
    onOpenChange,
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
                    <DialogTitle>Mời nhân viên</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email nhân viên mới</Label>
                        <Input
                            id="email"
                            type="email"
                            value={values.email}
                            onChange={(e) =>
                                onValuesChange({ ...values, email: e.target.value })
                            }
                            placeholder="vd: employee@company.com"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Phân quyền ban đầu</Label>
                        <Select
                            value={values.roleId}
                            onValueChange={(val) =>
                                onValuesChange({ ...values, roleId: val })
                            }
                        >
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Chọn quyền..." />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((r) => (
                                    <SelectItem key={r.id} value={r.id!}>
                                        {r.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Hủy
                    </Button>
                    <Button onClick={onSave} disabled={isLoading || !values.email || !values.roleId}>
                        {isLoading ? "Đang gửi..." : "Gửi lời mời"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UserInviteDialog;

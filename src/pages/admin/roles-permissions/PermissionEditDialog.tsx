import React from "react";
import type { PermissionResponse, PermissionRequest } from "@/api/generated/identity/api";
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
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@components/ui/button.tsx";

interface PermissionEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingPerm: PermissionResponse | null;
    permForm: PermissionRequest;
    onFormChange: (form: PermissionRequest) => void;
    onSave: () => void;
    isLoading: boolean;
}

const PermissionEditDialog: React.FC<PermissionEditDialogProps> = ({
    open,
    onOpenChange,
    editingPerm,
    permForm,
    onFormChange,
    onSave,
    isLoading,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editingPerm ? "Chỉnh sửa quyền" : "Thêm quyền mới"}</DialogTitle>
                    <DialogDescription>
                        Tài nguyên và hành động định nghĩa một quyền hạn cụ thể.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="perm-res">Tài nguyên (Resource)</Label>
                        <Input id="perm-res" placeholder="E.g. INVOICE" value={permForm.resource} onChange={(e) => onFormChange({ ...permForm, resource: e.target.value.toUpperCase() })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="perm-act">Hành động (Action)</Label>
                        <Input id="perm-act" placeholder="E.g. READ, CREATE, DELETE" value={permForm.action} onChange={(e) => onFormChange({ ...permForm, action: e.target.value.toUpperCase() })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="perm-desc">Mô tả</Label>
                        <Textarea id="perm-desc" value={permForm.description} onChange={(e) => onFormChange({ ...permForm, description: e.target.value })} />
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

export default PermissionEditDialog;

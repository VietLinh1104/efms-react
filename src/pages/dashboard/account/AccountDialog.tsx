import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { accountsApi } from "@/api";
import type { AccountResponse, CreateAccountRequest } from "@/api/generated";
import { Loader2 } from "lucide-react";

const accountSchema = z.object({
    code: z.string().min(1, "Mã tài khoản là bắt buộc"),
    name: z.string().min(1, "Tên tài khoản là bắt buộc"),
    type: z.string().min(1, "Loại tài khoản là bắt buộc"),
    balanceType: z.string().min(1, "Loại số dư là bắt buộc"),
    parentId: z.string().optional().or(z.literal("none")),
    isActive: z.boolean(),
});

type AccountFormValues = z.infer<typeof accountSchema>;

interface AccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: AccountResponse | null;
    onSuccess: () => void;
}

const ACCOUNT_TYPES = [
    { value: "asset", label: "Tài sản (Asset)" },
    { value: "liability", label: "Nợ phải trả (Liability)" },
    { value: "equity", label: "Vốn chủ sở hữu (Equity)" },
    { value: "revenue", label: "Doanh thu (Revenue)" },
    { value: "expense", label: "Chi phí (Expense)" },
];

const BALANCE_TYPES = [
    { value: "debit", label: "Ghi Nợ (Debit)" },
    { value: "credit", label: "Ghi Có (Credit)" },
];

export const AccountDialog: React.FC<AccountDialogProps> = ({
    open,
    onOpenChange,
    initialData,
    onSuccess,
}) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [parentAccounts, setParentAccounts] = React.useState<AccountResponse[]>([]);

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            code: "",
            name: "",
            type: "asset",
            balanceType: "debit",
            parentId: "none",
            isActive: true,
        },
    });

    React.useEffect(() => {
        if (open) {
            // Fetch potential parent accounts
            const fetchParents = async () => {
                try {
                    const response = await accountsApi.list7('ceb4da87-a0a5-44f8-8978-003a645ac86b');
                    setParentAccounts(response.data.data || []);
                } catch (error) {
                    console.error("Error fetching parent accounts:", error);
                }
            };
            fetchParents();

            if (initialData) {
                form.reset({
                    code: initialData.code || "",
                    name: initialData.name || "",
                    type: initialData.type || "asset",
                    balanceType: initialData.balanceType || "debit",
                    parentId: initialData.parentId || "none",
                    isActive: initialData.isActive ?? true,
                });
            } else {
                form.reset({
                    code: "",
                    name: "",
                    type: "asset",
                    balanceType: "debit",
                    parentId: "none",
                    isActive: true,
                });
            }
        }
    }, [open, initialData, form]);

    const onSubmit: SubmitHandler<AccountFormValues> = async (values) => {
        setIsSubmitting(true);
        try {
            const requestData: CreateAccountRequest = {
                code: values.code,
                name: values.name,
                type: values.type,
                balanceType: values.balanceType,
                parentId: (values.parentId === "none" || !values.parentId) ? undefined : values.parentId,
                companyId: 'ceb4da87-a0a5-44f8-8978-003a645ac86b',
            };

            if (initialData?.id) {
                await accountsApi.update5(initialData.id, requestData);
                if (initialData.isActive !== values.isActive) {
                    await accountsApi.toggleActive3(initialData.id);
                }
            } else {
                await accountsApi.create7(requestData);
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Error saving account:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {initialData ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
                    </DialogTitle>
                    <DialogDescription>
                        Điền các thông tin chi tiết cho tài khoản kế toán của bạn.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mã tài khoản <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="1111" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên tài khoản <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tiền mặt" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Loại tài khoản <span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Chọn loại" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {ACCOUNT_TYPES.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="balanceType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số dư bình thường <span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Chọn loại số dư" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {BALANCE_TYPES.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="parentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tài khoản cha</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn tài khoản cấp trên" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">-- Không có --</SelectItem>
                                            {parentAccounts
                                                .filter(acc => acc.id !== initialData?.id)
                                                .map((acc) => (
                                                    <SelectItem key={acc.id} value={acc.id || "none"}>
                                                        {acc.code} - {acc.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel>Hoạt động</FormLabel>
                                        <FormDescription>
                                            Kích hoạt hoặc vô hiệu hóa tài khoản này.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="hover:bg-muted"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {initialData ? "Cập nhật" : "Tạo mới"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

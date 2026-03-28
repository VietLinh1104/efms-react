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
} from "@components/ui/dialog.tsx";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@components/ui/form.tsx";

import { Input } from "@components/ui/input.tsx";
import { Button } from "@components/ui/button.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select.tsx";
import { Switch } from "@components/ui/switch.tsx";

import { partnersApi, accountsApi } from "@/api";
import type {
    CreatePartnerRequest,
    PartnerResponse,
    AccountResponse,
} from "@/api/generated";

import { Loader2 } from "lucide-react";

// ================= SCHEMA =================
const partnerSchema = z.object({
    name: z.string().min(1, "Tên đối tác là bắt buộc"),
    type: z.string().min(1, "Loại đối tác là bắt buộc"),
    taxCode: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
    address: z.string().optional(),
    arAccountId: z.string().min(1, "Tài khoản AR là bắt buộc"),
    apAccountId: z.string().min(1, "Tài khoản AP là bắt buộc"),
    isActive: z.boolean(),
});

type PartnerFormValues = z.infer<typeof partnerSchema>;

// ================= CONST =================
const PARTNER_TYPES = [
    { value: "customer", label: "Khách hàng (Customer)" },
    { value: "vendor", label: "Nhà cung cấp (Vendor)" },
];

// ================= PROPS =================
interface PartnerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: PartnerResponse | null;
    onSuccess: () => void;
}

// ================= COMPONENT =================
export const PartnerDialog: React.FC<PartnerDialogProps> = ({
    open,
    onOpenChange,
    initialData,
    onSuccess,
}) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [accounts, setAccounts] = React.useState<AccountResponse[]>([]);

    const form = useForm<PartnerFormValues>({
        resolver: zodResolver(partnerSchema),
        defaultValues: {
            name: "",
            type: "customer",
            taxCode: "",
            phone: "",
            email: "",
            address: "",
            arAccountId: "",
            apAccountId: "",
            isActive: true,
        },
    });

    // ================= EFFECT =================
    React.useEffect(() => {
        if (open) {
            const fetchAccounts = async () => {
                try {
                    const res = await accountsApi.list7(
                        "a5fbb4a1-e8bd-4749-aa6d-c422ded28107"
                    );
                    setAccounts(res.data.data || []);
                } catch (err) {
                    console.error("Error fetching accounts:", err);
                }
            };

            fetchAccounts();

            if (initialData) {
                form.reset({
                    name: initialData.name || "",
                    type: initialData.type || "customer",
                    taxCode: initialData.taxCode || "",
                    phone: initialData.phone || "",
                    email: initialData.email || "",
                    address: initialData.address || "",
                    arAccountId: initialData.arAccountId || "",
                    apAccountId: initialData.apAccountId || "",
                    isActive: initialData.isActive ?? true,
                });
            } else {
                form.reset({
                    name: "",
                    type: "customer",
                    taxCode: "",
                    phone: "",
                    email: "",
                    address: "",
                    arAccountId: "",
                    apAccountId: "",
                    isActive: true,
                });
            }
        }
    }, [open, initialData, form]);

    // ================= SUBMIT =================
    const onSubmit: SubmitHandler<PartnerFormValues> = async (values) => {
        setIsSubmitting(true);
        try {
            const requestData: CreatePartnerRequest = {
                name: values.name,
                type: values.type,
                taxCode: values.taxCode || undefined,
                phone: values.phone || undefined,
                email: values.email || undefined,
                address: values.address || undefined,
                arAccountId: values.arAccountId,
                apAccountId: values.apAccountId,
                companyId: "a5fbb4a1-e8bd-4749-aa6d-c422ded28107",
            };

            if (initialData?.id) {
                await partnersApi.update1(initialData.id, requestData);

                if (initialData.isActive !== values.isActive) {
                    await partnersApi.toggleActive1(initialData.id);
                }
            } else {
                await partnersApi.create1(requestData);
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Error saving partner:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ================= UI =================
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {initialData ? "Chỉnh sửa đối tác" : "Thêm đối tác"}
                    </DialogTitle>
                    <DialogDescription>
                        Nhập thông tin đối tác của bạn.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">

                        {/* NAME + TYPE */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên đối tác *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Công ty ABC" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Loại *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={"w-full"}>
                                                    <SelectValue placeholder="Chọn loại" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {PARTNER_TYPES.map((t) => (
                                                    <SelectItem key={t.value} value={t.value}>
                                                        {t.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* CONTACT */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Điện thoại</FormLabel>
                                        <FormControl>
                                            <Input placeholder="090..." {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@gmail.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* TAX + ADDRESS */}
                        <FormField
                            control={form.control}
                            name="taxCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mã số thuế</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Địa chỉ</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* ACCOUNTS */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="arAccountId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tài khoản phải thu (AR) *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={"w-full"}>
                                                    <SelectValue placeholder="Chọn tài khoản" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {accounts.map((acc) => (
                                                    <SelectItem key={acc.id} value={acc.id || ""}>
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
                                name="apAccountId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tài khoản phải trả (AP) *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={"w-full"}>
                                                    <SelectValue placeholder="Chọn tài khoản" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {accounts.map((acc) => (
                                                    <SelectItem key={acc.id} value={acc.id || ""}>
                                                        {acc.code} - {acc.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* ACTIVE */}
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex justify-between border p-4 rounded-lg">
                                    <div>
                                        <FormLabel>Hoạt động</FormLabel>
                                        <FormDescription>
                                            Bật/tắt trạng thái đối tác
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

                        {/* FOOTER */}
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => onOpenChange(false)}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {initialData ? "Cập nhật" : "Tạo mới"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
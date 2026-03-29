import React, { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";
import { Separator } from "@components/ui/separator.tsx";

import type {
    BankAccountResponse,
    CreateBankAccountRequest,
    AccountResponse,
    AccountsApiList7Request,
    BankAccountsApiUpdate3Request,
    BankAccountsApiCreate4Request,
} from "@/api/generated/core";
import { useToastApp } from "@hooks/use-toast-app.ts";
import { coreAccountsApi, coreBankAccountsApi } from "@/api";

/* ─── Schema ─────────────────────────────────────────────────────────── */

const schema = z.object({
    name: z.string().min(1, "Tên tài khoản là bắt buộc"),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    type: z.string().min(1, "Loại là bắt buộc"),
    currencyCode: z.string().min(1, "Tiền tệ là bắt buộc"),
    openingBalance: z.number().optional(),
    glAccountId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const COMPANY_ID = "a5fbb4a1-e8bd-4749-aa6d-c422ded28107";

const TYPES = [
    { value: "checking", label: "Ngân hàng (Checking)" },
    { value: "savings", label: "Tiết kiệm (Savings)" },
    { value: "cash", label: "Tiền mặt (Cash)" },
];

/* ─── Props ─────────────────────────────────────────────────────────── */

interface BankAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: BankAccountResponse | null;
    onSuccess: () => void;
}

/* ─── Component ──────────────────────────────────────────────────────── */

export const BankAccountDialog: React.FC<BankAccountDialogProps> = ({
    open,
    onOpenChange,
    initialData,
    onSuccess,
}) => {
    const { success, error } = useToastApp();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [glAccounts, setGlAccounts] = useState<AccountResponse[]>([]);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            bankName: "",
            accountNumber: "",
            type: "checking",
            currencyCode: "VND",
            openingBalance: 0,
            glAccountId: "none",
        },
    });

    /* Fetch GL accounts & reset form on open */
    useEffect(() => {
        if (!open) return;

        const fetchGlAccounts = async () => {
            try {
                const accountsApiList7Request: AccountsApiList7Request = {
                    companyId: COMPANY_ID,
                };
                const res = await coreAccountsApi.list7(accountsApiList7Request);
                setGlAccounts(res.data.data || []);
            } catch (e) {
                console.error(e);
            }
        };
        fetchGlAccounts();

        if (initialData) {
            form.reset({
                name: initialData.name || "",
                bankName: initialData.bankName || "",
                accountNumber: initialData.accountNumber || "",
                type: initialData.type || "checking",
                currencyCode: initialData.currencyCode || "VND",
                openingBalance: initialData.openingBalance ?? 0,
                glAccountId: initialData.glAccountId || "none",
            });
        } else {
            form.reset({
                name: "",
                bankName: "",
                accountNumber: "",
                type: "checking",
                currencyCode: "VND",
                openingBalance: 0,
                glAccountId: "none",
            });
        }
    }, [open, initialData, form]);

    /* Submit */
    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        setIsSubmitting(true);
        try {
            const payload: CreateBankAccountRequest = {
                ...values,
                companyId: COMPANY_ID,
                glAccountId: (!values.glAccountId || values.glAccountId === "none") ? undefined : values.glAccountId,
            };

            if (initialData?.id) {
                const bankAccountsApiUpdate3Request: BankAccountsApiUpdate3Request = {
                    id: initialData.id,
                    createBankAccountRequest: payload,
                };
                await coreBankAccountsApi.update3(bankAccountsApiUpdate3Request);
                success("Cập nhật tài khoản thành công!");
            } else {
                const bankAccountsApiCreate4Request: BankAccountsApiCreate4Request = {
                    createBankAccountRequest: payload,
                };
                await coreBankAccountsApi.create4(bankAccountsApiCreate4Request);
                success("Tạo tài khoản thành công!");
            }
            onSuccess();
            onOpenChange(false);
        } catch (e) {
            console.error(e);
            error("Lưu thất bại. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Chỉnh sửa tài khoản NH" : "Thêm tài khoản mới"}
                    </DialogTitle>
                    <DialogDescription>
                        Điền thông tin tài khoản tiền mặt hoặc ngân hàng.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">

                        {/* Tên TK + Loại */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Tên tài khoản <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input id="ba-name" placeholder="Ví dụ: Techcombank VND" {...field} />
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
                                        <FormLabel>Loại <span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger id="ba-type" className="w-full">
                                                    <SelectValue placeholder="Chọn loại" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {TYPES.map((t) => (
                                                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="currencyCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tiền tệ <span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger id="ba-currency" className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="VND">VND</SelectItem>
                                                <SelectItem value="USD">USD</SelectItem>
                                                <SelectItem value="EUR">EUR</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Separator />

                        {/* Ngân hàng + Số TK */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="bankName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên ngân hàng</FormLabel>
                                        <FormControl>
                                            <Input id="ba-bank-name" placeholder="Techcombank" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="accountNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số tài khoản</FormLabel>
                                        <FormControl>
                                            <Input id="ba-account-number" placeholder="1900 xxxx xxxx" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Số dư đầu kỳ + TK kế toán */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="openingBalance"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số dư đầu kỳ</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="ba-opening-balance"
                                                type="number"
                                                min={0}
                                                step="any"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="glAccountId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>TK kế toán (GL)</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger id="ba-gl-account" className="w-full">
                                                    <SelectValue placeholder="Chọn TK kế toán" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">-- Không chọn --</SelectItem>
                                                {glAccounts.map((acc) => (
                                                    <SelectItem key={acc.id} value={acc.id!}>
                                                        {acc.code} – {acc.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                            >
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
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

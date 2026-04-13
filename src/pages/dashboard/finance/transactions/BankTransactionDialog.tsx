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
import { Textarea } from "@components/ui/textarea.tsx";
import { Loader2, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Separator } from "@components/ui/separator.tsx";
import { cn } from "@/lib/utils.ts";

import { coreBankTransactionsApi, coreBankAccountsApi } from "@/api";
import type {
    BankAccountResponse,
    BankAccountsApiList4Request,
    BankTransactionsApiCreate3Request,
    CreateBankTransactionRequest,
} from "@/api/generated/core";
import { useToastApp } from "@hooks/use-toast-app.ts";
import { useAuth } from "@/hooks/useAuth";

/* ─── Schema ─────────────────────────────────────────────────────────── */

const schema = z.object({
    bankAccountId: z.string().min(1, "Vui lòng chọn tài khoản ngân hàng"),
    transactionDate: z.string().min(1, "Ngày giao dịch là bắt buộc"),
    type: z.enum(["in", "out"], { error: "Vui lòng chọn loại giao dịch" }),
    amount: z
        .number({ error: "Số tiền không hợp lệ" })
        .positive("Số tiền phải lớn hơn 0"),
    description: z.string().optional(),
    reference: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

/* ─── Props ─────────────────────────────────────────────────────────── */

interface BankTransactionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Pre-fill the bank account (e.g. opened from a specific account page) */
    defaultBankAccountId?: string;
    onSuccess: () => void;
}

/* ─── Component ──────────────────────────────────────────────────────── */

export const BankTransactionDialog: React.FC<BankTransactionDialogProps> = ({
    open,
    onOpenChange,
    defaultBankAccountId,
    onSuccess,
}) => {
    const { success, error } = useToastApp();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bankAccounts, setBankAccounts] = useState<BankAccountResponse[]>([]);
    const { companyId } = useAuth();

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            bankAccountId: defaultBankAccountId || "",
            transactionDate: new Date().toISOString().substring(0, 10),
            type: "in",
            amount: 0,
            description: "",
            reference: "",
        },
    });

    const watchedType = form.watch("type");

    /* Fetch bank accounts & reset form on open */
    useEffect(() => {
        if (!open) return;

        const bankAccountsApiList4Request: BankAccountsApiList4Request = {
            companyId: companyId ?? "",
            type: undefined,
            search: "",
            page: 0,
            size: 200,
        };

        coreBankAccountsApi
            .list4(bankAccountsApiList4Request)
            .then((r) => setBankAccounts(r.data.data?.content || []))
            .catch(console.error);

        form.reset({
            bankAccountId: defaultBankAccountId || "",
            transactionDate: new Date().toISOString().substring(0, 10),
            type: "in",
            amount: 0,
            description: "",
            reference: "",
        });
    }, [open, defaultBankAccountId, form]);

    /* Submit */
    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        setIsSubmitting(true);
        try {
            const payload: CreateBankTransactionRequest = {
                bankAccountId: values.bankAccountId,
                transactionDate: values.transactionDate,
                type: values.type,
                amount: values.amount,
                description: values.description || undefined,
                reference: values.reference || undefined,
            };

            const bankTransactionsApiCreate3Request: BankTransactionsApiCreate3Request = {
                createBankTransactionRequest: payload
            };

            await coreBankTransactionsApi.create3(bankTransactionsApiCreate3Request);
            success("Tạo giao dịch thành công!");
            onSuccess();
            onOpenChange(false);
        } catch (e) {
            console.error(e);
            error("Tạo giao dịch thất bại. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {watchedType === "in" ? (
                            <ArrowDownCircle className="h-5 w-5 text-green-500" />
                        ) : (
                            <ArrowUpCircle className="h-5 w-5 text-orange-500" />
                        )}
                        Thêm giao dịch thủ công
                    </DialogTitle>
                    <DialogDescription>
                        Ghi nhận một khoản thu vào hoặc chi ra cho tài khoản ngân hàng.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-1">

                        {/* Loại giao dịch (toggle style) */}
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loại giao dịch <span className="text-destructive">*</span></FormLabel>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => field.onChange("in")}
                                            className={cn(
                                                "flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors",
                                                field.value === "in"
                                                    ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                                                    : "border-muted bg-background text-muted-foreground hover:bg-muted/50"
                                            )}
                                        >
                                            <ArrowDownCircle className="h-4 w-4" />
                                            Thu vào (IN)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => field.onChange("out")}
                                            className={cn(
                                                "flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors",
                                                field.value === "out"
                                                    ? "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                                                    : "border-muted bg-background text-muted-foreground hover:bg-muted/50"
                                            )}
                                        >
                                            <ArrowUpCircle className="h-4 w-4" />
                                            Chi ra (OUT)
                                        </button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Separator />

                        {/* TK Ngân hàng */}
                        <FormField
                            control={form.control}
                            name="bankAccountId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tài khoản ngân hàng <span className="text-destructive">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger id="tx-bank-account" className="w-full">
                                                <SelectValue placeholder="Chọn tài khoản" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {bankAccounts.length === 0 ? (
                                                <SelectItem value="none" disabled>
                                                    Chưa có tài khoản nào
                                                </SelectItem>
                                            ) : (
                                                bankAccounts.map((b) => (
                                                    <SelectItem key={b.id} value={b.id!}>
                                                        <span className="font-medium">{b.name}</span>
                                                        {b.bankName && (
                                                            <span className="text-muted-foreground ml-1">
                                                                — {b.bankName}
                                                            </span>
                                                        )}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Ngày GD + Số tiền */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="transactionDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày giao dịch <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input id="tx-date" type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số tiền (VND) <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                id="tx-amount"
                                                type="number"
                                                min={1}
                                                step="any"
                                                placeholder="0"
                                                className={cn(
                                                    "font-mono",
                                                    watchedType === "in"
                                                        ? "focus-visible:ring-green-500"
                                                        : "focus-visible:ring-orange-500"
                                                )}
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Diễn giải */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Diễn giải / Nội dung CK</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            id="tx-description"
                                            placeholder="Ví dụ: Thanh toán hóa đơn điện thoại tháng 3..."
                                            rows={2}
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Số tham chiếu */}
                        <FormField
                            control={form.control}
                            name="reference"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mã tham chiếu</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="tx-reference"
                                            placeholder="Số GD ngân hàng, số séc..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className={cn(
                                    watchedType === "in"
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-orange-600 hover:bg-orange-700"
                                )}
                            >
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {watchedType === "in" ? "Ghi nhận thu vào" : "Ghi nhận chi ra"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

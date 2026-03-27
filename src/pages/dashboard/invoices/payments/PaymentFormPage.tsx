import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@components/ui/button.tsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@components/ui/form.tsx";
import { Input } from "@components/ui/input.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select.tsx";
import { Separator } from "@components/ui/separator.tsx";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert.tsx";

import { paymentsApi, partnersApi, bankAccountsApi } from "@/api";
import type {
    PartnerResponse,
    BankAccountResponse,
    CreatePaymentRequest,
} from "@/api/generated";
import { useToastApp } from "@hooks/use-toast-app.ts";

/* ================= SCHEMA ================= */

const paymentSchema = z
    .object({
        paymentType: z.string().min(1, "Bắt buộc chọn loại thanh toán"),
        partnerId: z.string().min(1, "Bắt buộc chọn đối tác"),
        paymentDate: z.string().min(1, "Bắt buộc nhập ngày thanh toán"),
        amount: z.number().positive("Số tiền phải lớn hơn 0"),
        currencyCode: z.string().min(1, "Bắt buộc chọn tiền tệ"),
        exchangeRate: z.number().optional(),
        paymentMethod: z.string().min(1, "Bắt buộc chọn phương thức"),
        bankAccountId: z.string().optional(),
        reference: z.string().optional(),
    })
    .refine(
        (data) =>
            data.paymentMethod !== "bank_transfer" || !!data.bankAccountId,
        {
            message: "Phải chọn tài khoản ngân hàng khi phương thức là Chuyển khoản",
            path: ["bankAccountId"],
        }
    );

type PaymentFormValues = z.infer<typeof paymentSchema>;

/* ================= COMPONENT ================= */

const COMPANY_ID = "a5fbb4a1-e8bd-4749-aa6d-c422ded28107";

const PaymentFormPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const isEditMode = !!id;

    const navigate = useNavigate();
    const { success, error } = useToastApp();

    const [partners, setPartners] = useState<PartnerResponse[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccountResponse[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPosted, setIsPosted] = useState(false);
    const [isAllocated, setIsAllocated] = useState(false);

    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            paymentType: "in",
            partnerId: "",
            paymentDate: new Date().toISOString().split("T")[0],
            amount: 0,
            currencyCode: "VND",
            exchangeRate: 1,
            paymentMethod: "cash",
            bankAccountId: "",
            reference: "",
        },
    });

    const paymentMethod = form.watch("paymentMethod");
    const isBankTransfer = paymentMethod === "bank_transfer";

    /* ================= FETCH ================= */

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [partRes, bankRes] = await Promise.all([
                    partnersApi.list1(COMPANY_ID, undefined, undefined, 0, 200),
                    bankAccountsApi.list4(COMPANY_ID, undefined, "", 0, 100),
                ]);
                setPartners(partRes.data.data?.content || []);
                setBankAccounts(bankRes.data.data?.content || []);
            } catch (e) {
                console.error(e);
                error("Không thể tải dữ liệu khởi tạo.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [error]);

    // Load existing payment data in edit mode
    useEffect(() => {
        if (!isEditMode || !id) return;

        const fetchPayment = async () => {
            setIsLoading(true);
            try {
                const res = await paymentsApi.getDetail(id);
                const p = res.data.data;
                if (!p) return;

                setIsPosted(!!p.journalEntryId);
                const hasAllocations = (p.allocations?.length || 0) > 0;
                setIsAllocated(hasAllocations);

                if (hasAllocations) {
                    console.warn(`Payment ${id} is already allocated to invoices. Updates might fail at backend if it executes a delete logic.`, p.allocations);
                }

                form.reset({
                    paymentType: p.paymentType || "in",
                    partnerId: p.partnerId || "",
                    paymentDate: p.paymentDate || new Date().toISOString().split("T")[0],
                    amount: p.amount || 0,
                    currencyCode: p.currencyCode || "VND",
                    exchangeRate: 1,
                    paymentMethod: p.paymentMethod || "cash",
                    bankAccountId: "",
                    reference: p.reference || "",
                });
            } catch (e) {
                console.error(e);
                error("Không thể tải thông tin thanh toán.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPayment();
    }, [id, isEditMode, error, form]);

    /* ================= SUBMIT ================= */

    const onSubmit: SubmitHandler<PaymentFormValues> = async (values) => {
        setIsSubmitting(true);
        try {
            const request: CreatePaymentRequest = {
                ...values,
                companyId: COMPANY_ID,
                bankAccountId: isBankTransfer ? values.bankAccountId : undefined,
            };

            if (isEditMode && id) {
                await paymentsApi.update(id, request);
                success("Cập nhật phiếu thanh toán thành công!");
            } else {
                await paymentsApi.create(request);
                success("Tạo phiếu thanh toán thành công!");
                form.reset();
            }
            navigate("/payments");
        } catch (e) {
            console.error(e);
            error(isEditMode ? "Cập nhật thất bại." : "Tạo phiếu thất bại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ================= UI ================= */

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/payments")}
                    title="Quay lại"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isEditMode ? "Chỉnh sửa phiếu thu/chi" : "Tạo phiếu thu/chi mới"}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        {isEditMode
                            ? "Cập nhật thông tin phiếu thanh toán"
                            : "Nhập thông tin để tạo phiếu thu hoặc phiếu chi"}
                    </p>
                </div>
            </div>

            {(isPosted || isAllocated) && (
                <Alert variant="destructive" className="    ">
                    <AlertCircle className="h-4 w-4 stroke-orange-800" />
                    <AlertTitle>Lưu ý quan trọng</AlertTitle>
                    <AlertDescription>
                        {isPosted ? (
                            "Phiếu này đã được ghi sổ kế toán. Không thể chỉnh sửa hoặc xóa."
                        ) : (
                            "Phiếu này đang được liên kết (phân bổ) với hóa đơn. Việc cập nhật có thể thất bại do ràng buộc cơ sở dữ liệu (lỗi backend: PUT triggers DELETE)."
                        )}
                    </AlertDescription>
                </Alert>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* ── SECTION: Thông tin chính ── */}
                    <div className="rounded-xl border p-6 space-y-4">
                        <h3 className="font-semibold text-base">Thông tin chính</h3>
                        <Separator />

                        <div className="grid md:grid-cols-3 gap-4">

                            {/* Loại thanh toán */}
                            <FormField
                                name="paymentType"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Loại <span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger id="payment-type" className="w-full">
                                                    <SelectValue placeholder="Chọn loại" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="in">Thu (Receive)</SelectItem>
                                                <SelectItem value="out">Chi (Pay)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Đối tác */}
                            <FormField
                                name="partnerId"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Đối tác <span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                                            <FormControl>
                                                <SelectTrigger id="partner" className="w-full">
                                                    <SelectValue placeholder="Chọn đối tác" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {partners.map((p) => (
                                                    <SelectItem key={p.id} value={p.id!}>
                                                        {p.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Ngày thanh toán */}
                            <FormField
                                name="paymentDate"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày thanh toán <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input id="payment-date" type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Số tiền */}
                            <FormField
                                name="amount"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số tiền <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                id="amount"
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

                            {/* Tiền tệ */}
                            <FormField
                                name="currencyCode"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tiền tệ <span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger id="currency" className="w-full">
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

                            {/* Tỷ giá */}
                            <FormField
                                name="exchangeRate"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tỷ giá</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="exchange-rate"
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
                        </div>
                    </div>

                    {/* ── SECTION: Phương thức & Tham chiếu ── */}
                    <div className="rounded-xl border p-6 space-y-4">
                        <h3 className="font-semibold text-base">Phương thức thanh toán</h3>
                        <Separator />

                        <div className="grid md:grid-cols-3 gap-4">

                            {/* Phương thức */}
                            <FormField
                                name="paymentMethod"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phương thức <span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger id="payment-method" className="w-full">
                                                    <SelectValue placeholder="Chọn phương thức" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="cash">Tiền mặt (Cash)</SelectItem>
                                                <SelectItem value="bank_transfer">Chuyển khoản (Bank Transfer)</SelectItem>
                                                <SelectItem value="check">Séc (Check)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Tài khoản ngân hàng — chỉ hiện khi phương thức là bank_transfer */}
                            {isBankTransfer && (
                                <FormField
                                    name="bankAccountId"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>TK Ngân hàng <span className="text-destructive">*</span></FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                                                <FormControl>
                                                    <SelectTrigger id="bank-account" className="w-full">
                                                        <SelectValue placeholder="Chọn tài khoản" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {bankAccounts.map((b) => (
                                                        <SelectItem key={b.id} value={b.id!}>
                                                            {b.name} — {b.accountNumber}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Tham chiếu */}
                            <FormField
                                name="reference"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tham chiếu</FormLabel>
                                        <FormControl>
                                            <Input id="reference" placeholder="Số tham chiếu, lý do…" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* ── Actions ── */}
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/payments")}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting || isLoading || isPosted}>
                            <Save className="w-4 h-4 mr-2" />
                            {isSubmitting ? "Đang lưu…" : isEditMode ? "Cập nhật" : "Tạo mới"}
                        </Button>
                    </div>

                </form>
            </Form>
        </div>
    );
};

export default PaymentFormPage;

import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@components/ui/button.tsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@components/ui/card.tsx";
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
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert.tsx";
import { ButtonSpin } from "@components/common/ButtonSpin.tsx";

import {
    corePaymentsApi,
    corePartnersApi,
    coreBankAccountsApi,
    coreInvoicesApi,
} from "@/api";
import type {
    PartnerResponse,
    BankAccountResponse,
    CreatePaymentRequest,
    BankAccountsApiList2Request,
    PartnersApiList1Request,
    PaymentsApiGetDetailRequest,
    PaymentsApiUpdateRequest,
    PaymentsApiCreateRequest,
    InvoiceResponse,
} from "@/api/generated/core";
import { useToastApp } from "@hooks/use-toast-app.ts";
import { useAuth } from "@/hooks/useAuth";

/* ================= SCHEMA ================= */

const paymentSchema = z.object({
    paymentType: z.string().min(1, "Bắt buộc chọn loại thanh toán"),
    partnerId: z.string().min(1, "Bắt buộc chọn đối tác"),
    paymentDate: z.string().min(1, "Bắt buộc nhập ngày thanh toán"),
    amount: z.number().positive("Số tiền phải lớn hơn 0"),
    currencyCode: z.string().min(1, "Bắt buộc chọn tiền tệ"),
    exchangeRate: z.number().optional(),
    paymentMethod: z.string().min(1, "Bắt buộc chọn phương thức"),
    bankAccountId: z.string().min(1, "Bắt buộc chọn tài khoản thanh toán"),
    reference: z.string().optional(),
    invoiceId: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

/* ================= COMPONENT ================= */

const PaymentFormPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const isEditMode = !!id;

    const navigate = useNavigate();
    const { success, error } = useToastApp();
    const { companyId } = useAuth();

    /* ── Master data ─────────────────────────────────────────────────── */
    const [partners, setPartners] = useState<PartnerResponse[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccountResponse[]>([]);

    /* ── Payment state ───────────────────────────────────────────────── */
    const [isPosted, setIsPosted] = useState(false);
    const [invoiceNumber, setInvoiceNumber] = useState<string>("");

    /* ── Invoice list for allocation ────────────────────────────────── */
    const [unpaidInvoices, setUnpaidInvoices] = useState<InvoiceResponse[]>([]);
    const [isInvoicesLoading, setIsInvoicesLoading] = useState(false);

    /* ── Loading states ──────────────────────────────────────────────── */
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPosting, setIsPosting] = useState(false);

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
            invoiceId: "",
        },
    });

    const paymentMethod = form.watch("paymentMethod");
    const partnerId = form.watch("partnerId");
    const paymentType = form.watch("paymentType");

    // Form chỉ cho chỉnh sửa khi chưa ghi sổ
    const isReadOnly = isEditMode && isPosted;

    /* ================= FETCH MASTER DATA ================= */

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const partnersReq: PartnersApiList1Request = { companyId, page: 0, size: 200 };
            const bankReq: BankAccountsApiList2Request = { companyId, page: 0, size: 100 };
            const [partRes, bankRes] = await Promise.all([
                corePartnersApi.list1(partnersReq),
                coreBankAccountsApi.list2(bankReq),
            ]);
            setPartners(partRes.data.data?.content || []);
            setBankAccounts(bankRes.data.data?.content || []);
        } catch (e) {
            console.error(e);
            error("Không thể tải dữ liệu khởi tạo.");
        } finally {
            setIsLoading(false);
        }
    }, [companyId, error]);

    const fetchDetail = useCallback(async () => {
        if (!isEditMode || !id) return;
        setIsLoading(true);
        try {
            const params: PaymentsApiGetDetailRequest = { id };
            const res = await corePaymentsApi.getDetail(params);
            const p = res.data.data;
            if (!p) return;

            setIsPosted(!!p.journalEntryId);
            setInvoiceNumber(p.invoiceNumber || "");

            form.reset({
                paymentType: p.paymentType || "in",
                partnerId: p.partnerId || "",
                paymentDate: p.paymentDate || new Date().toISOString().split("T")[0],
                amount: p.amount || 0,
                currencyCode: p.currencyCode || "VND",
                exchangeRate: 1,
                paymentMethod: p.paymentMethod || "cash",
                bankAccountId: p.bankAccountId || "",
                reference: p.reference || "",
                invoiceId: p.invoiceId || "",
            });
        } catch (e) {
            console.error(e);
            error("Không thể tải thông tin thanh toán.");
        } finally {
            setIsLoading(false);
        }
    }, [id, isEditMode, error, form]);

    useEffect(() => { fetchData(); }, [fetchData]);
    useEffect(() => { fetchDetail(); }, [fetchDetail]);

    /* ── Fetch unpaid invoices ── */
    const fetchUnpaidInvoices = useCallback(async () => {
        if (!partnerId || !companyId) {
            setUnpaidInvoices([]);
            return;
        }
        setIsInvoicesLoading(true);
        try {
            const res = await coreInvoicesApi.listInvoices({
                companyId,
                partnerId,
                page: 0,
                size: 200,
            });
            const content = res.data.data?.content || [];
            const filtered = content.filter((inv) => {
                const expectedType = paymentType === "in" ? "AR" : "AP";
                if (inv.invoiceType !== expectedType) return false;
                const validStatus = inv.status === "open" || inv.status === "in_payment";
                if (!validStatus) return false;
                if (inv.invoiceType === "AP" && inv.approvalStatus !== "approved") return false;
                const remaining = (inv.totalAmount || 0) - (inv.paidAmount || 0);
                return remaining > 0;
            });
            setUnpaidInvoices(filtered);
        } catch (e) {
            console.error("Lỗi khi tải hóa đơn:", e);
        } finally {
            setIsInvoicesLoading(false);
        }
    }, [partnerId, paymentType, companyId]);

    useEffect(() => { fetchUnpaidInvoices(); }, [fetchUnpaidInvoices]);

    // Reset invoiceId when partnerId or paymentType changes to prevent mismatched/invalid selections
    useEffect(() => {
        if (!isReadOnly) {
            form.setValue("invoiceId", "");
        }
    }, [partnerId, paymentType, form, isReadOnly]);

    /* ================= ACTIONS ================= */

    /** Ghi sổ payment → tạo Journal Entry. Sau đó reload, KHÔNG navigate */
    const handlePost = async () => {
        if (!id) return;
        const ok = window.confirm(
            "Bạn có chắc chắn muốn ghi sổ phiếu thanh toán này?\nSau khi ghi sổ, thông tin sẽ KHÔNG thể chỉnh sửa."
        );
        if (!ok) return;

        setIsPosting(true);
        try {
            await corePaymentsApi.postPayment({ id });
            success("Ghi sổ thành công!");
            await fetchDetail();
        } catch (e) {
            console.error("Ghi sổ thất bại:", e);
            error("Ghi sổ thất bại. Vui lòng thử lại.");
        } finally {
            setIsPosting(false);
        }
    };

    /* ================= SUBMIT ================= */

    const onSubmit: SubmitHandler<PaymentFormValues> = async (values) => {
        setIsSubmitting(true);
        try {
            const request: CreatePaymentRequest = {
                paymentType: values.paymentType,
                partnerId: values.partnerId,
                paymentDate: values.paymentDate,
                amount: values.amount,
                currencyCode: values.currencyCode,
                exchangeRate: values.exchangeRate,
                paymentMethod: values.paymentMethod,
                bankAccountId: values.bankAccountId && values.bankAccountId !== "" ? values.bankAccountId : undefined,
                reference: values.reference,
                companyId: companyId ?? "",
                invoiceId: values.invoiceId && values.invoiceId !== "none" ? values.invoiceId : undefined,
            };

            if (isEditMode && id) {
                const params: PaymentsApiUpdateRequest = { id, createPaymentRequest: request };
                await corePaymentsApi.update(params);
                success("Cập nhật phiếu thanh toán thành công!");
            } else {
                const params: PaymentsApiCreateRequest = { createPaymentRequest: request };
                const res = await corePaymentsApi.create(params);
                const newId = res.data.data?.id;
                success("Tạo phiếu thanh toán thành công! Tiếp theo: Ghi sổ để hoàn tất.");
                navigate(newId ? `/payments/${newId}/edit` : "/payments");
            }
        } catch (e) {
            console.error(e);
            error(isEditMode ? "Cập nhật thất bại." : "Tạo phiếu thất bại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ================= UI HELPERS ================= */

    const formatCurrency = (amount?: number, currency = "VND") =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency }).format(amount || 0);



    const currentStatus = isPosted ? "posted" : "draft";

    const getStatusColor = (status: string) => {
        if (status === "posted") return "bg-green-500";
        if (status === "draft") return "bg-amber-300";
        return "bg-slate-300";
    };

    if (isLoading && !form.formState.isDirty) {
        return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;
    }

    /* ================= RENDER ================= */

    return (
        <div className="space-y-6">
            {/* PAGE HEADER */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigate("/payments")}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold">
                    {isEditMode ? "Chi tiết phiếu thu/chi" : "Tạo phiếu thu/chi mới"}
                </h2>
            </div>

            {/* ALERT – sau khi ghi sổ */}
            {isPosted && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Phiếu đã ghi sổ</AlertTitle>
                    <AlertDescription>
                        Phiếu này đã được ghi sổ kế toán. Thông tin không thể chỉnh sửa.
                        Bạn có thể phân bổ hoặc xóa phân bổ hóa đơn ở phần bên dưới.
                    </AlertDescription>
                </Alert>
            )}

            {/* ALERT – hướng dẫn bước tiếp theo sau khi tạo */}
            {isEditMode && !isPosted && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Bước tiếp theo</AlertTitle>
                    <AlertDescription>
                        Phiếu đang ở trạng thái <strong>Nháp</strong>. Sau khi kiểm tra thông tin,
                        nhấn <strong>"Ghi sổ (Post)"</strong> để ghi nhận vào sổ cái và phân bổ hóa đơn.
                    </AlertDescription>
                </Alert>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-10 gap-6">

                    {/* ── MAIN CONTENT – 8 cols ────────────────────────────── */}
                    <div className="space-y-6 col-span-8">

                        {/* CARD: Thông tin chính */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin chính</CardTitle>
                                <CardDescription>Nhập thông tin cơ bản của phiếu thu/chi</CardDescription>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-3 gap-4">

                                {/* Loại thanh toán */}
                                <FormField name="paymentType" control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Loại <span className="text-destructive">*</span></FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
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
                                <FormField name="partnerId" control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Đối tác <span className="text-destructive">*</span></FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isLoading || isReadOnly}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Chọn đối tác" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {partners.map((p) => (
                                                        <SelectItem key={p.id} value={p.id!}>{p.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Ngày thanh toán */}
                                <FormField name="paymentDate" control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ngày thanh toán <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} readOnly={isReadOnly} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Số tiền */}
                                <FormField name="amount" control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Số tiền <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number" min={0} step="any"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                    readOnly={isReadOnly}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Tiền tệ */}
                                <FormField name="currencyCode" control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tiền tệ</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
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
                                <FormField name="exchangeRate" control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tỷ giá</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number" min={0} step="any"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                    readOnly={isReadOnly}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* CARD: Phương thức thanh toán */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Phương thức thanh toán</CardTitle>
                                <CardDescription>Chọn phương thức và thông tin tham chiếu</CardDescription>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-3 gap-4">

                                {/* Phương thức */}
                                <FormField name="paymentMethod" control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phương thức <span className="text-destructive">*</span></FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
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

                                {/* Tài khoản Thanh toán (Ngân hàng / Tiền mặt) */}
                                <FormField name="bankAccountId" control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {paymentMethod === "cash" ? "Tài khoản tiền mặt" : "Tài khoản ngân hàng"} <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isLoading || isReadOnly}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder={paymentMethod === "cash" ? "Chọn tài khoản tiền mặt" : "Chọn tài khoản ngân hàng"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {(() => {
                                                        const filtered = bankAccounts.filter((b) => {
                                                            if (paymentMethod === "cash") {
                                                                return b.type === "cash";
                                                            }
                                                            if (paymentMethod === "bank_transfer") {
                                                                return b.type === "bank";
                                                            }
                                                            return true;
                                                        });
                                                        const listToRender = filtered.length > 0 ? filtered : bankAccounts;
                                                        return listToRender.map((b) => (
                                                            <SelectItem key={b.id} value={b.id!}>
                                                                {b.name} {b.accountNumber ? `— ${b.accountNumber}` : ""} ({b.type === "cash" ? "Tiền mặt" : "Ngân hàng"})
                                                            </SelectItem>
                                                        ));
                                                    })()}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Tham chiếu */}
                                <FormField name="reference" control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tham chiếu</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Số tham chiếu, lý do…" {...field} readOnly={isReadOnly} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Hóa đơn liên kết (Nếu có) */}
                                {isReadOnly && form.getValues("invoiceId") ? (
                                    <FormItem>
                                        <FormLabel>Hóa đơn thanh toán</FormLabel>
                                        <Input value={invoiceNumber || "Hóa đơn liên kết"} readOnly />
                                    </FormItem>
                                ) : (
                                    !isReadOnly && (
                                        <FormField name="invoiceId" control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Hóa đơn thanh toán</FormLabel>
                                                    <Select
                                                        onValueChange={(val) => {
                                                            field.onChange(val);
                                                            const currentAmount = form.getValues("amount");
                                                            if (!currentAmount || currentAmount === 0) {
                                                                const inv = unpaidInvoices.find((i) => i.id === val);
                                                                if (inv) {
                                                                    const remaining = (inv.totalAmount || 0) - (inv.paidAmount || 0);
                                                                    form.setValue("amount", remaining);
                                                                }
                                                            }
                                                        }}
                                                        value={field.value}
                                                        disabled={!partnerId}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder={
                                                                    !partnerId
                                                                        ? "Vui lòng chọn đối tác trước"
                                                                        : isInvoicesLoading
                                                                            ? "Đang tải danh sách hóa đơn..."
                                                                            : unpaidInvoices.length === 0
                                                                                ? "Không có hóa đơn còn nợ"
                                                                                : "Chọn hóa đơn (tùy chọn)"
                                                                } />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="none">-- Không liên kết hóa đơn --</SelectItem>
                                                            {unpaidInvoices.map((inv) => {
                                                                const remaining = (inv.totalAmount || 0) - (inv.paidAmount || 0);
                                                                return (
                                                                    <SelectItem key={inv.id} value={inv.id!}>
                                                                        {inv.invoiceNumber || `HĐ (${inv.id?.slice(0, 8)})`} — Còn nợ: {formatCurrency(remaining, inv.currencyCode)}
                                                                    </SelectItem>
                                                                );
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* ── SIDEBAR – 2 cols ─────────────────────────────────── */}
                    <div className="action col-span-2">
                        <Card className="mx-auto w-full">
                            <CardHeader>
                                <CardTitle>Trạng thái</CardTitle>
                                <CardDescription>Trạng thái của phiếu</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="relative w-full">
                                    <span
                                        className={`absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full ${getStatusColor(currentStatus)}`}
                                    />
                                    <Input className="pl-8 uppercase" value={currentStatus} readOnly />
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-3 pt-0">
                                {/* Hủy / Về danh sách */}
                                <ButtonSpin
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    isLoading={false}
                                    onClick={() => navigate("/payments")}
                                    disabled={isSubmitting || isPosting}
                                >
                                    {isPosted ? "Đóng" : "Hủy"}
                                </ButtonSpin>

                                {/* Lưu nháp / Cập nhật – chỉ khi chưa posted */}
                                {!isReadOnly && (
                                    <ButtonSpin
                                        type="submit"
                                        variant="secondary"
                                        className="w-full"
                                        isLoading={isSubmitting}
                                        loadingText="Đang lưu..."
                                        disabled={isSubmitting || isLoading || isPosting}
                                    >
                                        {isEditMode ? "Cập nhật" : "Lưu nháp"}
                                    </ButtonSpin>
                                )}

                                {/* Ghi sổ – chỉ ở edit mode, chưa posted */}
                                {isEditMode && !isPosted && (
                                    <ButtonSpin
                                        type="button"
                                        variant="default"
                                        className="w-full"
                                        isLoading={isPosting}
                                        loadingText="Đang ghi sổ..."
                                        onClick={handlePost}
                                        disabled={isSubmitting || isPosting}
                                    >
                                        Ghi sổ (Post)
                                    </ButtonSpin>
                                )}
                            </CardFooter>
                        </Card>
                    </div>

                </form>
            </Form>
        </div>
    );
};

export default PaymentFormPage;

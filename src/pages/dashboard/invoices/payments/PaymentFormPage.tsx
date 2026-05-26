import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, AlertCircle, Trash2, Plus } from "lucide-react";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table.tsx";
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
    InvoicePaymentResponse,
} from "@/api/generated/core";
import { useToastApp } from "@hooks/use-toast-app.ts";
import { useAuth } from "@/hooks/useAuth";

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
        (data) => data.paymentMethod !== "bank_transfer" || !!data.bankAccountId,
        {
            message: "Phải chọn tài khoản ngân hàng khi phương thức là Chuyển khoản",
            path: ["bankAccountId"],
        }
    );

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
    const [allocations, setAllocations] = useState<InvoicePaymentResponse[]>([]);

    /* ── Invoice list for allocation ────────────────────────────────── */
    const [unpaidInvoices, setUnpaidInvoices] = useState<InvoiceResponse[]>([]);
    const [isInvoicesLoading, setIsInvoicesLoading] = useState(false);

    /* ── Loading states ──────────────────────────────────────────────── */
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [isAllocating, setIsAllocating] = useState(false);
    const [removingAllocId, setRemovingAllocId] = useState<string | null>(null);

    /* ── Allocation form state ───────────────────────────────────────── */
    const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
    const [allocateAmount, setAllocateAmount] = useState<number>(0);

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
    const partnerId = form.watch("partnerId");
    const paymentType = form.watch("paymentType");
    const currencyCode = form.watch("currencyCode");

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
            setAllocations(p.allocations || []);

            form.reset({
                paymentType: p.paymentType || "in",
                partnerId: p.partnerId || "",
                paymentDate: p.paymentDate || new Date().toISOString().split("T")[0],
                amount: p.amount || 0,
                currencyCode: p.currencyCode || "VND",
                exchangeRate: 1,
                paymentMethod: p.paymentMethod || "cash",
                bankAccountId: "", // PaymentResponse không trả về bankAccountId
                reference: p.reference || "",
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

    /* ── Fetch unpaid invoices – chỉ khi đã posted để dùng cho allocation ── */
    const fetchUnpaidInvoices = useCallback(async () => {
        if (!partnerId || !companyId || !isPosted) {
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
    }, [partnerId, paymentType, companyId, isPosted]);

    useEffect(() => { fetchUnpaidInvoices(); }, [fetchUnpaidInvoices]);

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
            success("Ghi sổ thành công! Bạn có thể phân bổ hóa đơn bên dưới.");
            await fetchDetail(); // Reload để hiển thị section phân bổ
        } catch (e) {
            console.error("Ghi sổ thất bại:", e);
            error("Ghi sổ thất bại. Vui lòng thử lại.");
        } finally {
            setIsPosting(false);
        }
    };

    /** Phân bổ payment vào một hóa đơn */
    const handleAllocate = async () => {
        if (!id || !selectedInvoiceId || allocateAmount <= 0) {
            error("Vui lòng chọn hóa đơn và nhập số tiền hợp lệ.");
            return;
        }
        setIsAllocating(true);
        try {
            const res = await corePaymentsApi.allocate({
                id,
                allocatePaymentRequest: {
                    invoiceId: selectedInvoiceId,
                    amount: allocateAmount,
                },
            });
            setAllocations(res.data.data?.allocations || []);
            setSelectedInvoiceId("");
            setAllocateAmount(0);
            success("Phân bổ hóa đơn thành công!");
            // Refresh danh sách invoices còn nợ
            await fetchUnpaidInvoices();
        } catch (e: unknown) {
            console.error("Phân bổ thất bại:", e);
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
            error(msg || "Phân bổ thất bại. Kiểm tra số tiền hoặc trạng thái hóa đơn.");
        } finally {
            setIsAllocating(false);
        }
    };

    /** Xóa phân bổ khỏi một hóa đơn */
    const handleRemoveAllocation = async (invoiceId: string) => {
        if (!id) return;
        setRemovingAllocId(invoiceId);
        try {
            await corePaymentsApi.removeAllocation({ id, invoiceId });
            success("Đã xóa phân bổ.");
            await fetchDetail(); // Reload toàn bộ
        } catch (e) {
            console.error("Xóa phân bổ thất bại:", e);
            error("Xóa phân bổ thất bại.");
        } finally {
            setRemovingAllocId(null);
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
                bankAccountId: isBankTransfer ? values.bankAccountId : undefined,
                reference: values.reference,
                companyId: companyId ?? "",
            };

            if (isEditMode && id) {
                const params: PaymentsApiUpdateRequest = { id, createPaymentRequest: request };
                await corePaymentsApi.update(params);
                success("Cập nhật phiếu thanh toán thành công!");
            } else {
                // Tạo mới → redirect sang edit để tiếp tục ghi sổ & phân bổ
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

    const formatDate = (d?: string) =>
        d ? new Intl.DateTimeFormat("vi-VN").format(new Date(d)) : "---";

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

                                {/* TK Ngân hàng – chỉ khi bank_transfer */}
                                {isBankTransfer && (
                                    <FormField name="bankAccountId" control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>TK Ngân hàng <span className="text-destructive">*</span></FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} disabled={isLoading || isReadOnly}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
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
                            </CardContent>
                        </Card>

                        {/* ── CARD: Phân bổ hóa đơn – chỉ hiện sau khi posted ── */}
                        {isEditMode && isPosted && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Phân bổ hóa đơn</CardTitle>
                                    <CardDescription>
                                        Liên kết khoản thanh toán này với các hóa đơn còn nợ ({paymentType === "in" ? "AR" : "AP"})
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">

                                    {/* Bảng allocations hiện tại */}
                                    {allocations.length > 0 ? (
                                        <Table className="border">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Mã hóa đơn</TableHead>
                                                    <TableHead>Ngày phân bổ</TableHead>
                                                    <TableHead className="text-right">Số tiền phân bổ</TableHead>
                                                    <TableHead className="w-[60px]"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {allocations.map((alloc) => (
                                                    <TableRow key={alloc.id}>
                                                        <TableCell className="font-medium">
                                                            {alloc.invoiceNumber || "---"}
                                                        </TableCell>
                                                        <TableCell>{formatDate(alloc.paymentDate)}</TableCell>
                                                        <TableCell className="text-right">
                                                            {formatCurrency(alloc.allocatedAmount, currencyCode)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                disabled={removingAllocId === alloc.invoiceId}
                                                                onClick={() => alloc.invoiceId && handleRemoveAllocation(alloc.invoiceId)}
                                                                title="Xóa phân bổ"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-6 border rounded-md">
                                            Chưa có phân bổ nào. Thêm phân bổ bên dưới.
                                        </p>
                                    )}

                                    {/* Form thêm phân bổ mới */}
                                    {partnerId ? (
                                        <div className="border rounded-md p-4 space-y-3 bg-muted/30">
                                            <p className="text-sm font-medium text-foreground">Thêm phân bổ mới</p>
                                            <div className="grid grid-cols-3 gap-3 items-end">
                                                <div className="col-span-2 space-y-1">
                                                    <p className="text-xs text-muted-foreground">Hóa đơn</p>
                                                    <Select
                                                        value={selectedInvoiceId}
                                                        onValueChange={(val) => {
                                                            setSelectedInvoiceId(val);
                                                            const inv = unpaidInvoices.find((i) => i.id === val);
                                                            if (inv) {
                                                                const remaining = (inv.totalAmount || 0) - (inv.paidAmount || 0);
                                                                setAllocateAmount(remaining);
                                                            }
                                                        }}
                                                        disabled={isInvoicesLoading}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder={
                                                                isInvoicesLoading
                                                                    ? "Đang tải hóa đơn..."
                                                                    : unpaidInvoices.length === 0
                                                                        ? "Không có hóa đơn còn nợ"
                                                                        : "Chọn hóa đơn để phân bổ"
                                                            } />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {unpaidInvoices.map((inv) => {
                                                                const remaining = (inv.totalAmount || 0) - (inv.paidAmount || 0);
                                                                return (
                                                                    <SelectItem key={inv.id} value={inv.id!}>
                                                                        {inv.invoiceNumber || `HĐ (${inv.id?.slice(0, 8)})`}
                                                                        {" "}— Còn nợ: {formatCurrency(remaining, inv.currencyCode)}
                                                                    </SelectItem>
                                                                );
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground">Số tiền phân bổ</p>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        step="any"
                                                        placeholder="0"
                                                        value={allocateAmount || ""}
                                                        onChange={(e) => setAllocateAmount(e.target.valueAsNumber)}
                                                    />
                                                </div>
                                            </div>
                                            <ButtonSpin
                                                type="button"
                                                variant="outline"
                                                isLoading={isAllocating}
                                                loadingText="Đang phân bổ..."
                                                onClick={handleAllocate}
                                                disabled={!selectedInvoiceId || !(allocateAmount > 0) || isAllocating}
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Phân bổ
                                            </ButtonSpin>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-2">
                                            Không có đối tác. Không thể phân bổ hóa đơn.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )}
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
                                {isPosted && (
                                    <p className="text-xs text-muted-foreground">
                                        Phân bổ: <span className="font-semibold">{allocations.length} hóa đơn</span>
                                    </p>
                                )}
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

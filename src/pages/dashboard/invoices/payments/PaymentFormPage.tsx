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

import { corePaymentsApi, corePartnersApi, coreBankAccountsApi } from "@/api";
import type {
    PartnerResponse,
    BankAccountResponse,
    CreatePaymentRequest,
    BankAccountsApiList3Request,
    PartnersApiList1Request,
    PaymentsApiGetDetailRequest,
    PaymentsApiUpdateRequest,
    PaymentsApiCreateRequest,
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

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const partnersReq: PartnersApiList1Request = {
                companyId,
                page: 0,
                size: 200,
            };
            const bankReq: BankAccountsApiList3Request = {
                companyId,
                page: 0,
                size: 100,
            };
            const [partRes, bankRes] = await Promise.all([
                corePartnersApi.list1(partnersReq),
                coreBankAccountsApi.list3(bankReq),
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
            const hasAllocations = (p.allocations?.length || 0) > 0;
            setIsAllocated(hasAllocations);

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
    }, [id, isEditMode, error, form]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    /* ================= SUBMIT ================= */

    const onSubmit: SubmitHandler<PaymentFormValues> = async (values) => {
        setIsSubmitting(true);
        try {
            const request: CreatePaymentRequest = {
                ...values,
                companyId: companyId ?? "",
                bankAccountId: isBankTransfer ? values.bankAccountId : undefined,
            };

            if (isEditMode && id) {
                const params: PaymentsApiUpdateRequest = {
                    id,
                    createPaymentRequest: request,
                };
                await corePaymentsApi.update(params);
                success("Cập nhật phiếu thanh toán thành công!");
            } else {
                const params: PaymentsApiCreateRequest = {
                    createPaymentRequest: request,
                };
                await corePaymentsApi.create(params);
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

    if (isLoading && !form.formState.isDirty) {
        return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;
    }

    const currentStatus = isPosted ? "ĐÃ GHI SỔ" : isAllocated ? "ĐÃ PHÂN BỔ" : "NHÁP";

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ĐÃ GHI SỔ": return "bg-green-500";
            case "ĐÃ PHÂN BỔ": return "bg-blue-500";
            default: return "bg-amber-300";
        }
    };

    return (
        <div className="space-y-6">
            {/* PAGE HEADER */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigate("/payments")}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold">
                    {isEditMode ? "Chỉnh sửa phiếu thu/chi" : "Tạo phiếu thu/chi mới"}
                </h2>
            </div>

            {/* ALERT – chỉ hiện khi có cảnh báo */}
            {(isPosted || isAllocated) && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Lưu ý quan trọng</AlertTitle>
                    <AlertDescription>
                        {isPosted
                            ? "Phiếu này đã được ghi sổ kế toán. Không thể chỉnh sửa hoặc xóa."
                            : "Phiếu này đang được liên kết (phân bổ) với hóa đơn. Việc cập nhật có thể thất bại."}
                    </AlertDescription>
                </Alert>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-10 gap-6">

                    {/* MAIN CONTENT – 8 cols */}
                    <div className="space-y-6 col-span-8">

                        {/* CARD: Thông tin chính */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin chính</CardTitle>
                                <CardDescription>Nhập thông tin cơ bản của phiếu thu/chi</CardDescription>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-3 gap-4">
                                {/* Loại thanh toán */}
                                <FormField
                                    name="paymentType"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Loại </FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isPosted}>
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
                                <FormField
                                    name="partnerId"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Đối tác </FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isLoading || isPosted}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
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
                                            <FormLabel>Ngày thanh toán </FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} readOnly={isPosted} />
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
                                            <FormLabel>Số tiền </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    step="any"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                    readOnly={isPosted}
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
                                            <FormLabel>Tiền tệ </FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isPosted}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
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
                                                    type="number"
                                                    min={0}
                                                    step="any"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                    readOnly={isPosted}
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
                                <FormField
                                    name="paymentMethod"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phương thức </FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isPosted}>
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

                                {/* TK Ngân hàng – chỉ hiện khi bank_transfer */}
                                {isBankTransfer && (
                                    <FormField
                                        name="bankAccountId"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>TK Ngân hàng </FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} disabled={isLoading || isPosted}>
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
                                <FormField
                                    name="reference"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tham chiếu</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Số tham chiếu, lý do…" {...field} readOnly={isPosted} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* SIDEBAR – 2 cols */}
                    <div className="action col-span-2">
                        <Card className="mx-auto w-full">
                            <CardHeader>
                                <CardTitle>Trạng thái</CardTitle>
                                <CardDescription>Trạng thái của phiếu</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative w-full">
                                    <span
                                        className={`absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full ${getStatusColor(currentStatus)}`}
                                    />
                                    <Input className="pl-8 uppercase" value={currentStatus} readOnly />
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4 pt-0">
                                <ButtonSpin
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    isLoading={false}
                                    onClick={() => navigate("/payments")}
                                    disabled={isSubmitting}
                                >
                                    Hủy
                                </ButtonSpin>
                                <ButtonSpin
                                    type="submit"
                                    variant="default"
                                    className="w-full"
                                    isLoading={isSubmitting}
                                    loadingText="Đang lưu..."
                                    disabled={isSubmitting || isLoading || isPosted}
                                >
                                    {isEditMode ? "Cập nhật" : "Tạo mới"}
                                </ButtonSpin>
                            </CardFooter>
                        </Card>
                    </div>

                </form>
            </Form>
        </div>
    );
};

export default PaymentFormPage;

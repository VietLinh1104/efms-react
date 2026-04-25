import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, MoreHorizontal, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@components/ui/button.tsx";
import { Card, CardHeader, CardFooter, CardTitle, CardContent, CardDescription, CardAction } from "@components/ui/card.tsx";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
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
    TableFooter,
} from "@components/ui/table.tsx";

import { coreAccountsApi, corePartnersApi, coreInvoicesApi } from "@/api";
import type {
    AccountResponse,
    PartnerResponse,
    CreateInvoiceRequest,
    AccountsApiList6Request,
    PartnersApiList1Request,
    InvoiceResponse
} from "@/api/generated/core";

import { useToastApp } from "@hooks/use-toast-app.ts";
import { useAuth } from "@/hooks/useAuth";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@components/ui/dropdown-menu.tsx";
import { ButtonSpin } from "@components/common/ButtonSpin.tsx";
import {AttachmentSection} from "@components/common/AttachmentSection.tsx";

/* ================= SCHEMA ================= */

const invoiceLineSchema = z.object({
    description: z.string().min(1, "Bắt buộc"),
    accountId: z.string().min(1, "Bắt buộc"),
    quantity: z.number().min(0),
    unitPrice: z.number().min(0),
    taxRate: z.number().optional(),
    taxAmount: z.number().optional(),
    amount: z.number(),
});

const invoiceSchema = z.object({
    invoiceType: z.string().min(1),
    partnerId: z.string().min(1),
    invoiceNumber: z.string().optional(),
    invoiceDate: z.string().min(1),
    dueDate: z.string().optional(),
    currencyCode: z.string().min(1),
    exchangeRate: z.number().optional(),
    lines: z.array(invoiceLineSchema).min(1),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface ExtendedInvoiceResponse extends InvoiceResponse {
    approvalStatus?: string;
}

/* ================= COMPONENT ================= */

const InvoiceFormPage: React.FC = () => {
    const { success, error } = useToastApp();
    const { companyId } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [partners, setPartners] = useState<PartnerResponse[]>([]);
    const [invoice, setInvoice] = useState<ExtendedInvoiceResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isApproveLoading, setIsApproveLoading] = useState(false);
    const [isRejectLoading, setIsRejectLoading] = useState(false);
    const [isConfirmLoading, setIsConfirmLoading] = useState(false);

    const isEditMode = !!id;
    const isFinanceOrAdmin = true; // Temporary allow everyone

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            invoiceType: "AR",
            partnerId: "",
            invoiceNumber: "",
            invoiceDate: new Date().toISOString().split("T")[0],
            dueDate: "",
            currencyCode: "VND",
            exchangeRate: 1,
            lines: [
                {
                    description: "",
                    accountId: "",
                    quantity: 1,
                    unitPrice: 0,
                    taxRate: 0,
                    taxAmount: 0,
                    amount: 0,
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "lines",
    });

    const fetchDetail = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const res = await coreInvoicesApi.getInvoiceDetail({ id });
            const data = ((res.data).data || res.data) as ExtendedInvoiceResponse;
            setInvoice(data);

            form.reset({
                invoiceType: data.invoiceType || "AR",
                partnerId: data.partnerId || "",
                invoiceNumber: data.invoiceNumber || "",
                invoiceDate: data.invoiceDate ? new Date(data.invoiceDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
                dueDate: data.dueDate ? new Date(data.dueDate).toISOString().split("T")[0] : "",
                currencyCode: data.currencyCode || "VND",
                exchangeRate: data.exchangeRate || 1,
                lines: data.lines?.map((l) => ({
                    description: l.description || "",
                    accountId: l.accountId || "",
                    quantity: l.quantity || 0,
                    unitPrice: l.unitPrice || 0,
                    taxRate: l.taxRate || 0,
                    taxAmount: l.taxAmount || 0,
                    amount: l.amount || 0,
                })) || [],
            });
        } catch (err) {
            console.error("Fetch invoice detail failed:", err);
            error("Không thể tải chi tiết hóa đơn.");
        } finally {
            setIsLoading(false);
        }
    }, [id, error, form]);

    useEffect(() => {
        const fetchCommon = async () => {
            const AccountsApiList7Request: AccountsApiList6Request = {
                companyId: companyId ?? "",
            }
            const PartnersApiList1Request: PartnersApiList1Request = {
                companyId: companyId ?? "",
                type: undefined,
                search: "",
                page: 0,
                size: 100,
            }
            try {
                const [acc, part] = await Promise.all([
                    coreAccountsApi.list6(AccountsApiList7Request),
                    corePartnersApi.list1(PartnersApiList1Request),
                ]);
                setAccounts(acc.data.data || []);
                setPartners(part.data.data?.content || []);
            } catch (e) {
                console.error(e);
            }
        };

        fetchCommon();
        if (id) {
            fetchDetail();
        }
    }, [id, fetchDetail, companyId]);

    /* ================= ACTIONS ================= */

    const handleConfirm = async () => {
        setIsConfirmLoading(true);
        if (!id) return;
        try {
            await coreInvoicesApi.confirmInvoiceToProcess({ id });
            success("Xác nhận hóa đơn thành công!");
            fetchDetail();
        } catch (err) {
            console.error("Confirm fail", err);
            error("Xác nhận thất bại.");
        } finally {
            setIsConfirmLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!id) return;
        setIsApproveLoading(true);
        try {
            await coreInvoicesApi.approveInvoice({ id });
            success("Đã duyệt hóa đơn AP!");
            fetchDetail();
        } catch (err) {
            console.error("Approve fail", err);
            error("Duyệt hóa đơn thất bại.");
        } finally {
            setIsApproveLoading(false);
        }
    };

    const handleReject = async () => {
        if (!id) return;
        setIsRejectLoading(true);
        try {
            await coreInvoicesApi.rejectInvoice({ id });
            success("Đã từ chối hóa đơn!");
            fetchDetail();
        } catch (err) {
            console.error("Reject fail", err);
            error("Từ chối thất bại.");
        } finally {
            setIsApproveLoading(false);
        }
    };

    /* ================= CALC ================= */

    const lines = useWatch({
        control: form.control,
        name: "lines",
    });

    const calculatedLines = useMemo(() => {
        return (lines || []).map((l) => {
            const quantity = Number(l?.quantity) || 0;
            const unitPrice = Number(l?.unitPrice) || 0;
            const taxRate = Number(l?.taxRate) || 0;

            const amount = quantity * unitPrice;
            const taxAmount = amount * (taxRate / 100);
            return { ...l, amount, taxAmount };
        });
    }, [lines]);

    const subtotal = useMemo(
        () => calculatedLines.reduce((s, l) => s + l.amount, 0),
        [calculatedLines]
    );

    const taxTotal = useMemo(
        () => calculatedLines.reduce((s, l) => s + (l.taxAmount || 0), 0),
        [calculatedLines]
    );

    const total = subtotal + taxTotal;

    useEffect(() => {
        calculatedLines.forEach((l, i) => {
            const currentAmount = form.getValues(`lines.${i}.amount`);
            const currentTaxAmount = form.getValues(`lines.${i}.taxAmount`);

            if (currentAmount !== l.amount) {
                form.setValue(`lines.${i}.amount`, l.amount);
            }
            if (currentTaxAmount !== l.taxAmount) {
                form.setValue(`lines.${i}.taxAmount`, l.taxAmount || 0);
            }
        });
    }, [calculatedLines, form]);

    /* ================= SUBMIT ================= */

    const onSubmit: SubmitHandler<InvoiceFormValues> = async (values) => {
        setIsSubmitting(true);
        try {
            const requestPayload: CreateInvoiceRequest = {
                ...values,
                companyId: companyId,
                lines: values.lines.map((l) => ({
                    ...l,
                    taxRate: l.taxRate ?? 0,
                    amount: l.quantity * l.unitPrice,
                    taxAmount: (l.quantity * l.unitPrice * (l.taxRate ?? 0)) / 100,
                }))
            };

            if (isEditMode) {
                console.log("req body:", {
                    createInvoiceRequest: requestPayload,
                    id: id
                });
                const res = await coreInvoicesApi.updateDraftInvoice({
                    updateInvoiceRequest: requestPayload,
                    id: id
                });


                if (res.data?.data && res.data?.status == 200) {
                    success("Cập nhật hóa đơn thành công");
                } else {
                    error("Đã xảy ra lỗi khi cập nhật");
                }
            } else {
                const res = await coreInvoicesApi.createDraftInvoice({ createInvoiceRequest: requestPayload });
                success("Tạo hóa đơn thành công");
                navigate(`/invoices/${res.data.data?.id}`);
            }
        } catch (e) {
            console.error(e);
            error(isEditMode ? "Cập nhật thất bại" : "Tạo thất bại");
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ================= UI ================= */

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;
    }

    const currentStatus = invoice?.status || "DRAFT";
    const currentApprovalStatus = invoice?.approvalStatus || "---";
    const isAP = form.watch("invoiceType") === "AP";
    const isReadOnly = isEditMode && currentStatus.toLowerCase() !== "draft";

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "draft": return "bg-amber-300";
            case "confirmed": return "bg-blue-500";
            case "approved": return "bg-green-500";
            case "rejected": return "bg-red-500";
            default: return "bg-slate-300";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigate("/invoices")}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold">
                    {isEditMode ? `Hóa đơn: ${invoice?.invoiceNumber || "N/A"}` : "Tạo hóa đơn"}
                </h2>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-10 gap-6">

                    {/* HEADER */}
                    <div className="space-y-6 col-span-8">
                        {/*MainInfo*/}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin chính</CardTitle>
                                <CardDescription>Nhập các thông tin chính của hóa đơn</CardDescription>
                            </CardHeader>
                            <CardContent className={"grid md:grid-cols-3 gap-4"}>
                                <FormField name="invoiceType" control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Loại</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                                                <FormControl>
                                                    <SelectTrigger className={"w-full"}><SelectValue /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="AR">AR Invoice</SelectItem>
                                                    <SelectItem value="AP">AP Bill</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField name="partnerId" control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Đối tác</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                                                <FormControl>
                                                    <SelectTrigger className={"w-full"}><SelectValue placeholder="Chọn" /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {partners.map(p => (
                                                        <SelectItem key={p.id} value={p.id!}>
                                                            {p.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField name="invoiceDate" control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ngày hóa đơn</FormLabel>
                                            <Input type="date" {...field} readOnly={isReadOnly} />
                                        </FormItem>
                                    )}
                                />

                                <FormField name="invoiceNumber" control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Số HĐ</FormLabel>
                                            <Input {...field} readOnly={isReadOnly} />
                                        </FormItem>
                                    )}
                                />

                                <FormField name="currencyCode" control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tiền tệ</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                                                <SelectTrigger className={"w-full"}><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="VND">VND</SelectItem>
                                                    <SelectItem value="USD">USD</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* TABLE */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Chi tiết hóa đơn</CardTitle>
                                <CardDescription>Dòng hóa đơn</CardDescription>
                                <CardAction>
                                    {!isReadOnly && (
                                        <Button type="button" onClick={() => append({
                                            description: "",
                                            accountId: "",
                                            quantity: 1,
                                            unitPrice: 0,
                                            taxRate: 0,
                                            taxAmount: 0,
                                            amount: 0,
                                        })}>
                                            <Plus className="w-4 h-4 mr-2" /> Thêm
                                        </Button>
                                    )}
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <Table className={"border"}>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Mô tả</TableHead>
                                            <TableHead>TK</TableHead>
                                            <TableHead>SL</TableHead>
                                            <TableHead>Giá</TableHead>
                                            <TableHead>Thuế%</TableHead>
                                            <TableHead>Thuế</TableHead>
                                            <TableHead>Tiền</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {fields.map((f, i) => (
                                            <TableRow key={f.id}>

                                                <TableCell>
                                                    <Input placeholder={"Nhập mô tả..."} className={"border-0 !bg-card "} {...form.register(`lines.${i}.description`)} readOnly={isReadOnly} />
                                                </TableCell>

                                                <TableCell >
                                                    <Select
                                                        onValueChange={(v) =>
                                                            form.setValue(`lines.${i}.accountId`, v)
                                                        }
                                                        disabled={isReadOnly}
                                                        value={form.watch(`lines.${i}.accountId`)}
                                                    >
                                                        <SelectTrigger className={"w-full"}>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {accounts.map(a => (
                                                                <SelectItem key={a.id} value={a.id!}>
                                                                    {a.code}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>

                                                <TableCell>
                                                    <Input placeholder={"SL"} className={"border-0 !bg-card "} type="number" {...form.register(`lines.${i}.quantity`, { valueAsNumber: true })} readOnly={isReadOnly} />
                                                </TableCell>

                                                <TableCell>
                                                    <Input placeholder={"Giá"} className={"border-0 !bg-card "} type="number" {...form.register(`lines.${i}.unitPrice`, { valueAsNumber: true })} readOnly={isReadOnly} />
                                                </TableCell>

                                                <TableCell>
                                                    <Input placeholder={"0%"} className={"border-0 !bg-card "} type="number" {...form.register(`lines.${i}.taxRate`, { valueAsNumber: true })} readOnly={isReadOnly} />
                                                </TableCell>

                                                <TableCell>
                                                    {calculatedLines[i]?.taxAmount.toLocaleString()}
                                                </TableCell>

                                                <TableCell>
                                                    {calculatedLines[i]?.amount.toLocaleString()}
                                                </TableCell>

                                                <TableCell>
                                                    {!isReadOnly && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                                <DropdownMenuItem
                                                                    onClick={() => { remove(i) }}
                                                                    className="text-destructive focus:text-destructive"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" /> Hủy/Xóa
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>

                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={6}>Subtotal</TableCell>
                                            <TableCell>{subtotal.toLocaleString()}</TableCell>
                                            <TableCell colSpan={1}></TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell colSpan={6}>Tax</TableCell>
                                            <TableCell>{taxTotal.toLocaleString()}</TableCell>
                                            <TableCell colSpan={1}></TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell colSpan={6}>Total</TableCell>
                                            <TableCell>{total.toLocaleString()}</TableCell>
                                            <TableCell colSpan={1}></TableCell>
                                        </TableRow>

                                    </TableFooter>
                                </Table>
                            </CardContent>

                        </Card>

                        {/*Attachment*/}
                        <AttachmentSection isReadOnly={isReadOnly} referenceId={""} referenceType={"invoice"}/>
                    </div>
                    <div className="action col-span-2">
                        <Card className="mx-auto w-full ">
                            <CardHeader>
                                <CardTitle>Trạng thái</CardTitle>
                                <CardDescription>
                                    Trạng thái của hóa đơn
                                </CardDescription>
                            </CardHeader>

                            <CardContent className={""}>
                                <div className="">
                                    <div className="relative w-full ">
                                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full ${getStatusColor(currentStatus)}`} />
                                        <Input className="pl-8 uppercase" value={currentStatus} readOnly={true} />
                                    </div>
                                </div>

                                {isAP && isEditMode && (
                                    <div className="mt-2">
                                        <div className="relative w-full ">
                                            <span className={`absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full ${getStatusColor(currentApprovalStatus)}`} />
                                            <Input className="pl-8 uppercase" value={currentApprovalStatus} readOnly={true} />
                                        </div>
                                    </div>
                                )}


                            </CardContent>
                            {((currentStatus.toLowerCase() === 'draft') || (isAP && (currentApprovalStatus.toLowerCase() === 'pending') && isFinanceOrAdmin)) && (
                                <CardFooter className={"flex flex-col gap-4 pt-0"}>
                                    {(currentStatus.toLowerCase() === 'draft') && (
                                        <ButtonSpin isLoading={isSubmitting} loadingText="Đang lưu..." onClick={() => { }} variant={"secondary"} className={"w-full"} disabled={isSubmitting}>
                                            {isEditMode ? "Cập nhật" : "Lưu"}
                                        </ButtonSpin>
                                    )}
                                    {isEditMode && (currentStatus.toLowerCase() === 'draft') && (
                                        <ButtonSpin isLoading={isConfirmLoading} variant={"default"} type="button" onClick={handleConfirm} className="w-full">
                                            Xác nhận
                                        </ButtonSpin>
                                    )}

                                    {isAP && (currentApprovalStatus.toLowerCase() === 'pending') && isFinanceOrAdmin && (
                                        <>
                                            <ButtonSpin variant={"default"} isLoading={isApproveLoading} type="button" onClick={handleApprove} className="  w-full">
                                                Duyệt
                                            </ButtonSpin>
                                            <ButtonSpin variant={"outline"} isLoading={isRejectLoading} type="button" onClick={handleReject} className="w-full">
                                                Từ chối
                                            </ButtonSpin>
                                        </>
                                    )}
                                </CardFooter>
                            )}
                        </Card>
                    </div>
                </form >
            </Form >
        </div >
    );
};

export default InvoiceFormPage;
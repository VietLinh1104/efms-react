import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {Plus, Trash2, MoreHorizontal} from "lucide-react";
import { Button } from "@components/ui/button.tsx";
import { Card,CardHeader,CardFooter,CardTitle,CardContent,CardDescription,CardAction } from "@components/ui/card.tsx";

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
    AccountsApiList7Request,
    PartnersApiList1Request,
    InvoicesApiCreate2Request
} from "@/api/generated/core";

import { useToastApp } from "@hooks/use-toast-app.ts";
import { useAuth } from "@/hooks/useAuth";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@components/ui/dropdown-menu.tsx";

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

/* ================= COMPONENT ================= */

const InvoiceFormPage: React.FC = () => {
    const { success, error } = useToastApp();
    const { companyId } = useAuth();

    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [partners, setPartners] = useState<PartnerResponse[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    /* ================= FETCH DATA ================= */

    useEffect(() => {
        const AccountsApiList7Request: AccountsApiList7Request = {
            companyId: companyId ?? "",
        }

        const PartnersApiList1Request: PartnersApiList1Request = {
            companyId: companyId ?? "",
            type: undefined,
            search: "",
            page: 0,
            size: 100,
        }

        const fetch = async () => {
            try {
                const [acc, part] = await Promise.all([
                    coreAccountsApi.list7(AccountsApiList7Request),
                    corePartnersApi.list1(PartnersApiList1Request),
                ]);

                setAccounts(acc.data.data || []);
                setPartners(part.data.data?.content || []);
            } catch (e) {
                console.error(e);
            }
        };

        fetch();
    }, []);

    /* ================= CALC ================= */

    const lines = form.watch("lines");

    const calculatedLines = useMemo(() => {
        return lines.map((l) => {
            const amount = (l.quantity || 0) * (l.unitPrice || 0);
            const taxAmount = amount * ((l.taxRate || 0) / 100);
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
            form.setValue(`lines.${i}.amount`, l.amount);
            form.setValue(`lines.${i}.taxAmount`, l.taxAmount || 0);
        });
    }, [calculatedLines]);

    /* ================= SUBMIT ================= */

    const onSubmit: SubmitHandler<InvoiceFormValues> = async (values) => {
        console.log("log1");

        setIsSubmitting(true);
        try {
            const request: CreateInvoiceRequest = {
                ...values,
                companyId: companyId ?? "",
                lines: values.lines.map((l) => ({
                    ...l,
                    taxRate: l.taxRate ?? 0,
                    amount: l.quantity * l.unitPrice,
                    taxAmount:
                        (l.quantity * l.unitPrice * (l.taxRate ?? 0)) / 100,
                }))
            };
            console.log(request);

            const InvoicesApiCreate2Request: InvoicesApiCreate2Request = {
                createInvoiceRequest: request
            };

            await coreInvoicesApi.create2(InvoicesApiCreate2Request);
            success("Tạo hóa đơn thành công");
            form.reset();
        } catch (e) {
            console.error(e);
            error("Tạo thất bại");
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ================= UI ================= */

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Tạo hóa đơn</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-10 gap-6">

                    {/* HEADER */}
                    <div className="space-y-6 col-span-8">
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
                                                   <Select onValueChange={field.onChange} value={field.value}>
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
                                                   <Select onValueChange={field.onChange} value={field.value}>
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
                                                   <Input type="date" {...field} />
                                               </FormItem>
                                           )}
                                />

                                <FormField name="invoiceNumber" control={form.control}
                                           render={({ field }) => (
                                               <FormItem>
                                                   <FormLabel>Số HĐ</FormLabel>
                                                   <Input {...field} />
                                               </FormItem>
                                           )}
                                />

                                <FormField name="currencyCode" control={form.control}
                                           render={({ field }) => (
                                               <FormItem>
                                                   <FormLabel>Tiền tệ</FormLabel>
                                                   <Select onValueChange={field.onChange} value={field.value}>
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
                                                    <Input placeholder={"Nhập mô tả..."} className={"border-0 !bg-card "} {...form.register(`lines.${i}.description`)} />
                                                </TableCell>

                                                <TableCell >
                                                    <Select
                                                        onValueChange={(v) =>
                                                            form.setValue(`lines.${i}.accountId`, v)
                                                        }
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
                                                    <Input placeholder={"Nhập mô tả..."} className={"border-0 !bg-card "} type="number" {...form.register(`lines.${i}.quantity`, { valueAsNumber: true })} />
                                                </TableCell>

                                                <TableCell>
                                                    <Input placeholder={"Nhập mô tả..."} className={"border-0 !bg-card "}  type="number" {...form.register(`lines.${i}.unitPrice`, { valueAsNumber: true })} />
                                                </TableCell>

                                                <TableCell>
                                                    <Input placeholder={"Nhập mô tả..."} className={"border-0 !bg-card "}  type="number" {...form.register(`lines.${i}.taxRate`, { valueAsNumber: true })} />
                                                </TableCell>

                                                <TableCell>
                                                    {calculatedLines[i]?.taxAmount.toLocaleString()}
                                                </TableCell>

                                                <TableCell>
                                                    {calculatedLines[i]?.amount.toLocaleString()}
                                                </TableCell>

                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                onClick={() => {remove(i)}}
                                                                className="text-destructive focus:text-destructive"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" /> Hủy/Xóa
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
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
                    </div>
                    <div className="action col-span-2">
                        <Card className="mx-auto w-full ">
                            <CardHeader>
                                <CardTitle>Trạng thái</CardTitle>
                                <CardDescription>Trạng thái của hóa đơn</CardDescription>
                            </CardHeader>
                            <CardContent className={""}>
                                <div className="relative max-w-sm w-full ">
                                    {/* Sử dụng top-1/2 và -translate-y-1/2 để căn giữa dọc tuyệt đối */}
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 bg-amber-300 rounded-full" />
                                    <Input className="pl-8" value={"DRAFT"} readOnly={true}/>
                                </div>
                            </CardContent>
                            <CardFooter className={"flex justify-end"}>
                                <Button type="submit" className={"w-full"} disabled={isSubmitting}>
                                    Lưu
                                </Button>
                            </CardFooter>
                        </Card>

                    </div>


                </form>
            </Form>
        </div>
    );
};

export default InvoiceFormPage;
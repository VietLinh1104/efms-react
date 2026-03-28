import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@components/ui/button.tsx";
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

import { accountsApi, partnersApi, invoicesApi } from "@/api";
import type {
    AccountResponse,
    PartnerResponse,
    CreateInvoiceRequest,
} from "@/api/generated";

import { useToastApp } from "@hooks/use-toast-app.ts";

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
        const companyId = "a5fbb4a1-e8bd-4749-aa6d-c422ded28107";

        const fetch = async () => {
            try {
                const [acc, part] = await Promise.all([
                    accountsApi.list7(companyId),
                    partnersApi.list1(companyId, undefined, undefined, 0, 100),
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
        setIsSubmitting(true);
        try {
            const request: CreateInvoiceRequest = {
                ...values,
                companyId: "a5fbb4a1-e8bd-4749-aa6d-c422ded28107",
                lines: values.lines.map((l) => ({
                    ...l,
                    taxRate: l.taxRate ?? 0,
                    amount: l.quantity * l.unitPrice,
                    taxAmount:
                        (l.quantity * l.unitPrice * (l.taxRate ?? 0)) / 100,
                }))
            };

            await invoicesApi.create2(request);
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
            <h2 className="text-2xl font-bold">New Invoice</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* HEADER */}
                    <div className="rounded-xl border p-6 grid md:grid-cols-3 gap-4">

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

                    </div>

                    {/* TABLE */}
                    <div className="border rounded-xl p-6">
                        <div className="flex justify-between mb-4">
                            <h3>Dòng hóa đơn</h3>
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
                        </div>

                        <Table>
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
                                            <Input {...form.register(`lines.${i}.description`)} />
                                        </TableCell>

                                        <TableCell>
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
                                            <Input type="number" {...form.register(`lines.${i}.quantity`, { valueAsNumber: true })} />
                                        </TableCell>

                                        <TableCell>
                                            <Input type="number" {...form.register(`lines.${i}.unitPrice`, { valueAsNumber: true })} />
                                        </TableCell>

                                        <TableCell>
                                            <Input type="number" {...form.register(`lines.${i}.taxRate`, { valueAsNumber: true })} />
                                        </TableCell>

                                        <TableCell>
                                            {calculatedLines[i]?.taxAmount.toLocaleString()}
                                        </TableCell>

                                        <TableCell>
                                            {calculatedLines[i]?.amount.toLocaleString()}
                                        </TableCell>

                                        <TableCell>
                                            <Button type="button" onClick={() => remove(i)}>
                                                <Trash2 />
                                            </Button>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>

                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={5}>Subtotal</TableCell>
                                    <TableCell>{subtotal.toLocaleString()}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell colSpan={5}>Tax</TableCell>
                                    <TableCell>{taxTotal.toLocaleString()}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell colSpan={5}>Total</TableCell>
                                    <TableCell>{total.toLocaleString()}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            <Save className="w-4 h-4 mr-2" />
                            Lưu
                        </Button>
                    </div>

                </form>
            </Form>
        </div>
    );
};

export default InvoiceFormPage;
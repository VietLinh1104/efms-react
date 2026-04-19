import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, ArrowLeft, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@components/ui/button.tsx";
import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardContent,
    CardDescription,
    CardAction,
} from "@components/ui/card.tsx";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu.tsx";
import { ButtonSpin } from "@components/common/ButtonSpin.tsx";

import { coreAccountsApi, corePartnersApi, coreFiscalPeriodsApi, coreJournalEntriesApi } from "@/api";
import type {
    AccountResponse,
    PartnerResponse,
    FiscalPeriodResponse,
    CreateJournalRequest,
    JournalLineRequest,
    AccountsApiList6Request,
    PartnersApiList1Request,
    FiscalPeriodsApiList5Request,
    JournalEntriesApiCreate4Request,
} from "@/api/generated/core";
import { useToastApp } from "@hooks/use-toast-app.ts";
import { useAuth } from "@/hooks/useAuth";
import {Badge} from "@components/ui/badge.tsx";

/* ================= SCHEMA ================= */

const journalLineSchema = z.object({
    accountId: z.string().min(1, "Bắt buộc"),
    partnerId: z.string(),
    description: z.string(),
    debit: z.number().min(0),
    credit: z.number().min(0),
    currencyCode: z.string(),
    exchangeRate: z.number().min(0),
});

const journalEntrySchema = z.object({
    entryDate: z.string().min(1, "Ngày chứng từ là bắt buộc"),
    reference: z.string(),
    description: z.string(),
    periodId: z.string().min(1, "Kỳ kế toán là bắt buộc"),
    source: z.string().min(1, "Nguồn là bắt buộc"),
    lines: z.array(journalLineSchema).min(2, "Phải có ít nhất 2 dòng bút toán"),
});

type JournalFormValues = z.infer<typeof journalEntrySchema>;

/* ================= COMPONENT ================= */

const JournalEntryPage: React.FC = () => {
    const { success, error, warning } = useToastApp();
    const { companyId } = useAuth();
    const navigate = useNavigate();

    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [partners, setPartners] = useState<PartnerResponse[]>([]);
    const [periods, setPeriods] = useState<FiscalPeriodResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<JournalFormValues>({
        resolver: zodResolver(journalEntrySchema),
        defaultValues: {
            entryDate: new Date().toISOString().split("T")[0],
            reference: "",
            description: "",
            periodId: "",
            source: "manual",
            lines: [
                { accountId: "", partnerId: "none", description: "", debit: 0, credit: 0, currencyCode: "VND", exchangeRate: 1 },
                { accountId: "", partnerId: "none", description: "", debit: 0, credit: 0, currencyCode: "VND", exchangeRate: 1 },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: "lines",
        control: form.control,
    });

    /* ================= FETCH ================= */

    const fetchData = useCallback(async () => {
        if (!companyId) return;
        setIsLoading(true);
        try {
            const accountsReq: AccountsApiList6Request = { companyId };
            const partnersReq: PartnersApiList1Request = {
                companyId,
                type: undefined,
                search: "",
                page: 0,
                size: 100,
            };
            const periodsReq: FiscalPeriodsApiList5Request = { companyId };

            const [accRes, partRes, perRes] = await Promise.all([
                coreAccountsApi.list6(accountsReq),
                corePartnersApi.list1(partnersReq),
                coreFiscalPeriodsApi.list5(periodsReq),
            ]);

            setAccounts(accRes.data.data || []);
            setPartners(partRes.data.data?.content || []);
            setPeriods(perRes.data.data || []);

            const openPeriod = perRes.data.data?.find((p) => p.status === "open");
            if (openPeriod) {
                form.setValue("periodId", openPeriod.id!);
            }
        } catch (e) {
            console.error("Error fetching journal form data:", e);
            error("Không thể tải dữ liệu. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    }, [companyId, error, form]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /* ================= CALC ================= */

    const lines = useWatch({ control: form.control, name: "lines" });

    const totalDebit = useMemo(
        () => (lines || []).reduce((sum, line) => sum + (Number(line.debit) || 0), 0),
        [lines]
    );
    const totalCredit = useMemo(
        () => (lines || []).reduce((sum, line) => sum + (Number(line.credit) || 0), 0),
        [lines]
    );
    const difference = Math.abs(totalDebit - totalCredit);
    const isBalanced = difference === 0 && totalDebit > 0;

    /* ================= SUBMIT ================= */

    const onSubmit: SubmitHandler<JournalFormValues> = async (values) => {
        if (!isBalanced) {
            warning("Tổng Nợ phải bằng Tổng Có và lớn hơn 0.", { title: "Lỗi cân đối" });
            return;
        }

        setIsSubmitting(true);
        try {
            const request: CreateJournalRequest = {
                entryDate: values.entryDate,
                reference: values.reference,
                description: values.description,
                periodId: values.periodId,
                companyId: companyId,
                lines: values.lines.map((line) => ({
                    accountId: line.accountId,
                    partnerId: line.partnerId === "none" ? undefined : line.partnerId,
                    debit: line.debit,
                    credit: line.credit,
                    currencyCode: line.currencyCode,
                    exchangeRate: line.exchangeRate,
                    description: line.description,
                })) as JournalLineRequest[],
            };

            const req2: JournalEntriesApiCreate4Request = { createJournalRequest: request };
            await coreJournalEntriesApi.create4(req2);

            success("Đã tạo chứng từ ghi sổ thành công.", { title: "Thành công" });
            form.reset();
        } catch (e) {
            console.error("Error creating journal entry:", e);
            error("Không thể tạo chứng từ. Vui lòng kiểm tra lại dữ liệu.", { title: "Lỗi" });
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ================= UI ================= */

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;
    }

    const balanceStatus = isBalanced ? "CÂN ĐỐI" : totalDebit === 0 && totalCredit === 0 ? "CHƯA NHẬP" : "KHÔNG CÂN";

    const getBalanceColor = (status: string) => {
        switch (status) {
            case "CÂN ĐỐI": return "bg-green-500";
            case "CHƯA NHẬP": return "bg-amber-300";
            default: return "bg-red-500";
        }
    };

    return (
        <div className="space-y-6">
            {/* PAGE HEADER */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold">Tạo chứng từ ghi sổ</h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-10 gap-6">

                    {/* MAIN CONTENT – 8 cols */}
                    <div className="space-y-6 col-span-8">

                        {/* CARD: Thông tin chung */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin chung</CardTitle>
                                <CardDescription>Nhập thông tin header của chứng từ ghi sổ</CardDescription>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-3 gap-4">
                                <FormField
                                    name="entryDate"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ngày chứng từ</FormLabel>
                                            <Input type="date" {...field} />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="reference"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tham chiếu</FormLabel>
                                            <Input placeholder="REF-001" {...field} />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="periodId"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kỳ kế toán</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Chọn kỳ" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {periods.map((p) => (
                                                        <SelectItem key={p.id} value={p.id!}>
                                                            {p.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="source"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nguồn</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Chọn nguồn" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="manual">Manual</SelectItem>
                                                    <SelectItem value="POS">POS</SelectItem>
                                                    <SelectItem value="HRM">HRM</SelectItem>
                                                    <SelectItem value="Inventory">Inventory</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="description"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Mô tả tổng quát</FormLabel>
                                            <Input placeholder="Nhập mô tả..." {...field} />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* CARD: Dòng bút toán */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Dòng bút toán</CardTitle>
                                <CardDescription>
                                    Thêm ít nhất 2 dòng và đảm bảo cân đối Nợ = Có.
                                </CardDescription>
                                <CardAction>
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            append({
                                                accountId: "",
                                                partnerId: "none",
                                                description: "",
                                                debit: 0,
                                                credit: 0,
                                                currencyCode: "VND",
                                                exchangeRate: 1,
                                            })
                                        }
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Thêm dòng
                                    </Button>
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <Table className="border">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tài khoản</TableHead>
                                            <TableHead>Đối tác</TableHead>
                                            <TableHead>Diễn giải dòng</TableHead>
                                            <TableHead>Nợ</TableHead>
                                            <TableHead>Có</TableHead>
                                            <TableHead>Loại tiền</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fields.map((field, index) => (
                                            <TableRow key={field.id}>
                                                {/* Tài khoản */}
                                                <TableCell>
                                                    <Select
                                                        onValueChange={(v) => form.setValue(`lines.${index}.accountId`, v)}
                                                        value={form.watch(`lines.${index}.accountId`)}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Chọn TK" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {accounts.map((acc) => (
                                                                <SelectItem key={acc.id} value={acc.id!}>
                                                                    {acc.code} - {acc.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>

                                                {/* Đối tác */}
                                                <TableCell>
                                                    <Select
                                                        onValueChange={(v) => form.setValue(`lines.${index}.partnerId`, v)}
                                                        value={form.watch(`lines.${index}.partnerId`)}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Chọn đối tác" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="none">---</SelectItem>
                                                            {partners.map((p) => (
                                                                <SelectItem key={p.id} value={p.id!}>
                                                                    {p.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>

                                                {/* Diễn giải */}
                                                <TableCell>
                                                    <Input
                                                        className="border-0 !bg-card"
                                                        placeholder="Diễn giải..."
                                                        {...form.register(`lines.${index}.description`)}
                                                    />
                                                </TableCell>

                                                {/* Nợ */}
                                                <TableCell>
                                                    <Input
                                                        className="border-0 !bg-card"
                                                        type="number"
                                                        {...form.register(`lines.${index}.debit`, { valueAsNumber: true })}
                                                        onChange={(e) => {
                                                            const val = Number(e.target.value);
                                                            form.setValue(`lines.${index}.debit`, val);
                                                            if (val > 0) form.setValue(`lines.${index}.credit`, 0);
                                                        }}
                                                    />
                                                </TableCell>

                                                {/* Có */}
                                                <TableCell>
                                                    <Input
                                                        className="border-0 !bg-card"
                                                        type="number"
                                                        {...form.register(`lines.${index}.credit`, { valueAsNumber: true })}
                                                        onChange={(e) => {
                                                            const val = Number(e.target.value);
                                                            form.setValue(`lines.${index}.credit`, val);
                                                            if (val > 0) form.setValue(`lines.${index}.debit`, 0);
                                                        }}
                                                    />
                                                </TableCell>

                                                {/* Loại tiền */}
                                                <TableCell>
                                                    <Select
                                                        onValueChange={(v) => form.setValue(`lines.${index}.currencyCode`, v)}
                                                        value={form.watch(`lines.${index}.currencyCode`)}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="VND">VND</SelectItem>
                                                            <SelectItem value="USD">USD</SelectItem>
                                                            <SelectItem value="EUR">EUR</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>

                                                {/* Action */}
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className="h-8 w-8 p-0"
                                                                disabled={fields.length <= 2}
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                onClick={() => remove(index)}
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
                                            <TableCell colSpan={3} >Tổng cộng</TableCell>
                                            <TableCell className={"px-5"}>{totalDebit.toLocaleString()}</TableCell>
                                            <TableCell className={"px-5"}>{totalCredit.toLocaleString()}</TableCell>
                                            <TableCell colSpan={2}></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={3}>Chênh lệch</TableCell>
                                            <TableCell colSpan={2} className={"px-5"}>
                                                {difference.toLocaleString()} {
                                                    difference === 0 ?
                                                        <Badge className={"ml-2"} variant={"default"}>{"Cân đối"}</Badge> :
                                                        <Badge className={"ml-2"} variant={"outline"}>{"Không cân đối"}</Badge>
                                                }
                                            </TableCell>
                                            <TableCell colSpan={2}></TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* SIDEBAR – 2 cols */}
                    <div className="action col-span-2">
                        <Card className="mx-auto w-full">
                            <CardHeader>
                                <CardTitle>Trạng thái</CardTitle>
                                <CardDescription>Trạng thái cân đối bút toán</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative w-full">
                                    <span
                                        className={`absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full ${getBalanceColor(balanceStatus)}`}
                                    />
                                    <Input className="pl-8 uppercase" value={balanceStatus} readOnly />
                                </div>

                            </CardContent>
                            <CardFooter className="flex flex-col gap-4 pt-0">
                                <ButtonSpin
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => form.reset()}
                                    disabled={isSubmitting}
                                    isLoading={false}
                                >
                                    Làm mới
                                </ButtonSpin>
                                <ButtonSpin
                                    type="submit"
                                    variant="default"
                                    className="w-full"
                                    isLoading={isSubmitting}
                                    loadingText="Đang lưu..."
                                    disabled={isSubmitting || !isBalanced}
                                >
                                    Lưu chứng từ
                                </ButtonSpin>
                            </CardFooter>
                        </Card>
                    </div>

                </form>
            </Form>
        </div>
    );
};

export default JournalEntryPage;

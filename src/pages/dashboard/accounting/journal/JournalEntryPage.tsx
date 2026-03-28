import React, { useEffect, useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Save } from "lucide-react";
import { cn } from "@/lib/utils.ts";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from "@components/ui/table.tsx";
import { accountsApi, partnersApi, fiscalPeriodsApi, journalEntriesApi } from "@/api";
import type { AccountResponse, PartnerResponse, FiscalPeriodResponse, CreateJournalRequest, JournalLineRequest } from "@/api/generated";
import { useToastApp } from "@hooks/use-toast-app.ts";

const journalLineSchema = z.object({
    accountId: z.string().min(1, "Tài khoản là bắt buộc"),
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

const JournalEntryPage: React.FC = () => {
    const { success, error, warning } = useToastApp();
    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [partners, setPartners] = useState<PartnerResponse[]>([]);
    const [periods, setPeriods] = useState<FiscalPeriodResponse[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<JournalFormValues>({
        resolver: zodResolver(journalEntrySchema),
        defaultValues: {
            entryDate: new Date().toISOString().split('T')[0],
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

    useEffect(() => {
        const companyId = 'a5fbb4a1-e8bd-4749-aa6d-c422ded28107';

        const fetchData = async () => {
            try {
                const [accRes, partRes, perRes] = await Promise.all([
                    accountsApi.list7(companyId),
                    partnersApi.list1(companyId, undefined, undefined, 0, 100),
                    fiscalPeriodsApi.list6(companyId)
                ]);
                setAccounts(accRes.data.data || []);
                setPartners(partRes.data.data?.content || []);
                setPeriods(perRes.data.data || []);

                // Set default period if available (picking open one)
                const openPeriod = perRes.data.data?.find(p => p.status === 'open');
                if (openPeriod) {
                    form.setValue('periodId', openPeriod.id!);
                }
            } catch (error) {
                console.error("Error fetching form data:", error);
            }
        };

        fetchData();
    }, [form]);

    const lines = form.watch("lines");
    const totalDebit = useMemo(() => lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0), [lines]);
    const totalCredit = useMemo(() => lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0), [lines]);
    const difference = Math.abs(totalDebit - totalCredit);
    const isBalanced = difference === 0 && totalDebit > 0;

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
                companyId: '4df27c87-491d-473e-999c-ce5678436be1',
                lines: values.lines.map(line => ({
                    accountId: line.accountId,
                    partnerId: line.partnerId === "none" ? undefined : line.partnerId,
                    debit: line.debit,
                    credit: line.credit,
                    currencyCode: line.currencyCode,
                    exchangeRate: line.exchangeRate,
                    description: line.description
                })) as JournalLineRequest[]
            };

            await journalEntriesApi.create5(request);
            success("Đã tạo chứng từ ghi sổ thành công.", { title: "Thành công" });
            form.reset();
        } catch (err) {
            console.error("Error creating journal entry:", err);
            error("Không thể tạo chứng từ. Vui lòng kiểm tra lại dữ liệu.", { title: "Lỗi" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">New Journal Entry</h2>
                <p className="text-muted-foreground">
                    Nhập liệu bút toán kế toán tổng hợp.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Manual Card implementation */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <h3 className="font-semibold leading-none tracking-tight">Thông tin chung (Header)</h3>
                        </div>
                        <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            <FormField<JournalFormValues, "entryDate">
                                control={form.control}
                                name="entryDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày chứng từ</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField<JournalFormValues, "reference">
                                control={form.control}
                                name="reference"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tham chiếu</FormLabel>
                                        <FormControl>
                                            <Input placeholder="REF-001" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField<JournalFormValues, "periodId">
                                control={form.control}
                                name="periodId"
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField<JournalFormValues, "source">
                                control={form.control}
                                name="source"
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField<JournalFormValues, "description">
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="lg:col-span-1">
                                        <FormLabel>Mô tả tổng quát</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập mô tả..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card text-card-foreground shadow">
                        <div className="flex flex-row items-center justify-between p-6">
                            <div>
                                <h3 className="font-semibold leading-none tracking-tight">Dòng bút toán (Line Items)</h3>
                                <p className="text-sm text-muted-foreground mt-1.5">Thêm ít nhất 2 dòng và đảm bảo cân đối Nợ = Có.</p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ accountId: "", partnerId: "none", description: "", debit: 0, credit: 0, currencyCode: "VND", exchangeRate: 1 })}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Thêm dòng
                            </Button>
                        </div>
                        <div className="p-6 pt-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px]">Tài khoản</TableHead>
                                        <TableHead className="w-[150px]">Đối tác</TableHead>
                                        <TableHead>Diễn giải dòng</TableHead>
                                        <TableHead className="w-[120px]">Nợ</TableHead>
                                        <TableHead className="w-[120px]">Có</TableHead>
                                        <TableHead className="w-[100px]">Loại tiền</TableHead>
                                        <TableHead className="w-[40px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell>
                                                <FormField<JournalFormValues, any>
                                                    control={form.control}
                                                    name={`lines.${index}.accountId`}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Chọn TK" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {accounts.map((acc) => (
                                                                    <SelectItem key={acc.id} value={acc.id!}>
                                                                        {acc.code} - {acc.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField<JournalFormValues, any>
                                                    control={form.control}
                                                    name={`lines.${index}.partnerId`}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Chọn đối tác" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="none">---</SelectItem>
                                                                {partners.map((p) => (
                                                                    <SelectItem key={p.id} value={p.id!}>
                                                                        {p.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField<JournalFormValues, any>
                                                    control={form.control}
                                                    name={`lines.${index}.description`}
                                                    render={({ field }) => (
                                                        <Input {...field} placeholder="Diễn giải..." />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField<JournalFormValues, any>
                                                    control={form.control}
                                                    name={`lines.${index}.debit`}
                                                    render={({ field }) => (
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            onChange={(e) => {
                                                                const val = Number(e.target.value);
                                                                field.onChange(val);
                                                                if (val > 0) {
                                                                    form.setValue(`lines.${index}.credit`, 0);
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField<JournalFormValues, any>
                                                    control={form.control}
                                                    name={`lines.${index}.credit`}
                                                    render={({ field }) => (
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            onChange={(e) => {
                                                                const val = Number(e.target.value);
                                                                field.onChange(val);
                                                                if (val > 0) {
                                                                    form.setValue(`lines.${index}.debit`, 0);
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField<JournalFormValues, any>
                                                    control={form.control}
                                                    name={`lines.${index}.currencyCode`}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
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
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => remove(index)}
                                                    disabled={fields.length <= 2}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow className="">
                                        <TableCell colSpan={3} className="text-right">Tổng cộng</TableCell>
                                        <TableCell>{totalDebit.toLocaleString()} VND</TableCell>
                                        <TableCell>{totalCredit.toLocaleString()} VND</TableCell>
                                        <TableCell colSpan={2}></TableCell>
                                    </TableRow>
                                    <TableRow className={cn("")}>
                                        <TableCell colSpan={3} className="text-right">Chênh lệch</TableCell>
                                        <TableCell colSpan={2} className="text-left">{difference.toLocaleString()} VND</TableCell>
                                        <TableCell colSpan={2}>
                                            {difference === 0 ? "(Cân đối)" : "(Không cân đối)"}
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => form.reset()}>
                            Làm mới
                        </Button>
                        <Button type="submit" disabled={isSubmitting || !isBalanced} className="min-w-[120px]">
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Lưu chứng từ
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

const Loader2 = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("animate-spin", className)}
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

export default JournalEntryPage;

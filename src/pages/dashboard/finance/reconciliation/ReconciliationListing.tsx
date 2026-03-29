import React, { useCallback, useEffect, useState, useMemo } from "react";
import { DataTable } from "@components/ui/data-table.tsx";
import { getColumns } from "./columns.tsx";
import { Button } from "@components/ui/button.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select.tsx";
import { Separator } from "@components/ui/separator.tsx";
import {
    RefreshCcw,
    Link as LinkIcon,
    AlertCircle,
    CheckCircle2,
    Scale
} from "lucide-react";

import {
    coreBankReconciliationApi,
    coreBankAccountsApi,
    coreBankTransactionsApi
} from "@/api";
import type {
    BankAccountResponse,
    BankAccountsApiList4Request,
    BankTransactionResponse,
    ReconciliationSummaryResponse,
    BankTransactionsApiList3Request,
    BankReconciliationApiGetSummaryRequest,
    BankReconciliationApiUnmatchRequest,
    BankReconciliationApiAutoMatchRequest
} from "@/api/generated/core";
import { useToastApp } from "@hooks/use-toast-app.ts";

const COMPANY_ID = "a5fbb4a1-e8bd-4749-aa6d-c422ded28107";

const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "---";
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
};

const ReconciliationListing: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [bankAccounts, setBankAccounts] = useState<BankAccountResponse[]>([]);
    const [selectedBankId, setSelectedBankId] = useState<string>("");

    // Data
    const [data, setData] = useState<BankTransactionResponse[]>([]);
    const [summary, setSummary] = useState<ReconciliationSummaryResponse | null>(null);

    const { success, error } = useToastApp();

    /* ─── Load bank accounts first ─── */
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const bankAccountsApiList4Request: BankAccountsApiList4Request = {
                    companyId: COMPANY_ID,
                    type: undefined,
                    search: "",
                    page: 0,
                    size: 100,
                };
                const res = await coreBankAccountsApi.list4(bankAccountsApiList4Request);
                const content = res.data.data?.content || [];
                setBankAccounts(content);
                // Set first account if exists
                if (content.length > 0 && !selectedBankId) {
                    setSelectedBankId(content[0].id!);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchAccounts();
    }, []);

    /* ─── Fetch transactions & summary ─── */
    const fetchData = useCallback(async () => {
        if (!selectedBankId) return;
        setIsLoading(true);
        try {
            const bankTransactionsApiList3Request: BankTransactionsApiList3Request = {
                companyId: COMPANY_ID,
                bankAccountId: selectedBankId,
                type: undefined,
                fromDate: undefined,
                toDate: undefined,
                page: 0,
                size: 100,
            };

            const bankReconciliationApiGetSummaryRequest: BankReconciliationApiGetSummaryRequest = {
                bankAccountId: COMPANY_ID,
            };
            const [txRes, summaryRes] = await Promise.all([
                coreBankTransactionsApi.list3(bankTransactionsApiList3Request),
                coreBankReconciliationApi.getSummary(bankReconciliationApiGetSummaryRequest),
            ]);
            setData(txRes.data.data?.content || []);
            setSummary(summaryRes.data.data || null);
        } catch (e) {
            console.error(e);
            error("Không thể tải thông tin đối chiếu.");
        } finally {
            setIsLoading(false);
        }
    }, [selectedBankId, error]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUnmatch = async (tx: BankTransactionResponse) => {
        if (!tx.id) return;
        try {
            const bankReconciliationApiUnmatchRequest: BankReconciliationApiUnmatchRequest = {
                bankTransactionId: tx.id,
            };
            await coreBankReconciliationApi.unmatch(bankReconciliationApiUnmatchRequest);
            success("Gỡ liên kết thành công.");
            fetchData();
        } catch (e) {
            console.error(e);
            error("Thao tác thất bại.");
        }
    };

    const handleAutoMatch = async () => {
        if (!selectedBankId) return;
        try {
            const bankReconciliationApiAutoMatchRequest: BankReconciliationApiAutoMatchRequest = {
                bankAccountId: selectedBankId,
            };
            await coreBankReconciliationApi.autoMatch(bankReconciliationApiAutoMatchRequest);
            success("Đã tìm kiếm và ghép tự động thành công.");
            fetchData();
        } catch (e) {
            console.error(e);
            error("Tự động khớp thất bại.");
        }
    };

    const columns = useMemo(() => getColumns(handleUnmatch), [handleUnmatch]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Đối chiếu ngân hàng</h2>
                    <p className="text-muted-foreground">
                        So sánh và khớp các giao dịch ngân hàng với sổ sách hệ thống.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={selectedBankId} onValueChange={setSelectedBankId}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Chọn tài khoản ngân hàng" />
                        </SelectTrigger>
                        <SelectContent>
                            {bankAccounts.map((acc) => (
                                <SelectItem key={acc.id} value={acc.id!}>
                                    {acc.name} — {acc.accountNumber}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchData}
                        disabled={isLoading || !selectedBankId}
                    >
                        <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* ─── Status Overview ─── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border bg-card flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Giao dịch sao kê</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold">{formatCurrency(summary?.bankBalance || 0)}</span>
                    </div>
                </div>
                <div className="p-4 rounded-xl border bg-card flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Số dư sổ cái (GL)</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold">{formatCurrency(summary?.systemBalance || 0)}</span>
                    </div>
                </div>
                <div className="p-4 rounded-xl border bg-card flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Chênh lệch</span>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-xl font-bold ${summary?.difference === 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(summary?.difference || 0)}
                        </span>
                        {summary?.difference === 0 && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                    </div>
                </div>
            </div>

            {/* ─── Info Bar & Auto Tool ─── */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-muted/30 p-4 rounded-xl gap-4">
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <AlertCircle className="h-4 w-4" />
                        <span>Chưa khớp NH: <strong className="text-foreground">{formatCurrency(summary?.unreconciledBankTransactions || 0)}</strong></span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Scale className="h-4 w-4" />
                        <span>Chưa khớp HT: <strong className="text-foreground">{formatCurrency(summary?.unreconciledSystemEntries || 0)}</strong></span>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleAutoMatch} disabled={isLoading}>
                    <LinkIcon className="h-4 w-4 text-blue-600" />
                    Khớp tự động (Auto-Match)
                </Button>
            </div>

            {/* ─── Table ─── */}
            <div className="rounded-xl border  shadow-sm overflow-hidden">
                <DataTable columns={columns} data={data} isLoading={isLoading} />
            </div>

            {/* ─── Footer Details as requested ─── */}
            <div className="flex flex-col md:flex-row justify-between text-xs text-muted-foreground bg-muted/10 p-4 border rounded-xl gap-2 font-medium">
                <div className="flex items-center gap-3">
                    <span>Số dư sao kê: <strong className="text-foreground">{formatCurrency(summary?.bankBalance)}</strong></span>
                    <Separator orientation="vertical" className="h-3" />
                    <span>Số dư hệ thống: <strong className="text-foreground">{formatCurrency(summary?.systemBalance)}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                    <span>Chênh lệch: <strong className={summary?.difference === 0 ? "text-green-600" : "text-red-600"}>{formatCurrency(summary?.difference)}</strong></span>
                </div>
            </div>
        </div>
    );
};

export default ReconciliationListing;

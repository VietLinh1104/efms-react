import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@components/ui/data-table.tsx";
import { getColumns } from "./columns.tsx";
import { Button } from "@components/ui/button.tsx";
import { Input } from "@components/ui/input.tsx";
import { Badge } from "@components/ui/badge.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select.tsx";
import { RefreshCcw, Filter, X, Plus } from "lucide-react";

import { bankTransactionsApi, bankAccountsApi } from "@/api";
import type { BankTransactionResponse, BankAccountResponse } from "@/api/generated";
import { useToastApp } from "@hooks/use-toast-app.ts";
import { BankTransactionDialog } from "./BankTransactionDialog.tsx";

const COMPANY_ID = "a5fbb4a1-e8bd-4749-aa6d-c422ded28107";

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

const TransactionsListing: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<BankTransactionResponse[]>([]);

    // Dialog
    const [dialogOpen, setDialogOpen] = useState(false);

    // Filters
    const [bankAccounts, setBankAccounts] = useState<BankAccountResponse[]>([]);
    const [filterAccount, setFilterAccount] = useState<string>("all");
    const [filterType, setFilterType] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");

    const { success, error } = useToastApp();

    /* ── tổng kết ── */
    const summary = useMemo(() => {
        const totalIn = data.filter(t => t.type?.toLowerCase() === "in").reduce((s, t) => s + (t.amount || 0), 0);
        const totalOut = data.filter(t => t.type?.toLowerCase() === "out").reduce((s, t) => s + (t.amount || 0), 0);
        const matched = data.filter(t => t.isReconciled).length;
        return { totalIn, totalOut, net: totalIn - totalOut, matched, total: data.length };
    }, [data]);

    /* ── fetch bank accounts for filter dropdown ── */
    useEffect(() => {
        bankAccountsApi.list4(COMPANY_ID, undefined, "", 0, 200)
            .then(r => setBankAccounts(r.data.data?.content || []))
            .catch(console.error);
    }, []);

    /* ── fetch transactions ── */
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await bankTransactionsApi.list3(
                COMPANY_ID,
                filterAccount !== "all" ? filterAccount : undefined,
                filterType !== "all" ? filterType : undefined,
                filterStatus !== "all" ? filterStatus : undefined,
                fromDate || undefined,
                toDate || undefined,
                0,
                200,
            );
            setData(res.data.data?.content || []);
        } catch (e) {
            console.error(e);
            error("Không thể tải danh sách giao dịch.");
        } finally {
            setIsLoading(false);
        }
    }, [filterAccount, filterType, filterStatus, fromDate, toDate, error]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /* ── delete ── */
    const handleDelete = useCallback(async (tx: BankTransactionResponse) => {
        if (!tx.id || tx.isReconciled) return;
        if (!window.confirm("Xóa giao dịch này? Hành động không thể hoàn tác.")) return;
        try {
            await bankTransactionsApi.delete3(tx.id);
            success("Đã xóa giao dịch.");
            fetchData();
        } catch (e) {
            console.error(e);
            error("Không thể xóa giao dịch.");
        }
    }, [fetchData, success, error]);

    const handleClearFilters = () => {
        setFilterAccount("all");
        setFilterType("all");
        setFilterStatus("all");
        setFromDate("");
        setToDate("");
    };

    const hasActiveFilters = filterAccount !== "all" || filterType !== "all" || filterStatus !== "all" || !!fromDate || !!toDate;

    const columns = useMemo(() => getColumns(handleDelete), [handleDelete]);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight">Lịch sử giao dịch</h2>
                <p className="text-muted-foreground">
                    Tra cứu và quản lý lịch sử giao dịch theo tài khoản ngân hàng.
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border bg-background p-3">
                    <p className="text-xs text-muted-foreground">Tổng thu</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(summary.totalIn)}</p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                    <p className="text-xs text-muted-foreground">Tổng chi</p>
                    <p className="text-lg font-bold text-orange-600">{formatCurrency(summary.totalOut)}</p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                    <p className="text-xs text-muted-foreground">Chênh lệch (Net)</p>
                    <p className={`text-lg font-bold ${summary.net >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(summary.net)}
                    </p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                    <p className="text-xs text-muted-foreground">Đã đối chiếu</p>
                    <p className="text-lg font-bold">{summary.matched} / {summary.total}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-lg border bg-background p-4 space-y-3">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Bộ lọc</span>
                    {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-6 px-2 text-xs">
                            <X className="h-3 w-3 mr-1" /> Xóa bộ lọc
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {/* TK Ngân hàng */}
                    <Select value={filterAccount} onValueChange={setFilterAccount}>
                        <SelectTrigger id="filter-account" className="w-full">
                            <SelectValue placeholder="Tất cả TK" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả TK</SelectItem>
                            {bankAccounts.map(b => (
                                <SelectItem key={b.id} value={b.id!}>{b.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Loại */}
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger id="filter-type" className="w-full">
                            <SelectValue placeholder="Loại" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả loại</SelectItem>
                            <SelectItem value="in">Thu vào</SelectItem>
                            <SelectItem value="out">Chi ra</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Trạng thái đối chiếu */}
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger id="filter-status" className="w-full">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="reconciled">Đã đối chiếu</SelectItem>
                            <SelectItem value="unreconciled">Chưa đối chiếu</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Từ ngày */}
                    <div className="relative">
                        <Input
                            id="filter-from"
                            type="date"
                            value={fromDate}
                            onChange={e => setFromDate(e.target.value)}
                            placeholder="Từ ngày"
                        />
                    </div>

                    {/* Đến ngày */}
                    <div className="relative">
                        <Input
                            id="filter-to"
                            type="date"
                            value={toDate}
                            onChange={e => setToDate(e.target.value)}
                            placeholder="Đến ngày"
                        />
                    </div>
                </div>

                {/* Active filter badges */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-1 pt-1">
                        {filterAccount !== "all" && (
                            <Badge variant="secondary" className="text-xs">
                                TK: {bankAccounts.find(b => b.id === filterAccount)?.name || filterAccount}
                            </Badge>
                        )}
                        {filterType !== "all" && (
                            <Badge variant="secondary" className="text-xs">
                                {filterType === "in" ? "Thu vào" : "Chi ra"}
                            </Badge>
                        )}
                        {filterStatus !== "all" && (
                            <Badge variant="secondary" className="text-xs">
                                {filterStatus === "reconciled" ? "Đã đối chiếu" : "Chưa đối chiếu"}
                            </Badge>
                        )}
                        {fromDate && <Badge variant="secondary" className="text-xs">Từ: {fromDate}</Badge>}
                        {toDate && <Badge variant="secondary" className="text-xs">Đến: {toDate}</Badge>}
                    </div>
                )}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {data.length} giao dịch
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchData}
                        disabled={isLoading}
                        title="Làm mới"
                    >
                        <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    </Button>
                    <Button onClick={() => setDialogOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Thêm giao dịch
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-background">
                <DataTable
                    columns={columns}
                    data={data}
                    isLoading={isLoading}
                />
            </div>

            {/* Dialog */}
            <BankTransactionDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                defaultBankAccountId={filterAccount !== "all" ? filterAccount : undefined}
                onSuccess={fetchData}
            />
        </div>
    );
};

export default TransactionsListing;

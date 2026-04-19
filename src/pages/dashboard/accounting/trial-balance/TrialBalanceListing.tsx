import { useState, useEffect, useMemo } from "react";
import { Download, FileText, RefreshCcw } from "lucide-react";

import { Button } from "@components/ui/button.tsx";
import { Input } from "@components/ui/input.tsx";
import { Label } from "@components/ui/label.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select.tsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card.tsx";
import { DataTable } from "@components/ui/data-table.tsx";
import { TableFooter, TableRow, TableCell } from "@components/ui/table.tsx";
import { Badge } from "@components/ui/badge.tsx";
import { ButtonSpin } from "@components/common/ButtonSpin.tsx";
import { formatCurrency } from "@/lib/utils";

import { useAuth } from "@/hooks/useAuth";
import { coreFiscalPeriodsApi, coreTrialBalanceApi } from "@/api";
import type {
    FiscalPeriodResponse,
    TrialBalanceLineResponse,
    FiscalPeriodsApiList5Request,
    TrialBalanceApiGetRequest,
} from "@/api/generated/core";
import { useToastApp } from "@/hooks/use-toast-app";
import { getColumns } from "./columns";

export default function TrialBalanceListing() {
    const { companyId } = useAuth();
    const { error } = useToastApp();

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<TrialBalanceLineResponse[]>([]);
    const [hasFetched, setHasFetched] = useState(false);
    const [isBalanced, setIsBalanced] = useState(true);

    // Filters
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");
    const [periodId, setPeriodId] = useState<string>("custom");

    // Options
    const [periods, setPeriods] = useState<FiscalPeriodResponse[]>([]);

    /* ================= FETCH PERIODS ================= */

    useEffect(() => {
        const fetchPeriods = async () => {
            try {
                const req: FiscalPeriodsApiList5Request = { companyId };
                const res = await coreFiscalPeriodsApi.list5(req);
                setPeriods(res.data.data || []);
            } catch (err) {
                console.error("Error fetching periods", err);
            }
        };
        fetchPeriods();
    }, [companyId]);

    /* ================= HANDLERS ================= */

    const handlePeriodChange = (val: string) => {
        setPeriodId(val);
        if (val !== "custom") {
            const selectedPeriod = periods.find((p) => p.id === val);
            if (selectedPeriod?.startDate) setFromDate(selectedPeriod.startDate);
            if (selectedPeriod?.endDate) setToDate(selectedPeriod.endDate);
        }
    };

    const handleFetchReport = async () => {
        if (!fromDate || !toDate) {
            error("Vui lòng chọn Từ ngày và Đến ngày", { title: "Thiếu thông tin" });
            return;
        }

        setIsLoading(true);
        try {
            const req: TrialBalanceApiGetRequest = {
                companyId,
                periodId: periodId !== "custom" ? periodId : undefined,
                fromDate,
                toDate,
            };

            const res = await coreTrialBalanceApi.get(req);
            const lines = res.data.data?.lines || [];
            setData(lines);
            setHasFetched(true);

            const totalDebit = lines.reduce((sum, line) => sum + (line.closingDebit || 0), 0);
            const totalCredit = lines.reduce((sum, line) => sum + (line.closingCredit || 0), 0);
            setIsBalanced(Math.abs(totalDebit - totalCredit) < 0.01);
        } catch (err) {
            console.error("Error fetching trial balance", err);
            error("Không thể lấy dữ liệu báo cáo", { title: "Lỗi" });
        } finally {
            setIsLoading(false);
        }
    };

    /* ================= CALC ================= */

    const totals = useMemo(() => {
        return data.reduce(
            (acc, line) => ({
                openingDebit: (acc.openingDebit || 0) + (line.openingDebit || 0),
                openingCredit: (acc.openingCredit || 0) + (line.openingCredit || 0),
                periodDebit: (acc.periodDebit || 0) + (line.periodDebit || 0),
                periodCredit: (acc.periodCredit || 0) + (line.periodCredit || 0),
                closingDebit: (acc.closingDebit || 0) + (line.closingDebit || 0),
                closingCredit: (acc.closingCredit || 0) + (line.closingCredit || 0),
            }),
            { openingDebit: 0, openingCredit: 0, periodDebit: 0, periodCredit: 0, closingDebit: 0, closingCredit: 0 }
        );
    }, [data]);

    const columns = useMemo(() => getColumns(), []);

    /* ================= UI ================= */

    return (
        <div className="space-y-6">
            {/* PAGE HEADER */}
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Bảng cân đối tài khoản</h2>
            </div>

            {/* FILTER CARD */}
            <Card>
                <CardHeader>
                    <CardTitle>Bộ lọc</CardTitle>
                    <CardDescription>
                        Chọn kỳ kế toán hoặc khoảng thời gian để xem báo cáo.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        {/* Kỳ kế toán */}
                        <div className="space-y-2 w-full md:w-[200px]">
                            <Label>Kỳ kế toán</Label>
                            <Select value={periodId} onValueChange={handlePeriodChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Tùy chọn" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="custom">Tùy chọn</SelectItem>
                                    {periods.map((p) => (
                                        <SelectItem key={p.id} value={p.id!}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Từ ngày */}
                        <div className="space-y-2 w-full md:w-[200px]">
                            <Label>Từ ngày</Label>
                            <Input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                max={toDate || undefined}
                            />
                        </div>

                        {/* Đến ngày */}
                        <div className="space-y-2 w-full md:w-[200px]">
                            <Label>Đến ngày</Label>
                            <Input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                min={fromDate || undefined}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 w-full md:w-auto md:ml-auto">
                            <ButtonSpin
                                isLoading={isLoading}
                                loadingText="Đang tải..."
                                onClick={handleFetchReport}
                                disabled={isLoading}
                                variant="default"
                            >
                                Xem báo cáo
                            </ButtonSpin>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleFetchReport}
                                disabled={isLoading || !fromDate || !toDate}
                                title="Làm mới"
                            >
                                <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={!hasFetched || isLoading}
                                title="Tải về"
                            >
                                <Download className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={!hasFetched || isLoading}
                                title="Xuất PDF"
                            >
                                <FileText className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* DATA TABLE */}
            {!hasFetched && !isLoading ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                    Chọn kỳ hoặc khoảng thời gian để xem báo cáo
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={data}
                    isLoading={isLoading}
                    footer={
                        hasFetched && data.length > 0 && (
                            <TableFooter className="sticky bottom-0 z-20">
                                <TableRow className="bg-muted font-bold text-foreground hover:bg-muted">
                                    <TableCell className="sticky left-0 bg-muted z-30"></TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-between">
                                            <span>Tổng cộng</span>
                                            {isBalanced ? (
                                                <Badge variant="default">Cân bằng</Badge>
                                            ) : (
                                                <Badge variant="outline">Chênh lệch</Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{formatCurrency(totals.openingDebit || 0)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(totals.openingCredit || 0)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(totals.periodDebit || 0)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(totals.periodCredit || 0)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(totals.closingDebit || 0)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(totals.closingCredit || 0)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        )
                    }
                />
            )}
        </div>
    );
}

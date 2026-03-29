import { useState, useEffect, useMemo } from "react";
import { Download, FileText, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { TableFooter, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

import { useAuth } from "@/hooks/useAuth";
import { coreFiscalPeriodsApi, coreTrialBalanceApi } from "@/api";
import type { FiscalPeriodResponse, TrialBalanceLineResponse, FiscalPeriodsApiList6Request, TrialBalanceApiGetRequest } from "@/api/generated/core";
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

  // Fetch initial data (periods)
  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const fiscalPeriodsApiList6Request: FiscalPeriodsApiList6Request = {
          companyId: companyId,
        };
        const res = await coreFiscalPeriodsApi.list6(fiscalPeriodsApiList6Request);
        setPeriods(res.data.data || []);
      } catch (err) {
        console.error("Error fetching periods", err);
      }
    };
    fetchPeriods();
  }, [companyId]);

  // Handle period change
  const handlePeriodChange = (val: string) => {
    setPeriodId(val);
    if (val !== "custom") {
      const selectedPeriod = periods.find((p) => p.id === val);
      if (selectedPeriod?.startDate) setFromDate(selectedPeriod.startDate);
      if (selectedPeriod?.endDate) setToDate(selectedPeriod.endDate);
    }
  };

  // Fetch report data
  const handleFetchReport = async () => {
    if (!fromDate || !toDate) {
      error("Vui lòng chọn Từ ngày và Đến ngày", { title: "Thiếu thông tin" });
      return;
    }

    setIsLoading(true);
    try {
      const trialBalanceApiGetRequest: TrialBalanceApiGetRequest = {
        companyId: companyId,
        periodId: periodId !== "custom" ? periodId : undefined,
        fromDate: fromDate,
        toDate: toDate,
      };

      const res = await coreTrialBalanceApi.get(trialBalanceApiGetRequest);

      const lines = res.data.data?.lines || [];
      setData(lines);
      setHasFetched(true);

      // Verify balance
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bảng cân đối tài khoản</h2>
        <p className="text-muted-foreground">
          Báo cáo tổng hợp số dư và phát sinh của tất cả tài khoản kế toán.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="rounded-md border bg-card text-card-foreground shadow p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="space-y-2 w-full md:w-[200px]">
            <Label>Kỳ kế toán</Label>
            <Select value={periodId} onValueChange={handlePeriodChange}>
              <SelectTrigger>
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
          <div className="space-y-2 w-full md:w-[200px]">
            <Label>Từ ngày <span className="text-red-500">*</span></Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              max={toDate || undefined}
            />
          </div>
          <div className="space-y-2 w-full md:w-[200px]">
            <Label>Đến ngày <span className="text-red-500">*</span></Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate || undefined}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0 ml-auto">
            <Button onClick={handleFetchReport} disabled={isLoading}>
              Xem báo cáo
            </Button>
            <Button variant="outline" size="icon" disabled={!hasFetched || isLoading}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled={!hasFetched || isLoading}>
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleFetchReport}
              disabled={isLoading || !fromDate || !toDate}
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="">
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
                          <Badge className="bg-green-500 hover:bg-green-600">Cân bằng</Badge>
                        ) : (
                          <Badge variant="destructive">Chênh lệch</Badge>
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
    </div>
  );
}

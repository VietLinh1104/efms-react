import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@components/ui/data-table.tsx";
import { getColumns } from "./columns.tsx";
import { Button } from "@components/ui/button.tsx";
import { RefreshCcw, BookText } from "lucide-react";
import { coreJournalEntriesApi } from "@/api";
import type {
    JournalEntriesApiList3Request,
    JournalEntryResponse,
} from "@/api/generated/core";
import { useToastApp } from "@hooks/use-toast-app.ts";
import { useAuth } from "@/hooks/useAuth";
import { isForbidden } from "@/lib/utils";
import { formatApiErrorForUser } from "@/lib/api-error";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@components/ui/dialog.tsx";
import { Badge } from "@components/ui/badge.tsx";
import { Separator } from "@components/ui/separator.tsx";

// ── Journal Lines Detail Dialog ───────────────────────────────────────────────
interface JournalDetailDialogProps {
    journal: JournalEntryResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formatCurrency = (value: number | undefined) =>
    value
        ? new Intl.NumberFormat("vi-VN").format(value) + " ₫"
        : "—";

const JournalDetailDialog: React.FC<JournalDetailDialogProps> = ({
    journal,
    open,
    onOpenChange,
}) => {
    const [detail, setDetail] = useState<JournalEntryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { error } = useToastApp();

    useEffect(() => {
        if (!open || !journal?.id) return;
        setIsLoading(true);
        coreJournalEntriesApi
            .getDetail1({ id: journal.id })
            .then((res) => setDetail(res.data.data ?? null))
            .catch((err) => {
                if (!isForbidden(err)) error(formatApiErrorForUser(err, "Không thể tải chi tiết bút toán."));
            })
            .finally(() => setIsLoading(false));
    }, [open, journal?.id]);

    const totalDebit = detail?.lines?.reduce((s, l) => s + (Number(l.debit) || 0), 0) ?? 0;
    const totalCredit = detail?.lines?.reduce((s, l) => s + (Number(l.credit) || 0), 0) ?? 0;
    const isBalanced = totalDebit === totalCredit && totalDebit > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <BookText className="w-5 h-5" />
                        Chi tiết Bút toán
                        {detail?.reference && (
                            <span className="font-mono text-sm text-muted-foreground">
                                #{detail.reference}
                            </span>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {detail?.description || "Bút toán được sinh tự động bởi hệ thống"}
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="py-8 text-center text-muted-foreground text-sm">
                        Đang tải...
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Metadata row */}
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span>Ngày: <strong className="text-foreground">
                                {detail?.entryDate
                                    ? new Intl.DateTimeFormat("vi-VN").format(new Date(detail.entryDate as unknown as string))
                                    : "—"}
                            </strong></span>
                            <span>Nguồn: <strong className="text-foreground capitalize">{detail?.source ?? "—"}</strong></span>
                            <span>
                                Trạng thái:{" "}
                                {detail?.status === "posted" && <Badge>Đã ghi sổ</Badge>}
                                {detail?.status === "draft" && <Badge variant="secondary">Nháp</Badge>}
                                {detail?.status === "cancelled" && <Badge variant="destructive">Đã huỷ</Badge>}
                            </span>
                            {isBalanced && (
                                <Badge variant="outline" className="text-green-500 border-green-500/40 ml-auto">
                                    ✓ Cân đối
                                </Badge>
                            )}
                        </div>

                        <Separator />

                        {/* Journal Lines Table */}
                        <div className="rounded-md border overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left px-3 py-2 font-medium">Tài khoản</th>
                                        <th className="text-left px-3 py-2 font-medium">Mô tả dòng</th>
                                        <th className="text-right px-3 py-2 font-medium">Ghi Nợ (Debit)</th>
                                        <th className="text-right px-3 py-2 font-medium">Ghi Có (Credit)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detail?.lines && detail.lines.length > 0 ? (
                                        detail.lines.map((line, idx) => (
                                            <tr key={idx} className="border-t">
                                                <td className="px-3 py-2 font-mono">
                                                    <span className="font-semibold">{line.accountCode}</span>
                                                    <span className="text-muted-foreground ml-2 text-xs">{line.accountName}</span>
                                                </td>
                                                <td className="px-3 py-2 text-muted-foreground">{line.description || "—"}</td>
                                                <td className="px-3 py-2 text-right tabular-nums">
                                                    {Number(line.debit) > 0 ? (
                                                        <span className="text-blue-500 font-medium">
                                                            {formatCurrency(Number(line.debit))}
                                                        </span>
                                                    ) : "—"}
                                                </td>
                                                <td className="px-3 py-2 text-right tabular-nums">
                                                    {Number(line.credit) > 0 ? (
                                                        <span className="text-green-600 font-medium">
                                                            {formatCurrency(Number(line.credit))}
                                                        </span>
                                                    ) : "—"}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">
                                                Chưa có dòng bút toán nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot className="bg-muted/50 font-semibold">
                                    <tr className="border-t">
                                        <td colSpan={2} className="px-3 py-2 text-right">Tổng cộng</td>
                                        <td className="px-3 py-2 text-right tabular-nums text-blue-500">
                                            {formatCurrency(totalDebit)}
                                        </td>
                                        <td className="px-3 py-2 text-right tabular-nums text-green-600">
                                            {formatCurrency(totalCredit)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

// ── Main Listing Page ─────────────────────────────────────────────────────────
const JournalListing: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<JournalEntryResponse[]>([]);
    const [selectedJournal, setSelectedJournal] = useState<JournalEntryResponse | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { error } = useToastApp();
    const { companyId } = useAuth();

    const fetchJournals = useCallback(async () => {
        if (!companyId) return;
        setIsLoading(true);
        try {
            const request: JournalEntriesApiList3Request = {
                companyId,
                page: 0,
                size: 100,
            };
            const response = await coreJournalEntriesApi.list3(request);
            setData(response.data.data?.content ?? []);
        } catch (err) {
            if (isForbidden(err)) return;
            error(formatApiErrorForUser(err, "Không thể tải danh sách bút toán."));
        } finally {
            setIsLoading(false);
        }
    }, [companyId]);

    const handleView = (journal: JournalEntryResponse) => {
        setSelectedJournal(journal);
        setDialogOpen(true);
    };

    const columns = useMemo(() => getColumns(handleView), []);

    useEffect(() => {
        fetchJournals();
    }, [fetchJournals]);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Bút toán nhật ký</h2>
                <p className="text-muted-foreground text-sm mt-1">
                    Danh sách bút toán kép được hệ thống tự động sinh khi Hóa đơn được duyệt hoặc Thanh toán được ghi sổ.
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex justify-end">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={fetchJournals}
                    disabled={isLoading}
                    title="Làm mới"
                >
                    <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
            </div>

            {/* Table */}
            <DataTable columns={columns} data={data} isLoading={isLoading} />

            {/* Detail Dialog */}
            <JournalDetailDialog
                journal={selectedJournal}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </div>
    );
};

export default JournalListing;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@components/ui/dialog.tsx";
import { Badge } from "@components/ui/badge.tsx";
import { Separator } from "@components/ui/separator.tsx";
import { ScrollArea } from "@components/ui/scroll-area.tsx";
import { Button } from "@components/ui/button.tsx";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table.tsx";
import {
    Clock,
    FileText,
    ArrowRight,
    CheckCircle2,
    XCircle,
    AlertCircle,
    PlusCircle,
    Trash2,
    Edit3,
    RefreshCw,
} from "lucide-react";

import type {
    InvoiceResponse,
    AuditLogResponse,
    AuditLogsApiGetRecordHistoryRequest,
} from "@/api/generated/core";
import { coreAuditLogsApi } from "@/api";

/* ─── Helpers ──────────────────────────────────────────────────────────── */

const fmtDate = (v?: string | null) =>
    v ? new Intl.DateTimeFormat("vi-VN").format(new Date(v)) : "---";

const fmtDatetime = (v?: string | null) => {
    if (!v) return "---";
    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(v));
};

const fmtCurrency = (amount?: number | null, currency = "VND") =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency }).format(
        amount ?? 0
    );

/* ─── Status helpers ────────────────────────────────────────────────────── */

const invoiceStatusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    draft: { label: "Nháp", variant: "secondary" },
    open: { label: "Mở", variant: "default" },
    in_payment: { label: "Đang thanh toán", variant: "default" },
    paid: { label: "Đã thanh toán", variant: "default" },
    cancelled: { label: "Đã hủy", variant: "destructive" },
};

const approvalStatusMap: Record<string, { label: string }> = {
    pending: { label: "Chờ duyệt" },
    approved: { label: "Đã duyệt" },
    rejected: { label: "Từ chối" },
};

/* ─── Audit action config ───────────────────────────────────────────────── */

type AuditActionConfig = {
    label: string;
    icon: React.ReactNode;
    colorClass: string;
    dotClass: string;
};

const auditActionConfig: Record<string, AuditActionConfig> = {
    INSERT: {
        label: "Tạo mới",
        icon: <PlusCircle className="h-3.5 w-3.5" />,
        colorClass: "text-blue-600",
        dotClass: "bg-blue-500",
    },
    UPDATE: {
        label: "Cập nhật",
        icon: <Edit3 className="h-3.5 w-3.5" />,
        colorClass: "text-amber-600",
        dotClass: "bg-amber-500",
    },
    DELETE: {
        label: "Xóa",
        icon: <Trash2 className="h-3.5 w-3.5" />,
        colorClass: "text-red-600",
        dotClass: "bg-red-500",
    },
    CONFIRM: {
        label: "Xác nhận",
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        colorClass: "text-blue-600",
        dotClass: "bg-blue-500",
    },
    APPROVE: {
        label: "Phê duyệt",
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        colorClass: "text-green-600",
        dotClass: "bg-green-500",
    },
    REJECT: {
        label: "Từ chối",
        icon: <XCircle className="h-3.5 w-3.5" />,
        colorClass: "text-red-600",
        dotClass: "bg-red-500",
    },
    CANCEL: {
        label: "Hủy",
        icon: <XCircle className="h-3.5 w-3.5" />,
        colorClass: "text-red-600",
        dotClass: "bg-red-500",
    },
    PAYMENT_ALLOCATE: {
        label: "Phân bổ thanh toán",
        icon: <RefreshCw className="h-3.5 w-3.5" />,
        colorClass: "text-purple-600",
        dotClass: "bg-purple-500",
    },
};

const getAuditAction = (action?: string): AuditActionConfig =>
    auditActionConfig[action ?? ""] ?? {
        label: action ?? "---",
        icon: <AlertCircle className="h-3.5 w-3.5" />,
        colorClass: "text-slate-600",
        dotClass: "bg-slate-400",
    };

/* ─── Sub-components ────────────────────────────────────────────────────── */

const InfoRow: React.FC<{ label: string; value?: React.ReactNode }> = ({
    label,
    value,
}) => (
    <div className="flex items-start justify-between gap-2 py-1.5">
        <span className="text-sm text-muted-foreground shrink-0 min-w-[130px]">
            {label}
        </span>
        <span className="text-sm font-medium text-right">{value ?? "---"}</span>
    </div>
);

/* Hiển thị diff old_data → new_data của một audit entry */
const AuditDiff: React.FC<{ log: AuditLogResponse }> = ({ log }) => {
    const old = log.oldData as Record<string, unknown> | undefined;
    const next = log.newData as Record<string, unknown> | undefined;
    const allKeys = Array.from(
        new Set([...Object.keys(old ?? {}), ...Object.keys(next ?? {})])
    ).filter((k) => old?.[k] !== next?.[k]); // Chỉ hiện keys có thay đổi

    if (allKeys.length === 0) return null;

    return (
        <div className="mt-2 rounded-md border bg-muted/30 p-2 text-xs space-y-1">
            {allKeys.map((key) => (
                <div key={key} className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-muted-foreground">{key}:</span>
                    {old?.[key] !== undefined && (
                        <span className="line-through text-red-500 font-mono">
                            {String(old[key])}
                        </span>
                    )}
                    {old?.[key] !== undefined && next?.[key] !== undefined && (
                        <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                    )}
                    {next?.[key] !== undefined && (
                        <span className="text-green-600 font-mono">
                            {String(next[key])}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

/* ─── Props ─────────────────────────────────────────────────────────────── */

interface InvoiceDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    invoice: InvoiceResponse | null;
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export const InvoiceDetailDialog: React.FC<InvoiceDetailDialogProps> = ({
    open,
    onOpenChange,
    invoice,
}) => {
    const navigate = useNavigate();
    const [auditLogs, setAuditLogs] = useState<AuditLogResponse[]>([]);
    const [isAuditLoading, setIsAuditLoading] = useState(false);

    /* Fetch audit history mỗi khi dialog mở với invoice mới */
    useEffect(() => {
        if (!open || !invoice?.id) {
            setAuditLogs([]);
            return;
        }

        const fetchAudit = async () => {
            setIsAuditLoading(true);
            try {
                const req: AuditLogsApiGetRecordHistoryRequest = {
                    tableName: "invoices",
                    recordId: invoice.id!,
                };
                const res = await coreAuditLogsApi.getRecordHistory(req);
                setAuditLogs(res.data.data ?? []);
            } catch (err) {
                console.error("Không thể tải lịch sử audit:", err);
                setAuditLogs([]);
            } finally {
                setIsAuditLoading(false);
            }
        };

        fetchAudit();
    }, [open, invoice?.id]);

    if (!invoice) return null;

    const invoiceStatus = invoiceStatusMap[invoice.status ?? ""] ?? {
        label: invoice.status ?? "---",
        variant: "outline" as const,
    };
    const approvalStatus = invoice.approvalStatus
        ? approvalStatusMap[invoice.approvalStatus]
        : null;

    const remaining = (invoice.totalAmount ?? 0) - (invoice.paidAmount ?? 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[720px] max-h-[90vh] flex flex-col gap-0 p-0" showCloseButton={false}>
                {/* ── Header ── */}
                <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary shrink-0" />
                                {invoice.invoiceNumber || "Hóa đơn nháp"}
                            </DialogTitle>
                            <DialogDescription>
                                {invoice.invoiceType === "AR"
                                    ? "Hóa đơn Bán hàng (AR)"
                                    : "Hóa đơn Mua hàng (AP)"}
                                {" · "}
                                {invoice.partnerName}
                            </DialogDescription>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <Badge variant={invoiceStatus.variant}>
                                {invoiceStatus.label}
                            </Badge>
                            {approvalStatus && (
                                <Badge variant={"secondary"}>
                                    {approvalStatus.label}
                                </Badge>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                <Separator />

                {/* ── Body tabs ── */}
                <Tabs defaultValue="info" className="flex-1 flex flex-col min-h-0">
                    <TabsList className="mx-6 mt-3 w-fit">
                        <TabsTrigger value="info">Thông tin chính</TabsTrigger>
                        <TabsTrigger value="lines">Dòng chi tiết</TabsTrigger>
                        <TabsTrigger value="history" className="relative">
                            Lịch sử thay đổi
                            {auditLogs.length > 0 && (
                                <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                    {auditLogs.length}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    {/* ── Tab: Thông tin chính ── */}
                    <TabsContent value="info" className="flex-1 overflow-auto px-6 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0 divide-y sm:divide-y-0">
                            {/* Cột trái */}
                            <div>
                                <InfoRow label="Loại hóa đơn" value={invoice.invoiceType === "AR" ? "Bán hàng (AR)" : "Mua hàng (AP)"} />
                                <InfoRow label="Số hóa đơn" value={invoice.invoiceNumber || "---"} />
                                <InfoRow label="Đối tác" value={invoice.partnerName} />
                                <InfoRow label="Ngày phát hành" value={fmtDate(invoice.invoiceDate)} />
                                <InfoRow label="Ngày đến hạn" value={fmtDate(invoice.dueDate)} />
                                <InfoRow label="Tiền tệ" value={invoice.currencyCode} />
                                {invoice.exchangeRate && invoice.exchangeRate !== 1 && (
                                    <InfoRow label="Tỷ giá" value={invoice.exchangeRate?.toLocaleString()} />
                                )}
                            </div>

                            {/* Cột phải */}
                            <div>
                                <InfoRow
                                    label="Tiền trước thuế"
                                    value={fmtCurrency(invoice.subtotal, invoice.currencyCode)}
                                />
                                <InfoRow
                                    label="Tiền thuế"
                                    value={fmtCurrency(invoice.taxAmount, invoice.currencyCode)}
                                />
                                <InfoRow
                                    label="Tổng cộng"
                                    value={
                                        <span className="font-bold text-primary">
                                            {fmtCurrency(invoice.totalAmount, invoice.currencyCode)}
                                        </span>
                                    }
                                />
                                <InfoRow
                                    label="Đã thanh toán"
                                    value={
                                        <span className="text-green-600">
                                            {fmtCurrency(invoice.paidAmount, invoice.currencyCode)}
                                        </span>
                                    }
                                />
                                <InfoRow
                                    label="Còn lại"
                                    value={
                                        <span className={remaining > 0 ? "text-amber-600 font-semibold" : "text-green-600"}>
                                            {fmtCurrency(remaining, invoice.currencyCode)}
                                        </span>
                                    }
                                />
                                {invoice.approvalComment && (
                                    <InfoRow label="Ghi chú duyệt" value={invoice.approvalComment} />
                                )}
                                <InfoRow label="Ngày tạo" value={fmtDatetime(invoice.createdAt)} />
                            </div>
                        </div>
                    </TabsContent>

                    {/* ── Tab: Dòng chi tiết ── */}
                    <TabsContent value="lines" className="flex-1 overflow-auto px-6 py-4">
                        {!invoice.lines || invoice.lines.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                                <FileText className="h-8 w-8 opacity-30" />
                                <p className="text-sm">Không có dữ liệu dòng chi tiết</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tài khoản</TableHead>
                                        <TableHead>Mô tả</TableHead>
                                        <TableHead className="text-right">SL</TableHead>
                                        <TableHead className="text-right">Đơn giá</TableHead>
                                        <TableHead className="text-right">Thuế %</TableHead>
                                        <TableHead className="text-right">Thành tiền</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoice.lines.map((line) => (
                                        <TableRow key={line.id}>
                                            <TableCell className="font-mono text-xs">
                                                {line.accountCode}
                                                <br />
                                                <span className="text-muted-foreground">{line.accountName}</span>
                                            </TableCell>
                                            <TableCell className="max-w-[160px] truncate">{line.description}</TableCell>
                                            <TableCell className="text-right">{line.quantity?.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">{fmtCurrency(line.unitPrice, invoice.currencyCode)}</TableCell>
                                            <TableCell className="text-right">{line.taxRate}%</TableCell>
                                            <TableCell className="text-right font-medium">
                                                {fmtCurrency((line.amount ?? 0) + (line.taxAmount ?? 0), invoice.currencyCode)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-right">Tổng cộng</TableCell>
                                        <TableCell className="text-right font-bold">
                                            {fmtCurrency(invoice.totalAmount, invoice.currencyCode)}
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        )}
                    </TabsContent>

                    {/* ── Tab: Lịch sử thay đổi (Audit) ── */}
                    <TabsContent value="history" className="flex-1 min-h-0 px-6 py-4">
                        {isAuditLoading ? (
                            <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Đang tải lịch sử...</span>
                            </div>
                        ) : auditLogs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                                <Clock className="h-8 w-8 opacity-30" />
                                <p className="text-sm">Chưa có lịch sử thay đổi</p>
                            </div>
                        ) : (
                            <ScrollArea className="h-[380px] pr-2">
                                <ol className="relative border-l border-border ml-3 space-y-6">
                                    {[...auditLogs].reverse().map((log, idx) => {
                                        const cfg = getAuditAction(log.action);
                                        return (
                                            <li key={log.id ?? idx} className="ml-5">
                                                {/* Dot trên timeline */}
                                                <span
                                                    className={`absolute -left-[7px] flex h-3.5 w-3.5 items-center justify-center rounded-full ${cfg.dotClass} ring-2 ring-background`}
                                                />

                                                {/* Header */}
                                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                                    <div className={`flex items-center gap-1.5 font-semibold text-sm ${cfg.colorClass}`}>
                                                        {cfg.icon}
                                                        <span>{cfg.label}</span>
                                                    </div>
                                                    <time className="text-xs text-muted-foreground shrink-0">
                                                        {fmtDatetime(log.changedAt)}
                                                    </time>
                                                </div>

                                                {/* Changed by */}
                                                {log.changedBy && (
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        bởi{" "}
                                                        <span className="font-mono">
                                                            {String(log.changedBy).slice(0, 8)}…
                                                        </span>
                                                    </p>
                                                )}

                                                {/* Diff */}
                                                <AuditDiff log={log} />
                                            </li>
                                        );
                                    })}
                                </ol>
                            </ScrollArea>
                        )}
                    </TabsContent>
                </Tabs>

                <Separator />
                <DialogFooter className="px-6 py-4 shrink-0 flex items-center justify-end gap-2 bg-muted/10">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Đóng
                    </Button>
                    <Button
                        onClick={() => {
                            if (invoice?.id) {
                                navigate(`/invoices/${invoice.id}`);
                                onOpenChange(false);
                            }
                        }}
                    >
                        Xem chi tiết
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

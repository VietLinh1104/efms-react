import type { PaymentResponse } from "@/api/generated/core";
import { Badge } from "@components/ui/badge.tsx";
import { Button } from "@components/ui/button.tsx";
import { Separator } from "@components/ui/separator.tsx";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@components/ui/dialog.tsx";
import {
    CalendarDays,
    CreditCard,
    ExternalLink,
    Hash,
    ReceiptText,
    User,
    Wallet,
    Link2,
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────

const formatDate = (dateStr?: string) => {
    if (!dateStr) return "---";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(dateStr));
};

const formatCurrency = (amount?: number, currencyCode = "VND") => {
    if (amount === undefined || amount === null) return "---";
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: currencyCode || "VND",
    }).format(amount);
};

const methodLabel: Record<string, string> = {
    cash: "Tiền mặt",
    bank_transfer: "Chuyển khoản",
    check: "Séc",
};

// ─── sub-component: info row ─────────────────────────────────────────────────

interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
    return (
        <div className="flex items-start gap-3 py-2">
            <span className="mt-0.5 text-muted-foreground shrink-0">{icon}</span>
            <div className="flex-1 flex justify-between gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">{label}</span>
                <span className="text-sm font-medium text-right">{value}</span>
            </div>
        </div>
    );
}

// ─── main component ──────────────────────────────────────────────────────────

interface PaymentQuickViewDialogProps {
    payment: PaymentResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onViewDetail: (payment: PaymentResponse) => void;
    onEdit: (payment: PaymentResponse) => void;
}

export function PaymentQuickViewDialog({
    payment,
    open,
    onOpenChange,
    onEdit,
}: PaymentQuickViewDialogProps) {
    if (!payment) return null;

    const isReceipt = payment.paymentType?.toLowerCase() === "in";
    const isPosted = !!payment.journalEntryId;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ReceiptText className="h-5 w-5 text-muted-foreground" />
                        Xem nhanh – Phiếu thanh toán
                    </DialogTitle>
                </DialogHeader>

                {/* Badges: loại + trạng thái */}
                <div className="flex items-center gap-2 -mt-1">
                    <Badge
                        className={`font-medium ${isReceipt
                            ? "bg-green-100 text-green-800 hover:bg-green-200 border-none"
                            : "bg-orange-100 text-orange-800 hover:bg-orange-200 border-none"
                            }`}
                    >
                        {isReceipt ? "Thu (In)" : "Chi (Out)"}
                    </Badge>
                    <Badge
                        className={`border-none ${isPosted
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : "bg-gray-100 text-gray-700"
                            }`}
                    >
                        {isPosted ? "Đã ghi sổ" : "Nháp"}
                    </Badge>
                </div>

                <Separator />

                {/* Thông tin chính */}
                <div className="divide-y">
                    <InfoRow
                        icon={<CalendarDays className="h-4 w-4" />}
                        label="Ngày thanh toán"
                        value={formatDate(payment.paymentDate)}
                    />
                    <InfoRow
                        icon={<User className="h-4 w-4" />}
                        label="Đối tác"
                        value={payment.partnerName || "---"}
                    />
                    <InfoRow
                        icon={<Wallet className="h-4 w-4" />}
                        label="Số tiền"
                        value={
                            <span className={`font-semibold ${isReceipt ? "text-green-700" : "text-orange-700"}`}>
                                {formatCurrency(payment.amount, payment.currencyCode)}
                            </span>
                        }
                    />
                    <InfoRow
                        icon={<CreditCard className="h-4 w-4" />}
                        label="Phương thức"
                        value={methodLabel[payment.paymentMethod?.toLowerCase() || ""] ?? payment.paymentMethod ?? "---"}
                    />
                    <InfoRow
                        icon={<Hash className="h-4 w-4" />}
                        label="Tham chiếu"
                        value={payment.reference || "---"}
                    />
                    {payment.allocations && payment.allocations.length > 0 && (
                        <InfoRow
                            icon={<Link2 className="h-4 w-4" />}
                            label="Hóa đơn liên kết"
                            value={`${payment.allocations.length} hóa đơn`}
                        />
                    )}
                    {payment.journalEntryId && (
                        <InfoRow
                            icon={<ReceiptText className="h-4 w-4" />}
                            label="Chứng từ KT"
                            value={
                                <span className="font-mono text-xs text-muted-foreground truncate max-w-[180px] block">
                                    {payment.journalEntryId}
                                </span>
                            }
                        />
                    )}
                </div>

                <Separator />

                <DialogFooter className="flex flex-row justify-between gap-2">

                    <Button
                        size="sm"
                        onClick={() => {
                            onOpenChange(false);
                            onEdit(payment);
                        }}
                    >
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        Xem chi tiết
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

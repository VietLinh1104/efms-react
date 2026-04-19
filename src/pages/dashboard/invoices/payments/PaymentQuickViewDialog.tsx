import type { PaymentResponse } from "@/api/generated/core";
import { Badge } from "@components/ui/badge.tsx";
import { Button } from "@components/ui/button.tsx";
import { Input } from "@components/ui/input.tsx";
import { Label } from "@components/ui/label.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@components/ui/dialog.tsx";
import { ExternalLink, ReceiptText } from "lucide-react";

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

const METHOD_LABEL: Record<string, string> = {
    cash: "Tiền mặt (Cash)",
    bank_transfer: "Chuyển khoản (Bank Transfer)",
    check: "Séc (Check)",
};

const TYPE_LABEL: Record<string, string> = {
    in: "Thu (Receive)",
    out: "Chi (Pay)",
};

// ─── props ───────────────────────────────────────────────────────────────────

interface PaymentQuickViewDialogProps {
    payment: PaymentResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onViewDetail: (payment: PaymentResponse) => void;
    onEdit: (payment: PaymentResponse) => void;
}

// ─── component ───────────────────────────────────────────────────────────────

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
            <DialogContent className="sm:max-w-[560px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <ReceiptText className="h-5 w-5 text-muted-foreground" />
                        Chi tiết phiếu thanh toán
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-2 pt-1">
                        <Badge
                            className={`font-medium border-none ${isReceipt
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                                }`}
                        >
                            {isReceipt ? "Thu (In)" : "Chi (Out)"}
                        </Badge>
                        <Badge
                            className={`border-none ${isPosted
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                : "bg-amber-100 text-amber-800"
                                }`}
                        >
                            {isPosted ? "Đã ghi sổ" : "Nháp"}
                        </Badge>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-2">

                    {/* Row 1: Loại + Ngày */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Loại thanh toán</Label>
                            <Input
                                readOnly
                                value={TYPE_LABEL[payment.paymentType?.toLowerCase() || ""] ?? payment.paymentType ?? "---"}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Ngày thanh toán</Label>
                            <Input readOnly value={formatDate(payment.paymentDate)} />
                        </div>
                    </div>

                    {/* Row 2: Đối tác */}
                    <div className="space-y-2">
                        <Label>Đối tác</Label>
                        <Input readOnly value={payment.partnerName || "---"} />
                    </div>

                    {/* Row 3: Số tiền + Tiền tệ */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Số tiền</Label>
                            <Input
                                readOnly
                                value={formatCurrency(payment.amount, payment.currencyCode)}

                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Tiền tệ</Label>
                            <Input readOnly value={payment.currencyCode || "VND"} />
                        </div>
                    </div>

                    {/* Row 4: Phương thức + Tham chiếu */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Phương thức</Label>
                            <Input
                                readOnly
                                value={
                                    METHOD_LABEL[payment.paymentMethod?.toLowerCase() || ""] ??
                                    payment.paymentMethod ??
                                    "---"
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Tham chiếu</Label>
                            <Input readOnly value={payment.reference || "---"} />
                        </div>
                    </div>

                    {/* Row 5: Hóa đơn liên kết (nếu có) */}
                    {payment.allocations && payment.allocations.length > 0 && (
                        <div className="space-y-2">
                            <Label>Hóa đơn liên kết</Label>
                            <Input readOnly value={`${payment.allocations.length} hóa đơn`} />
                        </div>
                    )}

                    {/* Row 6: Chứng từ kế toán (nếu có) */}
                    {payment.journalEntryId && (
                        <div className="space-y-2">
                            <Label>Chứng từ kế toán</Label>
                            <Input
                                readOnly
                                value={payment.journalEntryId}
                                className="font-mono text-xs"
                            />
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        Đóng
                    </Button>
                    <Button
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

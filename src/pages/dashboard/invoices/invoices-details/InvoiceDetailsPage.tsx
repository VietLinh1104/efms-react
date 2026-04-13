import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { coreInvoicesApi } from "@/api";
import type { InvoiceResponse } from "@/api/generated/core";
import { Badge } from "@components/ui/badge.tsx";
import { Button } from "@components/ui/button.tsx";
import { useToastApp } from "@hooks/use-toast-app.ts";
import { ArrowLeft, CheckCircle, XCircle, Play } from "lucide-react";
// We extend the generated InvoiceResponse because approvalStatus might be dynamically added 
// but is missing from the swagger generated types currently.
interface ExtendedInvoiceResponse extends InvoiceResponse {
    approvalStatus?: string;
}

const InvoiceDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { success, error } = useToastApp();
    
    const [invoice, setInvoice] = useState<ExtendedInvoiceResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isFinanceOrAdmin = true; // Temporary allow everyone if roles is unclear, or check user roles if you know the exact field

    const fetchDetail = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const res = await coreInvoicesApi.getDetail1({ id });
            // Expected response data from getDetail1 is usually res.data.data
            // However, based on the axios structure, check res.data
            const invoiceData = (res.data as any).data || res.data;
            setInvoice(invoiceData as ExtendedInvoiceResponse);
        } catch (err) {
            console.error("Fetch invoice detail failed:", err);
            error("Không thể tải chi tiết hóa đơn.");
        } finally {
            setIsLoading(false);
        }
    }, [id, error]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    // Handle Confirm action
    const handleConfirm = async () => {
        if (!id) return;
        try {
            await coreInvoicesApi.confirm({ id });
            success("Xác nhận hóa đơn thành công!");
            fetchDetail();
        } catch (err) {
            console.error("Confirm fail", err);
            error("Xác nhận thất bại.");
        }
    };

    // Handle Approve action
    const handleApprove = async () => {
        if (!id) return;
        try {
            await coreInvoicesApi.approve({ id });
            success("Đã duyệt hóa đơn AP!");
            fetchDetail();
        } catch (err) {
            console.error("Approve fail", err);
            error("Duyệt hóa đơn thất bại.");
        }
    };

    // Handle Reject action
    const handleReject = async () => {
        if (!id) return;
        try {
            await coreInvoicesApi.reject({ id });
            success("Đã từ chối hóa đơn!");
            fetchDetail();
        } catch (err) {
            console.error("Reject fail", err);
            error("Từ chối thất bại.");
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;
    }

    if (!invoice) {
        return <div className="p-8 text-center text-red-500">Không tìm thấy hóa đơn.</div>;
    }

    const { status, approvalStatus, invoiceType } = invoice;
    const isAP = invoiceType === "AP";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/invoices")}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h2 className="text-2xl font-bold">
                        Hóa đơn: {invoice.invoiceNumber || "DRAFT"} 
                        <span className="text-muted-foreground text-lg ml-2 font-normal">({isAP ? "AP Bill" : "AR Invoice"})</span>
                    </h2>
                </div>

                <div className="flex gap-2">
                    {/* Action buttons based on status and camunda flow */}
                    {(status === 'draft' || status === 'DRAFT') && (
                        <Button onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700">
                            <Play className="w-4 h-4 mr-2" />
                            Xác nhận (Confirm)
                        </Button>
                    )}

                    {isAP && (approvalStatus === 'pending' || approvalStatus === 'PENDING') && isFinanceOrAdmin && (
                        <>
                            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700 text-white">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Duyệt (Approve)
                            </Button>
                            <Button onClick={handleReject} variant="destructive">
                                <XCircle className="w-4 h-4 mr-2" />
                                Từ chối (Reject)
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-xl p-6 bg-card">
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">Thông tin chung</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Đối tác:</span>
                            <span className="font-medium">{invoice.partnerName || "---"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Ngày lập hóa đơn:</span>
                            <span>{invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString("vi-VN") : "---"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Hạn thanh toán:</span>
                            <span>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("vi-VN") : "---"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tiền tệ:</span>
                            <span>{invoice.currencyCode || "VND"} (Tỷ giá: {invoice.exchangeRate || 1})</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Trạng thái HĐ:</span>
                            <Badge className="uppercase">{status || "---"}</Badge>
                        </div>
                        {isAP && (
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Phê duyệt:</span>
                                <Badge variant={
                                    approvalStatus?.toLowerCase() === 'approved' ? 'default' :
                                    approvalStatus?.toLowerCase() === 'rejected' ? 'destructive' : 'secondary'
                                } className="uppercase">
                                    {approvalStatus || "---"}
                                </Badge>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border rounded-xl p-6 bg-card">
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">Tài chính</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tổng trước thuế:</span>
                            <span>{invoice.subtotal?.toLocaleString()} {invoice.currencyCode}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tiền thuế:</span>
                            <span>{invoice.taxAmount?.toLocaleString()} {invoice.currencyCode}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base mt-2 border-t pt-2">
                            <span>Tổng Hóa đơn:</span>
                            <span>{invoice.totalAmount?.toLocaleString()} {invoice.currencyCode}</span>
                        </div>
                        <div className="flex justify-between font-medium text-blue-600 dark:text-blue-400 mt-2">
                            <span>Đã thanh toán:</span>
                            <span>{invoice.paidAmount?.toLocaleString() || 0} {invoice.currencyCode}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border rounded-xl p-6 bg-card">
                <h3 className="text-lg font-semibold mb-4">Chi tiết dòng hóa đơn</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground border-b">
                            <tr>
                                <th className="p-3">Mô tả</th>
                                <th className="p-3">Tài khoản</th>
                                <th className="p-3 text-right">S.Lượng</th>
                                <th className="p-3 text-right">Đơn giá</th>
                                <th className="p-3 text-right">% Thuế</th>
                                <th className="p-3 text-right">Tiền Thuế</th>
                                <th className="p-3 text-right">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(invoice.lines || []).map((line, idx) => (
                                <tr key={idx} className="border-b last:border-0 hover:bg-muted/50">
                                    <td className="p-3">{line.description}</td>
                                    <td className="p-3">{line.accountId}</td>
                                    <td className="p-3 text-right">{line.quantity}</td>
                                    <td className="p-3 text-right">{line.unitPrice?.toLocaleString()}</td>
                                    <td className="p-3 text-right">{line.taxRate}%</td>
                                    <td className="p-3 text-right">{line.taxAmount?.toLocaleString()}</td>
                                    <td className="p-3 text-right font-medium">{line.amount?.toLocaleString()}</td>
                                </tr>
                            ))}
                            {(!invoice.lines || invoice.lines.length === 0) && (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center text-muted-foreground">
                                        Không có dữ liệu dòng hóa đơn.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetailsPage;

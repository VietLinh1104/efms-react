import React, { useEffect, useState, useMemo, useCallback } from "react";
import { DataTable } from "@components/ui/data-table.tsx";
import { getColumns } from "./columns.tsx";
import { Button } from "@components/ui/button.tsx";
import { Plus, RefreshCcw, Search } from "lucide-react";
import { corePaymentsApi } from "@/api";
import type { PaymentResponse, PaymentsApiDeleteRequest, PaymentsApiListRequest } from "@/api/generated/core";
import { useToastApp } from "@hooks/use-toast-app.ts";
import { useNavigate } from "react-router-dom";
import { Input } from "@components/ui/input.tsx";
import { PaymentQuickViewDialog } from "./PaymentQuickViewDialog.tsx";

const PaymentsListing: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<PaymentResponse[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<PaymentResponse | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { success, error } = useToastApp();
    const navigate = useNavigate();

    const fetchPayments = useCallback(async () => {
        setIsLoading(true);
        try {
            // ID công ty lấy từ Context hoặc hardcode tạm thời
            const companyId = 'a5fbb4a1-e8bd-4749-aa6d-c422ded28107';

            const params: PaymentsApiListRequest = {
                companyId: companyId,
                page: 0,
                size: 100,
            };

            const response = await corePaymentsApi.list(params);

            const payments = response.data.data?.content || [];
            setData(payments);
        } catch (err) {
            console.error("Error fetching payments:", err);
            error("Không thể tải danh sách thanh toán.");
        } finally {
            setIsLoading(false);
        }
    }, [error]);

    // Mở quick-view dialog khi click vào row
    const handleRowClick = useCallback((payment: PaymentResponse) => {
        setSelectedPayment(payment);
        setDialogOpen(true);
    }, []);

    // Từ dialog: điều hướng xem chi tiết
    const handleView = useCallback((payment: PaymentResponse) => {
        if (!payment.id) return;
        navigate(`/payments/${payment.id}`);
    }, [navigate]);

    // Từ dialog hoặc dropdown: điều hướng chỉnh sửa
    const handleEdit = useCallback((payment: PaymentResponse) => {
        if (!payment.id) return;
        navigate(`/payments/${payment.id}/edit`);
    }, [navigate]);

    const handleDelete = useCallback(async (payment: PaymentResponse) => {
        if (!payment.id) return;
        if (payment.journalEntryId) {
            error("Không thể xóa thanh toán đã ghi sổ. Cần hủy ghi sổ trước.");
            return;
        }

        const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa thanh toán (ID: ${payment.id}) này không? Hành động này không thể hoàn tác.`);
        if (!confirmDelete) return;

        try {
            const params: PaymentsApiDeleteRequest = {
                id: payment.id,
            };

            await corePaymentsApi._delete(params);
            success(`Đã xóa thanh toán thành công.`);
            fetchPayments();
        } catch (err) {
            console.error("Lỗi khi xóa thanh toán:", err);
            error("Không thể xóa phiếu thanh toán này.");
        }
    }, [fetchPayments, success, error]);

    const columns = useMemo(() =>
        getColumns(handleView, handleEdit, handleDelete),
        [handleView, handleEdit, handleDelete]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight">Danh sách Thu / Chi (Payments)</h2>
                <p className="text-muted-foreground">
                    Quản lý các khoản thanh toán, phiếu thu (in) và phiếu chi (out).
                </p>
            </div>

            <div className="flex justify-between items-center gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Tìm đối tác, tham chiếu..." className="pl-8" />
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchPayments}
                        disabled={isLoading}
                        title="Làm mới"
                    >
                        <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                        onClick={() => {
                            navigate("/payments/new");
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Cập nhật Thu/Chi
                    </Button>
                </div>
            </div>

            <div className="rounded-md border bg-background">
                <DataTable
                    columns={columns}
                    data={data}
                    isLoading={isLoading}
                    onRowClick={handleRowClick}
                />
            </div>

            {/* Quick-view Dialog */}
            <PaymentQuickViewDialog
                payment={selectedPayment}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onViewDetail={handleView}
                onEdit={handleEdit}
            />
        </div>
    );
};

export default PaymentsListing;
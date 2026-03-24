import React, { useEffect, useState, useMemo, useCallback } from "react";
import { DataTable } from "@components/ui/data-table.tsx";
import { getColumns } from "./columns.tsx";
import { Button } from "@components/ui/button.tsx";
import { Plus, RefreshCcw, Search } from "lucide-react";
import { invoicesApi } from "@/api";
import type { InvoiceResponse } from "@/api/generated";
import { useToastApp } from "@hooks/use-toast-app.ts";
import { useNavigate } from "react-router-dom";
import { Input } from "@components/ui/input.tsx";

const InvoicesListing: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<InvoiceResponse[]>([]);
    const { success, error } = useToastApp();
    const navigate = useNavigate();

    // Giữ cấu trúc giống PartnersListing (nếu sau này bạn có Dialog tạo nhanh invoice)
    // const [selectedInvoice, setSelectedInvoice] = useState<InvoiceResponse | null>(null);

    // 1. Hàm fetch dữ liệu dùng useCallback
    const fetchInvoices = useCallback(async () => {
        setIsLoading(true);
        try {
            // ID công ty lấy từ Context hoặc hardcode tạm thời
            const companyId = 'b7430d8f-9698-42af-8160-45dc83d1fdd8';

            // Gọi API list2 của invoices
            const response = await invoicesApi.list2(
                companyId,
                undefined, // search
                undefined, // invoiceType
                undefined, // status
                0,
                100
            );

            // Truy cập theo cấu trúc response của hệ thống
            const invoices = response.data.data?.content || [];
            setData(invoices);
        } catch (err) {
            console.error("Error fetching invoices:", err);
            error("Không thể tải danh sách hóa đơn.");
        } finally {
            setIsLoading(false);
        }
    }, [error]);

    // 2. Định nghĩa các hành động xử lý trên từng dòng
    const handleView = useCallback((invoice: InvoiceResponse) => {
        navigate(`/invoices/${invoice.id}`);
    }, [navigate]);

    const handleEdit = useCallback((invoice: InvoiceResponse) => {
        // Nếu hóa đơn dùng trang riêng để edit
        navigate(`/invoices/${invoice.id}/edit`);
    }, [navigate]);

    const handleDelete = useCallback(async (invoice: InvoiceResponse) => {
        if (!invoice.id) return;

        const confirmDelete = window.confirm(`Bạn có chắc chắn muốn hủy/xóa hóa đơn ${invoice.invoiceNumber}?`);
        if (!confirmDelete) return;

        try {
            // await invoicesApi.deleteInvoice(invoice.id);
            success(`Đã xóa hóa đơn ${invoice.invoiceNumber} thành công.`);
            fetchInvoices();
        } catch (err) {
            console.error("Lỗi khi xóa hóa đơn:", err);
            error("Không thể xóa hóa đơn này.");
        }
    }, [fetchInvoices, success, error]);

    // 3. Memoize columns
    const columns = useMemo(() =>
            getColumns(handleView, handleEdit, handleDelete),
        [handleView, handleEdit, handleDelete]);

    // 4. Gọi fetch lần đầu
    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    return (
        <div className="space-y-4">
            {/* Cấu trúc Header giống PartnersListing */}
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight">Danh sách hóa đơn</h2>
                <p className="text-muted-foreground">
                    Quản lý hóa đơn bán hàng (AR), hóa đơn mua hàng (AP) và tình trạng thanh toán.
                </p>
            </div>

            <div className="flex justify-between items-center gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Tìm số hóa đơn, đối tác..." className="pl-8" />
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchInvoices}
                        disabled={isLoading}
                        title="Làm mới"
                    >
                        <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                        onClick={() => {
                            navigate("/invoices/create");
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Thêm hóa đơn
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <DataTable
                    columns={columns}
                    data={data}
                    isLoading={isLoading}
                />
            </div>

            {/* Nếu sau này bạn có InvoiceDialog (giống PartnerDialog) thì thêm ở đây */}
        </div>
    );
};

export default InvoicesListing;
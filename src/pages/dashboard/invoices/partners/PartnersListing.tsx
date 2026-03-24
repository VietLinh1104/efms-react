import React, { useEffect, useState, useMemo, useCallback } from "react";
import { DataTable } from "@components/ui/data-table.tsx";
import { getColumns } from "./columns.tsx";
import { Button } from "@components/ui/button.tsx";
import { Plus, RefreshCcw, Search } from "lucide-react";
import { partnersApi } from "@/api";
import type { PartnerResponse} from "@/api/generated";
import { useToastApp } from "@hooks/use-toast-app.ts";
import { useNavigate } from "react-router-dom";
import { Input } from "@components/ui/input.tsx";
import {PartnerDialog} from "@pages/dashboard/invoices/partners/PartnerDialog.tsx";

const PartnersListing: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<PartnerResponse[]>([]);
    const { success, error } = useToastApp();
    const [selectedPartner, setSelectedPartner] = React.useState<PartnerResponse | null>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const navigate = useNavigate();

    // 1. Hàm fetch dữ liệu dùng useCallback để tránh tạo mới function mỗi lần render
    const fetchPartners = useCallback(async () => {
        setIsLoading(true);
        try {
            // ID công ty tạm thời để hardcode hoặc lấy từ Auth Context
            const companyId = 'b7430d8f-9698-42af-8160-45dc83d1fdd8';

            // Gọi API với đúng cấu trúc interface mới
            const response = await partnersApi.list1(companyId, undefined, undefined, 0, 100);

            // Truy cập sâu vào: response (Axios) -> .data (ApiResponse) -> .data (PagedResponse) -> .content
            const partners = response.data.data?.content || [];

            setData(partners);
        } catch (err) {
            console.error("Error fetching partners:", err);
            error("Không thể tải danh sách đối tác.");
        } finally {
            setIsLoading(false);
        }
    }, [error]);

    // 2. Định nghĩa các hành động xử lý trên từng dòng
    const handleView = useCallback((partner: PartnerResponse) => {
        navigate(`/partners/${partner.id}`);
    }, [navigate]);

    const handleEdit = useCallback((partner: PartnerResponse) => {
        setSelectedPartner(partner);
        setIsDialogOpen(true);
    }, []);

    const handleDelete = useCallback(async (partner: PartnerResponse) => {
        if (!partner.id) return;

        const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa đối tác ${partner.name}?`);
        if (!confirmDelete) return;

        try {
            // Gọi API xóa ở đây (nếu có)
            // await partnersApi.deletePartner(partner.id);
            success(`Đã xóa đối tác ${partner.name} thành công.`);
            fetchPartners(); // Load lại danh sách
        } catch (err) {
            console.error("Lỗi khi xóa đối tác:", err);
            error("Không thể xóa đối tác này.");
        }
    }, [fetchPartners, success, error]);

    // 3. Memoize columns - Truyền các handler vào getColumns
    const columns = useMemo(() =>
            getColumns(handleView, handleEdit, handleDelete),
        [handleView, handleEdit, handleDelete]);

    // 4. Gọi fetch lần đầu
    useEffect(() => {
        fetchPartners();
    }, [fetchPartners]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight">Danh sách đối tác</h2>
                <p className="text-muted-foreground">
                    Quản lý thông tin khách hàng, nhà cung cấp và các đối tác kinh doanh.
                </p>
            </div>

            <div className="flex justify-between items-center gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Tìm tên, mã số thuế..." className="pl-8" />
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchPartners}
                        disabled={isLoading}
                        title="Làm mới"
                    >
                        <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                        onClick={() => {
                            setSelectedPartner(null);
                            setIsDialogOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Thêm đối tác
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
            <PartnerDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={selectedPartner}
                onSuccess={fetchPartners}
            />
        </div>
    );
};

export default PartnersListing;
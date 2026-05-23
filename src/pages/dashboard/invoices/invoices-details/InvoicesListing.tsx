import React, { useEffect, useState, useMemo, useCallback } from "react";
import { DataTable } from "@components/ui/data-table.tsx";
import { getColumns } from "./columns.tsx";
import { getTasksColumns } from "./task-columns.tsx";
import { InvoiceDetailDialog } from "./InvoiceDetailDialog.tsx";
import { Button } from "@components/ui/button.tsx";
import { Plus, RefreshCcw, Search } from "lucide-react";
import { coreInvoicesApi, coreInvoiceApprovalApi } from "@/api";
import type {
    InvoiceResponse, InvoiceApprovalApiGetPendingApprovalsRequest,
    InvoicesApiListInvoicesRequest, InvoicesApiDeleteInvoiceRequest
} from "@/api/generated/core";
import { useToastApp } from "@hooks/use-toast-app.ts";
import { useNavigate } from "react-router-dom";
import { Input } from "@components/ui/input.tsx";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isForbidden } from "@/lib/utils";

type TaskInvoiceResponse = InvoiceResponse & {};

const InvoicesListing: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<InvoiceResponse[]>([]);

    const [isTasksLoading, setIsTasksLoading] = useState(false);
    const [tasksData, setTasksData] = useState<TaskInvoiceResponse[]>([]);

    // State cho Invoice Detail Dialog
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceResponse | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const { success, error } = useToastApp();
    const navigate = useNavigate();
    const { companyId } = useAuth();
    const [activeTab, setActiveTab] = useState("tasks");

    // 1. Hàm fetch dữ liệu Invoices
    const fetchInvoices = useCallback(async () => {
        setIsLoading(true);
        try {
            const reqUrl: InvoicesApiListInvoicesRequest = {
                companyId: companyId ?? "",
                invoiceType: undefined,
                status: undefined,
                page: 0,
                size: 100,
                partnerId: undefined,
            }
            const response = await coreInvoicesApi.listInvoices(reqUrl);
            const invoices = response.data.data?.content || [];
            setData(invoices);
        } catch (err) {
            if (isForbidden(err)) return;
            console.error("Error fetching invoices:", err);
            error("Không thể tải danh sách hóa đơn.");
        } finally {
            setIsLoading(false);
        }
    }, [companyId, error]);

    // 2. Hàm fetch dữ liệu Tasks (từ API backend)
    const fetchTasks = useCallback(async () => {
        if (!companyId) return;
        setIsTasksLoading(true);
        try {
            const reqUrl: InvoiceApprovalApiGetPendingApprovalsRequest = {
                companyId: companyId,
                page: 0,
                size: 100,
            }
            const res = await coreInvoiceApprovalApi.getPendingApprovals(reqUrl);
            const content = res.data?.data?.content || [];
            if (Array.isArray(content)) {
                setTasksData(content);
            }
        } catch (err) {
            if (isForbidden(err)) return;
            console.error("Error fetching tasks:", err);
            error("Không thể tải công việc cần xử lý.");
        } finally {
            setIsTasksLoading(false);
        }
    }, [companyId, error]);

    const handleView = useCallback((invoice: InvoiceResponse) => {
        setSelectedInvoice(invoice);
        setIsDetailOpen(true);
    }, []);

    const handleEdit = useCallback((invoice: InvoiceResponse) => {
        navigate(`/invoices/${invoice.id}/edit`);
    }, [navigate]);

    const handleDelete = useCallback(async (invoice: InvoiceResponse) => {
        if (!invoice.id) return;

        const confirmDelete = window.confirm(`Bạn có chắc chắn muốn hủy/xóa hóa đơn ${invoice.invoiceNumber}?`);
        if (!confirmDelete) return;

        const reqDelete: InvoicesApiDeleteInvoiceRequest = {
            id: invoice.id
        };

        // Bật loading
        setIsLoading(true);

        try {
            const res = await coreInvoicesApi.deleteInvoice(reqDelete);

            // Kiểm tra success ngay trong block try
            if (res.data.status === 200) {
                success("Xóa hóa đơn thành công");
                fetchInvoices(); // Làm mới danh sách
            } else {
                error("Đã xảy ra lỗi khi xóa hóa đơn");
            }
        } catch (err) {
            if (isForbidden(err)) return;
            console.error("Lỗi khi xóa hóa đơn:", err);
            error("Không thể xóa hóa đơn này.");
        } finally {
            // Luôn tắt loading dù thành công hay thất bại (ĐÂY LÀ CHUẨN NHẤT)
            setIsLoading(false);
        }
    }, [success, error, fetchInvoices, setIsLoading]); // Đã bổ sung đầy đủ dependencies

    const columns = useMemo(() =>
        getColumns(handleView, handleEdit, handleDelete),
        [handleView, handleEdit, handleDelete]);

    const tasksColumns = useMemo(() =>
        getTasksColumns(navigate, error),
        [navigate, error]);

    const refreshData = () => {
        if (activeTab === "all") fetchInvoices();
        else fetchTasks();
    };

    useEffect(() => {
        fetchInvoices();
        fetchTasks();
    }, [fetchInvoices, fetchTasks]);



    return (
        <div className="space-y-4">
            {/* Invoice Detail Dialog */}
            <InvoiceDetailDialog
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                invoice={selectedInvoice}
            />
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight">Hóa đơn & Chứng từ</h2>
                <p className="text-muted-foreground">
                    Quản lý hóa đơn bán hàng (AR), hóa đơn mua hàng (AP) và phê duyệt thanh toán.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                    <TabsList>
                        <TabsTrigger value="tasks" className="relative">
                            Công việc cần xử lý
                            {/* {tasksData.length > 0 && (
                                <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white">
                                    {tasksData.length}
                                </span>
                            )} */}
                        </TabsTrigger>
                        <TabsTrigger value="all">Tất cả hóa đơn</TabsTrigger>
                    </TabsList>
                </Tabs>

            </div>

            {/*<div className="">*/}

            <div className="p-0">
                <div className="flex mb-4 justify-between">
                    <div className="relative max-w-sm w-full ">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Tìm số hóa đơn, đối tác..." className="pl-8" />

                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={refreshData}
                            disabled={isLoading || isTasksLoading}
                            title="Làm mới"
                        >
                            <RefreshCcw className={`h-4 w-4 ${(isLoading || isTasksLoading) ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button
                            onClick={() => navigate("/invoices/create")}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Thêm hóa đơn
                        </Button>
                    </div>
                </div>
                {activeTab === "all" ? (
                    <DataTable
                        columns={columns}
                        data={data}
                        isLoading={isLoading}
                        onRowClick={handleView}
                    />
                ) : (
                    <DataTable
                        columns={tasksColumns}
                        data={tasksData}
                        isLoading={isTasksLoading}
                        onRowClick={handleView}
                    />
                )}
            </div>
        </div>
    );
};

export default InvoicesListing;
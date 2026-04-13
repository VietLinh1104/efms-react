import React, { useEffect, useState, useMemo, useCallback } from "react";
import { DataTable } from "@components/ui/data-table.tsx";
import { getColumns } from "./columns.tsx";
import { Button } from "@components/ui/button.tsx";
import { Plus, RefreshCcw, Search, CheckSquare } from "lucide-react";
import { coreInvoicesApi } from "@/api";
import type { InvoiceResponse, InvoicesApiList2Request } from "@/api/generated/core";
import { useToastApp } from "@hooks/use-toast-app.ts";
import { useNavigate } from "react-router-dom";
import { Input } from "@components/ui/input.tsx";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axiosInstance from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";

interface ExtTask {
    id: string;
    name: string;
    processName: string;
    creationDate: string;
    processInstanceKey: string;
    invoiceData?: InvoiceResponse;
}

const InvoicesListing: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<InvoiceResponse[]>([]);

    const [isTasksLoading, setIsTasksLoading] = useState(false);
    const [tasksData, setTasksData] = useState<ExtTask[]>([]);

    const { success, error } = useToastApp();
    const navigate = useNavigate();
    const { companyId } = useAuth();
    const [activeTab, setActiveTab] = useState("all");

    // 1. Hàm fetch dữ liệu Invoices
    const fetchInvoices = useCallback(async () => {
        setIsLoading(true);
        try {
            const reqUrl: InvoicesApiList2Request = {
                companyId: companyId ?? "",
                invoiceType: undefined,
                status: undefined,
                page: 0,
                size: 100,
                partnerId: undefined,
            }
            const response = await coreInvoicesApi.list2(reqUrl);
            const invoices = response.data.data?.content || [];
            setData(invoices);
        } catch (err) {
            console.error("Error fetching invoices:", err);
            error("Không thể tải danh sách hóa đơn.");
        } finally {
            setIsLoading(false);
        }
    }, [companyId, error]);

    // 2. Hàm fetch dữ liệu Tasks (từ API backend)
    const fetchTasks = useCallback(async () => {
        setIsTasksLoading(true);
        try {
            const res = await axiosInstance.get('/core/invoices/tasks');
            const dataFields = res.data?.data || [];
            if (Array.isArray(dataFields)) {
                setTasksData(dataFields);
            }
        } catch (err) {
            console.error("Error fetching tasks:", err);
            error("Không thể tải công việc cần xử lý.");
        } finally {
            setIsTasksLoading(false);
        }
    }, [error]);

    const handleView = useCallback((invoice: InvoiceResponse) => {
        navigate(`/invoices/${invoice.id}`);
    }, [navigate]);

    const handleEdit = useCallback((invoice: InvoiceResponse) => {
        navigate(`/invoices/${invoice.id}/edit`);
    }, [navigate]);

    const handleDelete = useCallback(async (invoice: InvoiceResponse) => {
        if (!invoice.id) return;
        const confirmDelete = window.confirm(`Bạn có chắc chắn muốn hủy/xóa hóa đơn ${invoice.invoiceNumber}?`);
        if (!confirmDelete) return;

        try {
            success(`Tính năng xóa hóa đơn đang được cập nhật.`);
        } catch (err) {
            console.error("Lỗi khi xóa hóa đơn:", err);
            error("Không thể xóa hóa đơn này.");
        }
    }, [success, error]);

    const columns = useMemo(() =>
        getColumns(handleView, handleEdit, handleDelete),
        [handleView, handleEdit, handleDelete]);

    const refreshData = () => {
        if (activeTab === "all") fetchInvoices();
        else fetchTasks();
    };

    useEffect(() => {
        fetchInvoices();
        fetchTasks();
    }, [fetchInvoices, fetchTasks]);

    // 3. Define columns cho Tasks
    const tasksColumns: ColumnDef<ExtTask>[] = [
        {
            accessorKey: "name",
            header: "Nhiệm vụ",
            cell: ({ row }) => <div className="font-semibold text-blue-600">{row.original.name || "Task"}</div>,
        },
        {
            accessorKey: "invoiceNumber",
            header: "Số hóa đơn",
            cell: ({ row }) => <div>{row.original.invoiceData?.invoiceNumber || "DRAFT"}</div>,
        },
        {
            accessorKey: "partner",
            header: "Đối tác",
            cell: ({ row }) => <div>{row.original.invoiceData?.partnerName || "---"}</div>,
        },
        {
            accessorKey: "totalAmount",
            header: () => <div className="text-right">Tổng tiền</div>,
            cell: ({ row }) => {
                const invoice = row.original.invoiceData;
                const amt = invoice?.totalAmount || 0;
                return (
                    <div className="text-right font-medium">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: invoice?.currencyCode || "VND" }).format(amt)}
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => {
                const status = (row.original.invoiceData as any)?.approvalStatus || "pending";
                return <Badge className="uppercase" variant="secondary">{status}</Badge>;
            }
        },
        {
            id: "actions",
            header: () => <div className="text-center">Thao tác</div>,
            cell: ({ row }) => {
                const invoice = row.original.invoiceData;
                return (
                    <div className="flex justify-center">
                        <Button
                            variant="outline" size="sm"
                            className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-none"
                            onClick={() => {
                                if (invoice?.id) {
                                    navigate(`/invoices/${invoice.id}`)
                                } else {
                                    error("Tác vụ không có ID hóa đơn hợp lệ.");
                                }
                            }}
                        >
                            <CheckSquare className="w-4 h-4 mr-2" /> Xử lý
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight">Hóa đơn & Chấm duyệt</h2>
                <p className="text-muted-foreground">
                    Quản lý hóa đơn bán hàng (AR), hóa đơn mua hàng (AP) và phê duyệt từ Camunda 8.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                    <TabsList>
                        <TabsTrigger value="all">Tất cả hóa đơn</TabsTrigger>
                        <TabsTrigger value="tasks" className="relative">
                            Công việc cần xử lý
                            {tasksData.length > 0 && (
                                <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                    {tasksData.length}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

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

            <div className="rounded-md border bg-card">
                {activeTab === "all" ? (
                    <div className="p-4">
                        <div className="relative max-w-sm w-full mb-4">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Tìm số hóa đơn, đối tác..." className="pl-8" />
                        </div>
                        <DataTable
                            columns={columns}
                            data={data}
                            isLoading={isLoading}
                        />
                    </div>
                ) : (
                    <div className="p-4">
                        <DataTable
                            columns={tasksColumns}
                            data={tasksData}
                            isLoading={isTasksLoading}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoicesListing;
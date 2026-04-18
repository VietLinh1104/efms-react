import React, { useEffect, useState, useMemo, useCallback } from "react";
import { DataTable } from "@components/ui/data-table.tsx";
import { getColumns } from "./columns.tsx";
import { Button } from "@components/ui/button.tsx";
import { Plus, RefreshCcw, Search, CheckSquare } from "lucide-react";
import { coreInvoicesApi,coreInvoiceApprovalControllerApi } from "@/api";
import type { InvoiceResponse, InvoicesApiList2Request ,InvoiceApprovalControllerApiGetAllTasksRequest} from "@/api/generated/core";
import { useToastApp } from "@hooks/use-toast-app.ts";
import { useNavigate } from "react-router-dom";
import { Input } from "@components/ui/input.tsx";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";

type TaskInvoiceResponse = InvoiceResponse & {
    taskId?: string;
    taskName?: string;
};

const InvoicesListing: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<InvoiceResponse[]>([]);

    const [isTasksLoading, setIsTasksLoading] = useState(false);
    const [tasksData, setTasksData] = useState<TaskInvoiceResponse[]>([]);

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
            const reqUrl: InvoiceApprovalControllerApiGetAllTasksRequest = {
                page: 0,
                size: 100,
            }
            const res = await coreInvoiceApprovalControllerApi.getAllTasks(reqUrl);
            const content = res.data?.data?.content || [];
            if (Array.isArray(content)) {
                setTasksData(content);
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
    const tasksColumns: ColumnDef<TaskInvoiceResponse>[] = [
        {
            accessorKey: "taskName",
            header: "Nhiệm vụ",
            cell: ({ row }) => <div className="font-semibold text-blue-600">{row.original.taskName || "Phê duyệt hoá đơn"}</div>,
        },
        {
            accessorKey: "invoiceNumber",
            header: "Số hóa đơn",
            cell: ({ row }) => <div>{row.original.invoiceNumber || "DRAFT"}</div>,
        },
        {
            accessorKey: "partner",
            header: "Đối tác",
            cell: ({ row }) => <div>{row.original.partnerName || "---"}</div>,
        },
        {
            accessorKey: "totalAmount",
            header: () => <div className="text-right">Tổng tiền</div>,
            cell: ({ row }) => {
                const amt = row.original.totalAmount || 0;
                return (
                    <div className="text-right font-medium">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: row.original.currencyCode || "VND" }).format(amt)}
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => {
                const status = (row.original as any)?.approvalStatus || "pending";
                return <Badge className="uppercase" variant="secondary">{status}</Badge>;
            }
        },
        {
            id: "actions",
            header: () => <div className="text-center">Thao tác</div>,
            cell: ({ row }) => {
                const invoice = row.original;
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
                            />
                        ) : (
                            <DataTable
                                columns={tasksColumns}
                                data={tasksData}
                                isLoading={isTasksLoading}
                            />
                        )}
                    </div>
        </div>
    );
};

export default InvoicesListing;
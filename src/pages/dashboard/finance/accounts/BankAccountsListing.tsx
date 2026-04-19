import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@components/ui/data-table.tsx";
import { getColumns } from "./columns.tsx";
import { Button } from "@components/ui/button.tsx";
import { Input } from "@components/ui/input.tsx";
import { Plus, RefreshCcw, Search } from "lucide-react";

import type { BankAccountResponse, BankAccountsApiList3Request, BankAccountsApiToggleActive1Request } from "@/api/generated/core";
import { useToastApp } from "@hooks/use-toast-app.ts";
import { BankAccountDialog } from "./BankAccountDialog.tsx";
import { coreBankAccountsApi } from "@/api";
import { useAuth } from "@/hooks/useAuth";

const BankAccountsListing: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<BankAccountResponse[]>([]);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selected, setSelected] = useState<BankAccountResponse | null>(null);
    const { success, error } = useToastApp();
    const { companyId } = useAuth();

    const fetchAccounts = useCallback(async (q?: string) => {
        setIsLoading(true);
        try {
            const BankAccountsApiList3Request: BankAccountsApiList3Request = {
                companyId: companyId ?? "",
                type: undefined,
                search: q || "",
                page: 0,
                size: 100,
            };
            const res = await coreBankAccountsApi.list3(BankAccountsApiList3Request);
            setData(res.data.data?.content || []);
        } catch (e) {
            console.error(e);
            error("Không thể tải danh sách tài khoản.");
        } finally {
            setIsLoading(false);
        }
    }, [error]);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    const handleEdit = useCallback((row: BankAccountResponse) => {
        setSelected(row);
        setDialogOpen(true);
    }, []);

    const handleToggleActive = useCallback(async (row: BankAccountResponse) => {
        if (!row.id) return;
        try {
            const bankAccountsApiToggleActive1Request: BankAccountsApiToggleActive1Request = {
                id: row.id,
            };
            await coreBankAccountsApi.toggleActive1(bankAccountsApiToggleActive1Request);
            success(`Đã ${row.isActive ? "vô hiệu hóa" : "kích hoạt"} tài khoản.`);
            fetchAccounts(search);
        } catch (e) {
            console.error(e);
            error("Thao tác thất bại.");
        }
    }, [fetchAccounts, search, success, error]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchAccounts(search);
    };

    const columns = useMemo(
        () => getColumns(handleEdit, handleToggleActive),
        [handleEdit, handleToggleActive],
    );

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight">Tài khoản Ngân hàng & Tiền mặt</h2>
                <p className="text-muted-foreground">
                    Quản lý các tài khoản ngân hàng và quỹ tiền mặt của doanh nghiệp.
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex justify-between items-center gap-4">
                <form onSubmit={handleSearch} className="relative max-w-sm w-full flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm tên, ngân hàng..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button type="submit" variant="outline" size="sm">Tìm</Button>
                </form>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => fetchAccounts(search)}
                        disabled={isLoading}
                        title="Làm mới"
                    >
                        <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    </Button>
                    <Button
                        onClick={() => {
                            setSelected(null);
                            setDialogOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Thêm tài khoản
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-background">
                <DataTable
                    columns={columns}
                    data={data}
                    isLoading={isLoading}
                />
            </div>

            {/* Dialog: Create / Edit */}
            <BankAccountDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                initialData={selected}
                onSuccess={() => fetchAccounts(search)}
            />
        </div>
    );
};

export default BankAccountsListing;
